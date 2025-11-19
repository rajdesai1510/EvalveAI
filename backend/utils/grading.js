const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PDFParser = require('pdf2json');
const { getTextEmbedding } = require('./aiUtils');
const { gradeSubmissionWithReference, findSimilarSubmissions } = require('./ragEvaluator');
require('dotenv').config();
/**
 * Downloads a file from a URL to a local temporary directory
 * @param {String} fileUrl - The URL of the file to download
 * @returns {Promise<String>} - Path to the downloaded file
 */
const downloadFileFromUrl = async (fileUrl) => {
    try {
        console.log('Downloading file from URL:', fileUrl);
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Generate a temp file name from the URL or use a timestamp
        const fileName = fileUrl.split('/').pop() || `temp-${Date.now()}.pdf`;
        const tempFilePath = path.join(tempDir, fileName);
        
        // Download the file
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'arraybuffer'
        });
        
        // Save the file
        fs.writeFileSync(tempFilePath, response.data);
        console.log('File downloaded to:', tempFilePath);
        
        return tempFilePath;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error(`Failed to download file: ${error.message}`);
    }
};

/**
 * Extracts text from a PDF file
 * @param {String} pdfPathOrUrl - Path or URL to the PDF file
 * @returns {Promise<String>} - Extracted text
 */
const extractTextFromPDF = async (pdfPathOrUrl) => {
    let localFilePath = null;
    let isTemp = false;
    
    try {
        // Determine if this is a URL or local path
        if (pdfPathOrUrl.startsWith('http')) {
            // It's a URL, download it
            localFilePath = await downloadFileFromUrl(pdfPathOrUrl);
            isTemp = true;
        } else {
            // It's a local path, check if it exists
            if (fs.existsSync(pdfPathOrUrl)) {
                localFilePath = pdfPathOrUrl;
            } else {
                // Local file doesn't exist, try to extract the filename and treat as URL
                const fileName = path.basename(pdfPathOrUrl);
                // Reconstruct a Firebase URL (or adjust based on your storage pattern)
                const fileUrl = `https://storage.googleapis.com/ai-evaluation-522e1.firebasestorage.app/submissions/${fileName}`;
                console.log('Local file not found, trying URL:', fileUrl);
                localFilePath = await downloadFileFromUrl(fileUrl);
                isTemp = true;
            }
        }
        
        console.log('Extracting text from PDF:', localFilePath);
        
        // Parse the PDF
        const pdfParser = new PDFParser(null, 1);
        const pdfText = await new Promise((resolve, reject) => {
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                let text = '';
                for (let page of pdfData.Pages) {
                    for (let textItem of page.Texts) {
                        if (textItem.R && textItem.R.length > 0) {
                            text += textItem.R.map(r => decodeURIComponent(r.T)).join('') + ' ';
                        }
                    }
                    text += '\n'; // Add newline between pages
                }
                resolve(text.trim());
            });
            pdfParser.on('pdfParser_dataError', (error) => {
                console.error('PDF parsing error:', error);
                reject(error);
            });
            pdfParser.loadPDF(localFilePath);
        });
        
        // Clean up temp file if needed
        if (isTemp && localFilePath) {
            try {
                fs.unlinkSync(localFilePath);
                console.log('Temporary file deleted:', localFilePath);
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        }
        
        return pdfText;
    } catch (error) {
        // Clean up temp file in case of error
        if (isTemp && localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (err) {
                // Ignore cleanup errors
            }
        }
        
        console.error('Error extracting PDF text:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};

/**
 * Grade a submission by comparing against ideal answers
 * @param {Object} submission - The submission object
 * @param {Object} assignment - The assignment with ideal answers
 * @returns {Promise<Object>} - Grading result
 */
const gradeSubmission = async (submission, assignment) => {
    try {
        console.log('Grading submission:', {
            submissionUrl: submission.submissionUrl,
            assignmentId: assignment._id
        });
        
        // Extract text from the submission PDF
        let submissionText;
        try {
            submissionText = await extractTextFromPDF(submission.submissionUrl);
            console.log('Successfully extracted submission text, length:', submissionText.length);
        } catch (error) {
            console.error('Error extracting submission text:', error);
            throw new Error(`Failed to extract text from submission: ${error.message}`);
        }

        const embedding = await getTextEmbedding(submissionText);
        const matches = await findSimilarSubmissions(assignment._id, embedding, 3);
        const suspect = matches.find(match => match.submissionId !== submission._id.toString() && match.score > 0.9);

        if (suspect) {
            return {
                questions: [],
                totalGrade: 0,
                overallFeedback: 'Submission flagged as copied based on similarity analysis.',
                similarity: suspect
            };
        }

        const ragResult = await gradeSubmissionWithReference({
            assignment,
            submissionText,
            embedding
        });

        return {
            questions: [],
            totalGrade: ragResult.grade ?? 0,
            overallFeedback: ragResult.feedback,
            referenceContext: ragResult.referenceChunks || []
        };
    } catch (error) {
        console.error('Grading error:', error);
        throw error;
    }
};

module.exports = {
    extractTextFromPDF,
    gradeSubmission
}; 
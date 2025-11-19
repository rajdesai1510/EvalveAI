const axios = require('axios');
const { extractTextFromPdf, getTextEmbedding } = require('./aiUtils');
const { upsertVectors, queryVectors, deleteNamespace, chunkText } = require('./vectorStore');
require('dotenv').config();

const buildNamespace = (assignmentId) => assignmentId?.toString();

const sanitizeSnippet = (text = '', limit = 600) => text.replace(/\s+/g, ' ').trim().slice(0, limit);

const storeReferenceDocument = async (assignmentId, referenceUrl) => {
    if (!assignmentId || !referenceUrl) return { chunkCount: 0 };
    const namespace = buildNamespace(assignmentId);
    const referenceText = await extractTextFromPdf(referenceUrl);

    if (!referenceText) {
        throw new Error('Unable to extract text from reference document');
    }

    const chunks = chunkText(referenceText);
    const vectors = [];

    for (let i = 0; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        const embedding = await getTextEmbedding(chunk);
        vectors.push({
            id: `ref-${assignmentId}-${i}`,
            values: embedding,
            metadata: {
                type: 'reference',
                assignmentId: assignmentId.toString(),
                chunkIndex: i,
                textSnippet: sanitizeSnippet(chunk)
            }
        });
    }

    await upsertVectors(namespace, vectors);
    return { chunkCount: chunks.length };
};

const saveSubmissionEmbedding = async (assignmentId, submissionId, embedding, snippet = '') => {
    if (!assignmentId || !submissionId || !embedding?.length) return;
    const namespace = buildNamespace(assignmentId);
    await upsertVectors(namespace, [{
        id: `sub-${submissionId}`,
        values: embedding,
        metadata: {
            type: 'submission',
            assignmentId: assignmentId.toString(),
            submissionId: submissionId.toString(),
            textSnippet: sanitizeSnippet(snippet)
        }
    }]);
};

const findSimilarSubmissions = async (assignmentId, embedding, topK = 3) => {
    const namespace = buildNamespace(assignmentId);
    const matches = await queryVectors({
        namespace,
        vector: embedding,
        topK,
        filter: { type: { $eq: 'submission' } }
    });
    return matches.map(match => ({
        submissionId: match.metadata?.submissionId,
        score: match.score ?? 0,
        snippet: match.metadata?.textSnippet || ''
    }));
};

const fetchReferenceContext = async (assignmentId, embedding, topK = 5) => {
    const namespace = buildNamespace(assignmentId);
    const matches = await queryVectors({
        namespace,
        vector: embedding,
        topK,
        filter: { type: { $eq: 'reference' } }
    });

    return matches.map(match => ({
        score: match.score ?? 0,
        chunkIndex: match.metadata?.chunkIndex,
        text: match.metadata?.textSnippet || ''
    }));
};

const gradeSubmissionWithReference = async ({ assignment, submissionText, embedding }) => {
    if (!assignment) throw new Error('Assignment is required');
    const submissionEmbedding = embedding || await getTextEmbedding(submissionText);
    const referenceChunks = await fetchReferenceContext(assignment._id, submissionEmbedding, 5);

    if (!referenceChunks.length) {
        return {
            grade: null,
            feedback: 'No reference material available to grade this submission.',
            referenceChunks: []
        };
    }

    const contextBlock = referenceChunks
        .map((chunk, index) => `Context ${index + 1} (score ${chunk.score?.toFixed(3) || 0}): ${chunk.text}`)
        .join('\n\n');

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an academic evaluator who strictly grades based on the provided reference material.'
                    },
                    {
                        role: 'user',
                        content: `
Assignment Title: ${assignment.title}
Maximum Marks: ${assignment.maxMarks}

Reference Material Extracts:
${contextBlock}

Student Submission:
${submissionText.substring(0, 6000)}

1. Only award marks for points grounded in the reference extracts.
2. Penalize fabricated or irrelevant information.

Respond in JSON with:
{
  "grade": number,
  "feedback": "string summary of correctness and gaps"
}
                        `
                    }
                ],
                temperature: 0.2,
                max_tokens: 800
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices?.[0]?.message?.content?.trim();
        const match = content?.match(/\{[\s\S]*\}/);
        let parsed = {};
        if (match) {
            parsed = JSON.parse(match[0]);
        }

        const rawGrade = Number(parsed.grade);
        const safeGrade = Number.isFinite(rawGrade)
            ? Math.min(Math.max(rawGrade, 0), assignment.maxMarks)
            : null;

        return {
            grade: safeGrade,
            feedback: parsed.feedback || 'Evaluation completed.',
            referenceChunks,
            embedding: submissionEmbedding
        };
    } catch (error) {
        console.error('RAG grading error:', error.message);
        return {
            grade: null,
            feedback: 'Automatic grading failed. Please review manually.',
            referenceChunks,
            embedding: submissionEmbedding
        };
    }
};

const purgeAssignmentVectors = async (assignmentId) => {
    await deleteNamespace(buildNamespace(assignmentId));
};

module.exports = {
    storeReferenceDocument,
    saveSubmissionEmbedding,
    findSimilarSubmissions,
    fetchReferenceContext,
    gradeSubmissionWithReference,
    purgeAssignmentVectors
};


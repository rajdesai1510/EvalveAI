import React from 'react';
import { getBaseUrl } from '../../config/api.config';

const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const StudentAssignmentView = ({ assignments, onSubmit }) => {
    const handleViewFile = (fileUrl) => {
        try {
            if (!fileUrl) {
                console.error('No file URL available');
                return;
            }

            console.log('Opening file URL:', fileUrl);
            
            // Directly open the URL in a new tab
            window.open(fileUrl, '_blank');
        } catch (error) {
            console.error('Error viewing file:', error);
            console.error('Error opening file');
        }
    };

    const handleViewSubmission = (submissionUrl) => {
        try {
            if (!submissionUrl) {
                console.error('No submission available');
                return;
            }
            
            console.log('Opening submission URL:', submissionUrl);
            
            // Directly open the URL in a new tab
            window.open(submissionUrl, '_blank');
        } catch (error) {
            console.error('Error viewing submission:', error);
            console.error('Error opening submission');
        }
    };

    return (
        <div className="space-y-4">
            {assignments.map(assignment => (
                <div key={assignment._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold">{assignment.title}</h3>
                            <p className="text-gray-600">{assignment.description}</p>
                            {assignment.handwrittenRequired && (
                                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-amber-800 bg-amber-100 mt-2">
                                    <i className="fas fa-pen-fancy mr-1"></i>
                                    Handwritten submission required
                                </div>
                            )}
                            {assignment.assignmentFile && (
                                <div className="mt-2">
                                    <a 
                                        href={getBaseUrl(`${assignment.assignmentFile}`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        View Assignment PDF
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                Due: {formatDate(assignment.dueDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Max Marks: {assignment.maxMarks}
                            </p>
                        </div>
                    </div>

                    {assignment.submission ? (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Your Submission</h4>
                            <p className="text-sm text-gray-600">
                                Submitted on: {formatDate(assignment.submission.submittedAt)}
                            </p>
                            {assignment.submission.submissionUrl && (
                                <a 
                                    href={getBaseUrl(`${assignment.submission.submissionUrl}`)}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                    View Your Submission
                                </a>
                            )}
                            {assignment.submission.grade !== null && (
                                <div className="mt-2">
                                    <p className="font-medium">
                                        Grade: {assignment.submission.grade}/{assignment.maxMarks}
                                    </p>
                                    {assignment.submission.feedback && (
                                        <p className="text-gray-700 mt-1">
                                            Feedback: {assignment.submission.feedback}
                                        </p>
                                    )}
                                </div>
                            )}
                            {assignment.handwrittenRequired && (
                                <div className={`mt-3 text-sm flex items-center gap-2 ${assignment.submission.handwrittenDetected ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                                    <i className={`fas ${assignment.submission.handwrittenDetected ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                                    {assignment.submission.handwrittenDetected
                                        ? 'System detected this as a handwritten submission.'
                                        : 'System detected this as typed text. Handwritten work was required.'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4">
                            <button
                                onClick={() => onSubmit(assignment)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                disabled={new Date(assignment.dueDate) < new Date()}
                            >
                                Submit Assignment
                            </button>
                            {new Date(assignment.dueDate) < new Date() && (
                                <p className="text-red-500 text-sm mt-2">
                                    Submission deadline has passed
                                </p>
                            )}
                            {assignment.handwrittenRequired && (
                                <p className="text-amber-600 text-sm mt-2 flex items-center gap-2">
                                    <i className="fas fa-pen"></i>
                                    This assignment needs a handwritten submission scanned to PDF. Typed files will be rejected automatically.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StudentAssignmentView; 
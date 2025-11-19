const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissionUrl: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    grade: {
        type: Number
    },
    feedback: {
        type: String
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    plagiarismScore: {
        type: Number,
        default: 0
    },
    plagiarismFlag: {
        type: Boolean,
        default: false
    },
    embedding: {
        type: [Number],
        default: []
    },
    ragFeedback: {
        type: String
    },
    referenceContext: {
        type: [String],
        default: []
    },
    referenceSimilarity: {
        type: Number,
        default: 0
    },
    ocrUsed: {
        type: Boolean,
        default: false
    },
    handwrittenDetected: {
        type: Boolean,
        default: false
    },
    plagiarismSourceSubmissionId: {
        type: String
    }
});

const referenceMaterialSchema = new mongoose.Schema({
    url: String,
    filePath: String,
    chunkCount: Number,
    indexedAt: Date
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    assignmentFile: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: false
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissions: [submissionSchema],
    idealAnswers: {
        type: Object,
        required: true,
        default: {
            questions: [{
                questionNumber: 1,
                idealAnswer: "Please review manually",
                keyPoints: ["Manual review required"],
                maxMarks: 100,
                markingCriteria: ["Review submission thoroughly"]
            }],
            totalMarks: 100
        }
    },
    referenceMaterial: referenceMaterialSchema,
    handwrittenRequired: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save hook to ensure filePath is set
assignmentSchema.pre('save', function(next) {
    // If filePath is not set but assignmentFile is available, derive filePath from URL
    if ((!this.filePath || this.filePath === 'undefined') && this.assignmentFile) {
        const urlParts = this.assignmentFile.split('/');
        this.filePath = `assignments/${urlParts[urlParts.length - 1]}`;
        console.log('Derived filePath before save:', this.filePath);
    }
    next();
});

assignmentSchema.post('findOneAndDelete', async function(doc) {
    if (!doc) return;
    try {
        const { purgeAssignmentVectors } = require('../utils/ragEvaluator');
        await purgeAssignmentVectors(doc._id);
    } catch (error) {
        console.error('Failed to purge Pinecone vectors for deleted assignment:', error.message);
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
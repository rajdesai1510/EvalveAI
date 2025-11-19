const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

let pineconeClient;
let baseIndex;
let connectionLogged = false;

const getBaseIndex = () => {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    if (!apiKey || !indexName) {
        throw new Error('PINECONE_API_KEY and PINECONE_INDEX_NAME must be configured');
    }

    if (!pineconeClient) {
        pineconeClient = new Pinecone({ apiKey });
    }

    if (!baseIndex) {
        baseIndex = pineconeClient.index(indexName);
        if (!connectionLogged) {
            console.log(`Connected to Pinecone index "${indexName}"`);
            connectionLogged = true;
        }
    }

    return baseIndex;
};

const getIndex = (namespace) => {
    const index = getBaseIndex();
    return namespace ? index.namespace(namespace) : index;
};

const upsertVectors = async (namespace, vectors = []) => {
    if (!vectors.length) return;
    try {
        const index = getIndex(namespace);
        await index.upsert(vectors);
    } catch (error) {
        console.error('Pinecone upsert error:', error.message);
    }
};

const queryVectors = async ({ namespace, vector, topK = 5, filter }) => {
    if (!vector || !Array.isArray(vector) || !vector.length) return [];
    try {
        const index = getIndex(namespace);
        const response = await index.query({
            topK,
            vector,
            filter,
            includeMetadata: true
        });
        return response.matches || [];
    } catch (error) {
        console.error('Pinecone query error:', error.message);
        return [];
    }
};

const deleteNamespace = async (namespace) => {
    if (!namespace) return;
    try {
        const index = getIndex(namespace);
        await index.deleteAll();
    } catch (error) {
        console.error('Pinecone delete error:', error.message);
    }
};

const chunkText = (text = '', chunkSize = 1200, overlap = 200) => {
    if (!text) return [];
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const chunks = [];
    let start = 0;

    while (start < cleanText.length) {
        const chunk = cleanText.slice(start, start + chunkSize);
        chunks.push(chunk);
        start += chunkSize - overlap;
    }

    return chunks;
};

module.exports = {
    upsertVectors,
    queryVectors,
    deleteNamespace,
    chunkText
};


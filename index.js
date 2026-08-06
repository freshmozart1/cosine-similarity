/**
 * A simple function to calculate the cosine similarity between two vectors.
 * @param {number[]} a 
 * @param {number[]} b 
 */
export function cosineSimilarity(a, b) {
    if (a.length !== b.length) throw new Error('Vectors must be the same length');
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
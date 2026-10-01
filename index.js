/**
 * Calculate cosine similarity for equal-length vectors of finite numbers.
 * Nonzero vectors are scaled independently to avoid magnitude overflow or
 * underflow. A zero vector (including an empty vector) produces NaN.
 * @param {readonly number[]} a
 * @param {readonly number[]} b
 * @returns {number} The cosine, subject to floating-point rounding.
 */
export function cosineSimilarity(a, b) {
    if (a.length !== b.length) throw new Error('Vectors must be the same length');
    let scaleA = 0;
    let scaleB = 0;
    for (let i = 0; i < a.length; i++) {
        scaleA = Math.max(scaleA, Math.abs(a[i]));
        scaleB = Math.max(scaleB, Math.abs(b[i]));
    }
    if (scaleA === 0 || scaleB === 0) return NaN;

    let dotProduct = 0;
    let squaredMagnitudeA = 0;
    let squaredMagnitudeB = 0;
    for (let i = 0; i < a.length; i++) {
        const scaledA = a[i] / scaleA;
        const scaledB = b[i] / scaleB;
        dotProduct += scaledA * scaledB;
        squaredMagnitudeA += scaledA * scaledA;
        squaredMagnitudeB += scaledB * scaledB;
    }
    return dotProduct / (Math.sqrt(squaredMagnitudeA) * Math.sqrt(squaredMagnitudeB));
}

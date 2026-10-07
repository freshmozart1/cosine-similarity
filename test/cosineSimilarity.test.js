import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cosineSimilarity } from '../index.js';

function assertNear(actual, expected) {
    assert.ok(Number.isFinite(actual), `Expected a finite score, received ${actual}`);
    assert.ok(Math.abs(actual - expected) <= 1e-12, `${actual} differs from ${expected}`);
}

for (const magnitude of [1, 1e200, 1e-200, Number.MAX_VALUE, Number.MIN_VALUE]) {
    test(`parallel and opposite vectors at magnitude ${magnitude}`, () => {
        assertNear(cosineSimilarity([magnitude], [magnitude]), 1);
        assertNear(cosineSimilarity([magnitude, magnitude], [magnitude, magnitude]), 1);
        assertNear(cosineSimilarity([magnitude], [-magnitude]), -1);
        assertNear(cosineSimilarity([magnitude, magnitude], [-magnitude, -magnitude]), -1);
    });
}

test('orthogonal vectors with extreme, tiny and asymmetric magnitudes', () => {
    assertNear(cosineSimilarity([1e200, 1e200], [1e-200, -1e-200]), 0);
    assertNear(cosineSimilarity([Number.MAX_VALUE, 0], [0, Number.MIN_VALUE]), 0);
    assertNear(cosineSimilarity([Number.MIN_VALUE, Number.MIN_VALUE], [1, -1]), 0);
});

test('different magnitudes in each vector preserve known angles', () => {
    assertNear(cosineSimilarity([1e308, 1e308], [1, 1]), 1);
    assertNear(cosineSimilarity([Number.MAX_VALUE, Number.MAX_VALUE], [Number.MIN_VALUE, 0]), Math.SQRT1_2);
    assertNear(cosineSimilarity([3e200, 4e200], [4e-200, 3e-200]), 0.96);
    assertNear(cosineSimilarity([1e200, 1e-200], [1e-200, 1e200]), 0);
    assertNear(cosineSimilarity([1e200, 1e-200], [-1e200, 1e-200]), -1);
});

test('subnormal component ratios retain a nontrivial angle', () => {
    const unit = Number.MIN_VALUE;
    assertNear(cosineSimilarity([unit, 2 * unit], [2 * unit, unit]), 0.8);
    assertNear(cosineSimilarity([unit, 2 * unit], [-2 * unit, -unit]), -0.8);
});

for (const [name, b, expected] of [
    ['leaves cosine unchanged', [-2, 1, 5], 0],
    ['preserves a nonzero cosine', [2, 1, 5], 12 / Math.sqrt(29 * 30)],
]) {
    test(`independent positive scaling ${name}`, () => {
        const a = [3, -4, 2];
        for (const scaleA of [1e-200, 1, 1e200]) {
            for (const scaleB of [1e-200, 1, 1e200]) {
                assertNear(cosineSimilarity(a.map(value => value * scaleA), b.map(value => value * scaleB)), expected);
            }
        }
    });
}

test('swapping vectors preserves ordinary and extreme scores', () => {
    const pairs = [
        [[1, 2, 3], [4, 5, 6]],
        [[3e200, -4e200], [4e-200, 3e-200]],
        [[Number.MIN_VALUE, 2 * Number.MIN_VALUE], [Number.MAX_VALUE, 0]],
    ];
    for (const [a, b] of pairs) {
        assertNear(cosineSimilarity(a, b), cosineSimilarity(b, a));
    }
});

test('ordinary values retain familiar cosine scores', () => {
    assertNear(cosineSimilarity([1, 2, 3], [4, 5, 6]), 32 / Math.sqrt(14 * 77));
    assertNear(cosineSimilarity([1, 0], [1, 1]), Math.SQRT1_2);
    assertNear(cosineSimilarity([1, 2, 3], [-1, -2, -3]), -1);
});

test('inputs can be frozen and remain unchanged', () => {
    const a = Object.freeze([3e200, 4e200]);
    const b = Object.freeze([4e-200, 3e-200]);
    assertNear(cosineSimilarity(a, b), 0.96);
    assert.deepEqual(a, [3e200, 4e200]);
    assert.deepEqual(b, [4e-200, 3e-200]);
});

test('long arrays do not depend on a variadic maximum', () => {
    const a = new Array(200_000).fill(Number.MAX_VALUE);
    const b = new Array(200_000).fill(Number.MIN_VALUE);
    assertNear(cosineSimilarity(a, b), 1);
});

test('dimension mismatch retains its error', () => {
    assert.throws(() => cosineSimilarity([1, 2], [1]), {
        name: 'Error',
        message: 'Vectors must be the same length',
    });
    assert.throws(() => cosineSimilarity([], [0]), /Vectors must be the same length/);
});

test('genuinely zero and empty vectors retain NaN behavior', () => {
    for (const [a, b] of [
        [[0, 0], [1, 2]],
        [[1, 2], [0, 0]],
        [[0, -0], [-0, 0]],
        [[], []],
    ]) {
        assert.ok(Number.isNaN(cosineSimilarity(a, b)));
    }
});

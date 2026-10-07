# cosine-similarity

A dependency-free JavaScript ES module for the cosine similarity of two vectors.
TypeScript declarations accept readonly arrays.

```js
import { cosineSimilarity } from 'cosine-similarity';

cosineSimilarity([1, 0], [1, 1]); // approximately 0.7071067811865475
cosineSimilarity([1e200], [1e200]); // 1
cosineSimilarity([1e-200], [-1e-200]); // -1
```

## Contract

`cosineSimilarity(a, b)` accepts equal-length arrays of finite numbers. For
nonzero vectors it returns their cosine, subject to floating-point rounding:
parallel vectors score approximately `1`, opposite vectors `-1`, and orthogonal
vectors `0`.

Each vector is divided by its own largest absolute component before accumulating
the dot product and squared norms. This prevents large magnitudes from
overflowing and tiny nonzero magnitudes, including subnormals, from being mistaken
for zero. Multiplying either vector by a positive factor preserves its cosine to
floating-point tolerance when the scaled values preserve the vector's direction.
Scaling that itself overflows or loses components to underflow cannot be undone.
Inputs are not modified, and large arrays do not require spreading into a
variadic function.

Existing edge behavior is unchanged:

- Different lengths throw `Error('Vectors must be the same length')`.
- If either vector consists entirely of zero components, the result is `NaN`.
  Two empty vectors also return `NaN`. Zero-vector policy is tracked separately
  in [issue #2](https://github.com/freshmozart1/cosine-similarity/issues/2).
- Validation of non-finite or non-number inputs is outside this contract.

## Development

From a repository checkout, run `npm test` with a Node.js version supporting the
built-in test runner. Tests use only Node's built-in modules; no dependencies or
provider calls are needed.
The package has no build, typecheck or lint script. JavaScript ships directly from
`index.js`, with its public declarations in `index.d.ts`.
The installed package includes runtime code, declarations, documentation and the
license; development tests stay in the repository.

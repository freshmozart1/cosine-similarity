# Changelog

## [1.0.2] - 2026-10-01

### Fixed

- Scale each vector by its maximum absolute component before calculating cosine
  similarity. Finite nonzero vectors with extreme or tiny magnitudes now return
  finite scores instead of overflow/underflow-driven `NaN` or incorrect values
  ([issue #4](https://github.com/freshmozart1/cosine-similarity/issues/4)).
- Preserve the existing dimension-mismatch error and `NaN` result for genuinely
  zero or empty vectors. Inputs remain unchanged.

### Validation

- Replace the placeholder test script with Node's dependency-free test runner.
- Cover large/tiny magnitudes, maximum finite values, subnormals, known angles,
  mixed magnitudes, positive scaling, symmetry, frozen inputs and long arrays.

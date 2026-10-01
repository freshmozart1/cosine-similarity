/**
 * Return the cosine of equal-length vectors containing finite numbers, with
 * independent scaling to handle extreme and tiny nonzero magnitudes.
 * Does not mutate inputs. Throws when lengths differ; returns NaN when either
 * vector is zero (including two empty vectors). Subject to floating-point rounding.
 */
export declare function cosineSimilarity(
  a: readonly number[],
  b: readonly number[],
): number;

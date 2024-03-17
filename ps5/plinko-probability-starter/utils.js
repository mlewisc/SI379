import { pow, combinations } from "mathjs";

/**
 * Returns the binomial probability of getting k successes in n trials with probability p
 * 
 * @param {number} n The number of trials
 * @param {number} k The number of successes
 * @param {number} p The probability of success
 * @returns The binomial probability of getting k successes in n trials with probability p
 * @see https://en.wikipedia.org/wiki/Binomial_distribution
 */

export function getBinomialProbability(n, k, p) {
    return combinations(n, k) * pow(p, k) * pow(1-p, n-k);
}

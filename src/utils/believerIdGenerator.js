/**
 * Generate a unique Believer ID
 * Format: [State first 2 letters][Country first 2 letters]LS[6-digit ascending number]
 * Example: PHNGLS260001, PHNGLS260002, PHNGLS260003
 *
 * @param {string} state - State or Territory name
 * @param {string} country - Country name
 * @param {number} sequenceNumber - The sequential number (defaults to current count + 1)
 * @returns {string} The generated believer ID
 */
export function generateBelieverID(state, country, sequenceNumber = 1) {
  if (!state || !country) {
    throw new Error("State and Country are required to generate Believer ID");
  }

  // Get first 2 letters of state
  const stateCode = state.substring(0, 2).toUpperCase();

  // Get first 2 letters of country
  const countryCode = country.substring(0, 2).toUpperCase();

  // Format the sequence number to 6 digits with leading zeros
  const paddedSequence = String(sequenceNumber).padStart(6, "0");

  // Combine: State + Country + LS + Sequence
  const believerID = `${stateCode}${countryCode}LS${paddedSequence}`;

  return believerID;
}

/**
 * Validate Believer ID format
 * @param {string} id - The believer ID to validate
 * @returns {boolean} True if valid format
 */
export function isValidBelieverID(id) {
  const pattern = /^[A-Z]{2}[A-Z]{2}LS\d{6}$/;
  return pattern.test(id);
}

/**
 * Extract information from Believer ID
 * @param {string} id - The believer ID
 * @returns {object} Object with state code, country code, and sequence number
 */
export function parseBelieverID(id) {
  if (!isValidBelieverID(id)) {
    throw new Error("Invalid Believer ID format");
  }

  return {
    stateCode: id.substring(0, 2),
    countryCode: id.substring(2, 4),
    sequence: parseInt(id.substring(6), 10),
  };
}

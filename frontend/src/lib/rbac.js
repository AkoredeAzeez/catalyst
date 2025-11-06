/**
 * Role based access helper
 * @param {string} role
 * @param {string[]} allowed
 * @returns {boolean}
 */
export const canAccess = (role, allowed) => allowed.includes(role);

export default canAccess;

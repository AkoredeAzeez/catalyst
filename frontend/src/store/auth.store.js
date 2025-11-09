/**
 * @typedef {'admin'|'manager'|'tenant'|'agent'|'investor'|'guest'} UserRole
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 *
 * @typedef {Object} AuthState
 * @property {string|undefined} token
 * @property {UserRole} role
 * @property {User|null|undefined} user
 * @property {(data: Partial<AuthState>|Object) => void} setAuth
 * @property {() => void} logout
 */

import { create } from 'zustand'

/**
 * Zustand store for authentication state.
 * @returns {import('zustand').UseBoundStore<AuthState>}
 */
export const useAuthStore = create((set) => ({
	token: undefined,
	role: 'investor',
	user: null,
	setAuth: (data) => set((s) => ({ ...s, ...data })),
	logout: () => set({ token: undefined, role: 'investor', user: null }),
}))
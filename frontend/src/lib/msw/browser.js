// Create and start the MSW worker at runtime in the browser.
// We dynamically import 'msw' to avoid server-side/build-time imports that
// cause Next.js (Turbopack) to attempt to statically analyze msw exports.
export async function startMsw() {
	if (typeof window === 'undefined') return;

		// dynamic import so this only runs in the browser
		const msw = await import('msw')

		// support different bundler/packaging shapes (some builds expose exports under default)
		const setupWorker = msw.setupWorker || msw.default?.setupWorker
		const rest = msw.rest || msw.default?.rest
		const ctx = msw.ctx || msw.default?.ctx

		if (!setupWorker || !rest || !ctx) {
			// If msw doesn't expose the expected helpers, abort gracefully
			// and log a helpful message to the console.
			// This avoids crashing the app during startup.
			console.warn('MSW runtime import did not expose setupWorker/rest/ctx. Skipping MSW startup.')
			return null
		}

		const handlers = [
			rest.get('/listings', (req, res, ctx_) => {
				return res(
					ctx_.json([
						{ id: '1', title: '2BR Smart Loft', location: 'Lekki', price: 3500000, beds: 2, baths: 2, coverUrl: '/cover1.jpg' },
						{ id: '2', title: 'Studio Downtown', location: 'Yaba', price: 1200000, beds: 1, baths: 1, coverUrl: '/cover2.jpg' },
					])
				)
			}),
			rest.post('/tickets', (req, res, ctx_) => res(ctx_.json({ ok: true }))),
		]

		const worker = setupWorker(...handlers)
		await worker.start()
		return worker
}

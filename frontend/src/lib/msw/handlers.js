// Simple MSW handlers (JS)
import { rest } from 'msw'

export const handlers = [
  rest.get('/listings', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: '2BR Smart Loft', location: 'Lekki', price: 3500000, beds: 2, baths: 2, coverUrl: '/cover1.jpg' },
        { id: '2', title: 'Studio Downtown', location: 'Yaba', price: 1200000, beds: 1, baths: 1, coverUrl: '/cover2.jpg' },
      ])
    )
  }),
  rest.post('/tickets', (req, res, ctx) => {
    return res(ctx.json({ ok: true }))
  }),
]

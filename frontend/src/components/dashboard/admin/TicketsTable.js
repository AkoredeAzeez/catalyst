'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MOCK = [
  { id: 'T-1023', unit: 'Lekki A-12', category: 'plumbing', priority: 'high', status: 'open', createdAt: '2025-10-13' },
  { id: 'T-1024', unit: 'Yaba C-02', category: 'internet', priority: 'medium', status: 'in_progress', createdAt: '2025-10-15' },
  { id: 'T-1025', unit: 'Lekki B-05', category: 'electrical', priority: 'high', status: 'open', createdAt: '2025-10-18' },
]

export default function TicketsTable() {
  const [rows, setRows] = useState([])
  useEffect(() => { setRows(MOCK) }, [])

  const Pill = ({ children }) => (<Badge variant="secondary" className="capitalize">{children}</Badge>)

  return (
    <Card>
      <CardHeader className="pb-2 text-sm text-muted-foreground">Recent Tickets</CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-4">Ticket</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Priority</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 pr-4 font-medium">{r.id}</td>
                <td className="py-2 pr-4">{r.unit}</td>
                <td className="py-2 pr-4 capitalize">{r.category}</td>
                <td className="py-2 pr-4"><Pill>{r.priority}</Pill></td>
                <td className="py-2 pr-4"><Pill>{r.status.replace('_', ' ')}</Pill></td>
                <td className="py-2 pr-4">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export function Card({ children, className = '' }) {
  // subtle border and soft shadow to mimic the design
  return <div className={`rounded-lg bg-white border border-neutral-100 shadow-sm ${className}`}>{children}</div>
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-3 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export default Card

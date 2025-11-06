export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-50 text-gray-800',
    green: 'bg-green-100 text-green-800',
  }
  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

export default Badge

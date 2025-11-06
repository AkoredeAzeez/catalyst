export function Button({ children, onClick, variant = 'default', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors'
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    icon: 'p-2',
  }
  const variants = {
    default: 'bg-foreground text-background hover:bg-foreground/90',
    ghost: 'bg-transparent hover:bg-neutral-100',
  }
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

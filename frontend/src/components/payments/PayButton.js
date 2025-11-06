'use client'
import { Button } from '@/components/ui/button'

export function PaystackButton({ amount, email, refId }) {
  const onClick = async () => {
    window.location.href = `/api/payments/paystack?amount=${amount}&email=${email}&ref=${refId}`
  }
  return <Button onClick={onClick}>Pay with Paystack</Button>
}

export function FlutterwaveButton({ amount, email, refId }) {
  const onClick = async () => {
    window.location.href = `/api/payments/flutterwave?amount=${amount}&email=${email}&ref=${refId}`
  }
  return <Button onClick={onClick}>Pay with Flutterwave</Button>
}

export function StripeButton({ amount, customerId }) {
  const onClick = async () => {
    window.location.href = `/api/payments/stripe?amount=${amount}&customerId=${customerId}`
  }
  return <Button onClick={onClick}>Pay with Stripe</Button>
}

export default PaystackButton

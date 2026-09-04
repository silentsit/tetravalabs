export function ShippingCharge({ amount }: { amount: number }) {
  if (amount <= 0) {
    return <span className="font-medium text-[#0D9488]">Free</span>
  }
  return <span className="tabular-nums">${amount.toFixed(2)}</span>
}

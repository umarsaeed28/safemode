/** Offerings for cart and checkout */
export const OFFERINGS = [
  { id: "audit", name: "Product & UX Audit", price: 0 },
  { id: "discovery", name: "Discovery Program", price: 25000 },
  { id: "sprint", name: "Add a Sprint", price: 6200 },
]

export function getOfferingByName(name) {
  return OFFERINGS.find((o) => o.name === name) || null
}

export function getOfferingById(id) {
  return OFFERINGS.find((o) => o.id === id) || null
}

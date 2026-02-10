/** Offerings for cart and checkout */
export const OFFERINGS = [
  { id: "discovery", name: "Decision Gate", price: 25000 },
  { id: "advisory", name: "Advisory", price: 1500 },
]

export function getOfferingByName(name) {
  return OFFERINGS.find((o) => o.name === name) || null
}

export function getOfferingById(id) {
  return OFFERINGS.find((o) => o.id === id) || null
}

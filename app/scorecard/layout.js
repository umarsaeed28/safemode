import Header from "../components/Header"

export const metadata = {
  title: "Discovery Scorecard",
  description: "How ready is your product to ship? Get a score and next step in under a minute.",
}

export default function ScorecardLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

import { Link } from "react-router-dom"

import Header from "../components/Header"

const HomePage = () => {

  return (
    <main>
      <Header />
      <section className="container | pt-20">
        <h1 className="text-xl">Welcome, visit <Link to="/dashboard" className="underline">Dashboard</Link></h1> 
      </section>
    </main>
  )
}

export default HomePage
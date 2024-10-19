
import { Link } from "react-router-dom"
import SignOut from "./SignOut"
import { useAppContext } from "../contexts/AppContext"

const Header = () => {

  const {isSignedIn} = useAppContext()

  return (
    <header className="flex justify-between py-6 | container">
      <Link to="/" className="text-xl text-red-500">Visualizer</Link>
      <div className="flex items-center gap-2">
        {!isSignedIn && <Link to="/sign-in" className="bg-sky-500 text-white py-1 px-4 rounded hover:bg-sky-600">Sign In</Link>}
        {isSignedIn && <SignOut />}
      </div>
    </header>
  )
}

export default Header
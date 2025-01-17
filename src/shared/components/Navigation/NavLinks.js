import React, {useContext} from 'react'
import './NavLinks.css'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../Context/auth-context'

const NavLinks = props => {
  const auth = useContext(AuthContext)

  return (
    <ul className="nav-links">
    <li>
        <NavLink to="/" >ALL USERS</NavLink>
    </li>
    {auth.isLoggedIn && (
    <li>
    <NavLink to={`/${auth.userId}/places`} >MY PLACES</NavLink>
    </li>
    )}
    {auth.isLoggedIn && (
    <li>
    <NavLink to="/places/new" >ADD PLACES</NavLink>
    </li>
    )}
    {!auth.isLoggedIn && (
    <li>
    <NavLink to="/auth" >LOGIN/SIGNUP</NavLink>
    </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout}>LOGOUT</button>
      </li>
    )}
</ul>
  )
}

export default NavLinks
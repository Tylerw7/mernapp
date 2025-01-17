import React, {useState, useCallback, useEffect} from 'react';
import {Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom'
import NewPlace from './places/pages/NewPlace';
import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/Context/auth-context';

let logoutTimer

const App = () => {

const [token, setToken] = useState(false)
const [tokenExpirationDate, setTokenExpirationDate] = useState(false)
const [userId, setUserId] = useState(false)




const login = useCallback((uid, token, expirationDate) => {
  setToken(token)
  setUserId(uid)
  const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
  setTokenExpirationDate(tokenExpirationDate)
  localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString()}))
}, [])

const logout = useCallback(() => {
  setToken(null)
  setTokenExpirationDate(null)
  setUserId(null)
  localStorage.removeItem('userData')
}, [])


useEffect(() => {
  if (token) {
    const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
    logoutTimer = setTimeout(logout, remainingTime)
  } else {
    clearTimeout(logoutTimer)
  }
}, [token, logout, tokenExpirationDate])



useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem('userData'))
  if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
    login(storedData.userId, storedData.token, new Date(storedData.expiration))
  }
  }, [login])



let routes

if (token) {
  routes = (
    <React.Fragment>
<Route path="/" element={<Users />} />
<Route path="/:userId/places" element={<UserPlaces />}  />
<Route path="/places/new" element={<NewPlace />} />
<Route path="/places/:placeId" element={<UpdatePlace />} />
<Route path="*" element={<Navigate to="/" />} />
</React.Fragment>
  )
} else {
  routes = (
    <React.Fragment>
<Route path="/" element={<Users />} />
<Route path="/:userId/places" element={<UserPlaces />}  />
<Route path='/auth' element={<Auth />} />
<Route path="*" element={<Navigate to="/auth" />} />
</React.Fragment>
  )
}


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
      <MainNavigation />
      <main>
      <Routes>
        {routes}
      </Routes>
      </main>
    </Router>
    </AuthContext.Provider>
  )
}

export default App;

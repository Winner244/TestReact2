import React from 'react'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { login, logout } from '../features/auth/authSlice'
import '../styles/header.less'

const Header: React.FC = () => {
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)
  const dispatch = useAppDispatch()

  return (
    <header className="app-header">
      <h1>Product Browser</h1>
      <div className="auth">
        {loggedIn ? (
          <>
            <span>Logged in</span>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <span>Guest</span>
            <button onClick={() => dispatch(login())}>Login</button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
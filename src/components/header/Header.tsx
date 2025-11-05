import React from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { login, logout } from '../../features/auth/authSlice'

import './header.less'

const Header: React.FC = () => {
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)
  const dispatch = useAppDispatch()

  return (
  <header className="header">
      <h1><Link className='text-decoration-none' to={`/`}>Product Browser</Link></h1>
      
      <div className="auth">
        {loggedIn ? (
          <>
            <span>Logged in</span>
            <button className='btn btn-danger' onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <span>Guest</span>
            <button className='btn btn-primary' onClick={() => dispatch(login())}>Login</button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
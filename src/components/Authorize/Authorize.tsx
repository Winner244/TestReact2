import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../utils/hooks'

type AuthorizeProps = {
  children: React.ReactNode
  redirectTo?: string
}

const Authorize: React.FC<AuthorizeProps> = ({ children, redirectTo = '/' }) => {
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)
  if (!loggedIn) return <Navigate to={redirectTo} replace />
  return <>{children}</>
}

export default Authorize

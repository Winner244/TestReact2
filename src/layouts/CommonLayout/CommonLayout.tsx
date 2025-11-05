import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../../components/header/Header'

import "./commonLayout.less"

const CommonLayout: React.FC = () => {
  return (
    <div className="common-layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default CommonLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboardd from '../pages/Dashboardd'



export default function Adminnav() {
  return (
    
      <div style={{ display: "flex" }}>
        <Dashboardd></Dashboardd>
    
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
    </div>
  )
}

    
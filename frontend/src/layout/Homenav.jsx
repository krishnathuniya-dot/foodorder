import React from 'react'

import { Outlet } from 'react-router-dom'

import Navbar from '../component/Navbar'
import Topnavbar from '../component/Topnavbar'
import Footer from '../component/Footer'


export default function Homenav() {
  return (
   
    
    <div>
         <Topnavbar></Topnavbar>
         <Navbar></Navbar>

        
        
      
        <div>
          <Outlet />
        </div>
       
    </div>
  )
}

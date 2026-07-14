import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Homenav from './layout/homenav'
import Topnavbar from './component/Topnavbar'
import Header from './component/Header'
import Account from './pages/Account'
import Nav from './layout/Nav'
import Profile from './pages/Profile'
import Changepassword from './pages/Changepassword'
import Adminnav from './layout/ADminnav'
import Admin from './pages/Admin'
import Dashboardd from './pages/Dashboardd'
import AddFood from './pages/Addfood'
import Regusers from './pages/Regusers'
import Category from './pages/Category'
import Managecategory from './pages/Managecategory'
import Managefood from './pages/Managefood'
import Footer from './component/Footer'
import Cart from './component/Cart'
import Edit from './pages/Edit'
import Menu from './component/Menu'
import Order from './pages/Order'
import Detail from './pages/Detail'
import View from './pages/View'
import Confirm from './pages/Confirm'
import Out from './pages/Out'
import New from './pages/New'
import Deliver from './pages/Deliver'
import Preparing from './pages/Preparing'
import AdminLogin from './pages/AdminLogin'


function App() {
 

  return (
   <div>
     <Routes>
      
        <Route path='/'element={<Homenav></Homenav>}> 
           <Route path='/'element={<Header></Header>}></Route>
             <Route path='/cart'element={<Cart></Cart>}></Route>
               <Route path='/menu/:category'element={<Menu></Menu>}></Route>
           
            
             <Route path='/' element={<Nav></Nav>}> 
           <Route path='/account'element={<Account></Account>}></Route>
             <Route path='/profile'element={<Profile></Profile>}></Route>
              <Route path='/changepassword'element={<Changepassword></Changepassword>}></Route>
                <Route path='/detail/:orderNumber'element={<Detail></Detail>}></Route>
             </Route>
    

          </Route>
            <Route path='/'element={<Adminnav></Adminnav>}>
                <Route path='dash'element={<Admin></Admin>}></Route> 
              <Route path='addfood'element={<AddFood></AddFood>}></Route>
              
                   <Route path='/users'element={<Regusers></Regusers>}></Route>
                    <Route path='/category'element={<Category></Category>}></Route>
                       <Route path='/managecategory'element={<Managecategory></Managecategory>}></Route>
                         <Route path='/managefood'element={<Managefood></Managefood>}></Route>
                            <Route path='/edit/:id'element={<Edit></Edit>}></Route>
                                <Route path='/orderdata'element={<Order></Order>}></Route>
                                  <Route path='/view/:orderNumber'element={<View></View>}></Route>
                                 <Route path='/confirm'element={<Confirm></Confirm>}></Route>
                                  <Route path='/out'element={<Out></Out>}></Route>
                                   <Route path='/new'element={<New></New>}></Route>
                                    <Route path='/deliver'element={<Deliver></Deliver>}></Route>
                                     <Route path='/prepare'element={<Preparing></Preparing>}></Route>
                                     
                 
                 
                 </Route>
                   <Route path='/admin'element={<AdminLogin></AdminLogin>}></Route>
                   

            
            
            
{/*             
            </Route> */}
            
           
           
     
    </Routes>
   </div>
  )
}

export default App

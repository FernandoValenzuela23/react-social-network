import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { LoginComponent } from '../components/user/LoginComponent';
import { RegisterComponent } from '../components/user/RegisterComponent';
import { FeedComponent } from '../components/publication/FeedComponent';
import { GuardedRoute } from './GuardedRoute';
import { AppContext } from '../context/AppContext';
import { PeopleComponent } from '../components/user/PeopleComponent';
import { ConfigComponent } from '../components/user/ConfigComponent';

export const AppRouter = () => {
  const {userCtx, setUserCtx, isAuthenticatedCtx, setIsAuthenticatedCtx, refreshDataCtx, setRefreshDataCtx } = useContext(AppContext);

  useEffect(() => {
    if(!isAuthenticatedCtx) {
      const userLogged = JSON.parse(localStorage.getItem('user'));
      if(userLogged) {
        setUserCtx(userLogged);
        setIsAuthenticatedCtx(true);
        setRefreshDataCtx(true);
      }
    }    
  }, [userCtx, isAuthenticatedCtx]);
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout/>}>
            <Route index element={<LoginComponent/>} />
            <Route path='login' element={<LoginComponent/>} />
            <Route path='register' element={<RegisterComponent/>} />
          </Route>

          {/* ESTO ES LO MISMO QUE LO QUE ESTA A CONTINUACION PERO SIN USAR GUARDS
          <Route path="/social" element={<PrivateLayout/>}>
            <Route index element={<FeedComponent/>} />
            <Route path='feed' element={<FeedComponent/>} />
          </Route>
          */}

          <Route  path="/social" 
                  element={<GuardedRoute isRouteAccessible={isAuthenticatedCtx} redirectRoute='/'/>}>
            <Route index element={<FeedComponent/>} />
            <Route path='feed' element={<FeedComponent/>} />
            <Route path='people' element={<PeopleComponent/>} />
            <Route path='config' element={<ConfigComponent/>} />
          </Route>
            
          <Route path='*' element={
              <div className='layout__content'>
                <h1 >404 Ruta No existente</h1><br/><hr/>
                <br/>
                <NavLink to="/" >Volver al Inicio</NavLink>
              </div>
            } 
          />
        </Routes>
    </BrowserRouter>
  )
}

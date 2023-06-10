import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HeaderComponent } from './HeaderComponent'
import { SidebarComponent } from './SidebarComponent'
import { AppContext } from '../../../context/AppContext'

export const PrivateLayout = () => {
  const { loading } = useContext(AppContext);

  return (
    <>
      <HeaderComponent />

      {
        (loading === true) ?
          <h1>Loading....</h1>
          :
          <section className="layout__content">
            <Outlet />
          </section>
      }


      <SidebarComponent />

    </>
  )

}

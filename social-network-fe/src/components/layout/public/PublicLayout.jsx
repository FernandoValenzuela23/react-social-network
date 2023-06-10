import React from 'react'
import { HeaderComponent } from './HeaderComponent'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <>
        <HeaderComponent />

        <section className="layout__content">
            <Outlet/>
        </section>

    </>
  )
}

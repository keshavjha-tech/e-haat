import React from 'react'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'

function Layout() {
    return (
        <>
            <Header />
            <main className='min-h-[100vh]'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout
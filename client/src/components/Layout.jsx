import React from 'react'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function Layout() {
    return (
        <>
            <Navbar />
            <main className='min-h-[100vh]'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout
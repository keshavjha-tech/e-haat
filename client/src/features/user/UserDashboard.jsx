
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserDashboardMenu from './components/UserDashboardMenu'
import useMobile from '@/hooks/useMobile'

const UserDashboard = () => {
  const [isMobile] = useMobile();
  // const user = useSelector((state) => state?.user)

  // console.log("user dashboard",user)
  // console.trace()
  return (

    <>
     { isMobile ? (
      <main>
        <Outlet />
      </main>
     ) : (
      // Desktop
      
    <div className="container mx-auto p-4 lg:grid lg:grid-cols-[250px_1fr] gap-8">

      {/* Left: Sidebar Menu */}
      <aside>
        <UserDashboardMenu />
      </aside>

      {/* className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r border-gray-200 bg-white z-10" */}

      {/* Right: Main Content */}
      <main className="bg-white p-6 rounded-lg shadow-sm">
        <Outlet />
      </main>
    </div>
     )}
    </>


  )
}

export default UserDashboard
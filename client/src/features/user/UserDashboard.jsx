
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserDashboardMenu from './components/UserDashboardMenu'

const UserDashboard = () => {
  const user = useSelector(state => state.user)

  console.log("user dashboard",user)
  // console.trace()
  return (
    <section>
   <div className="container mx-auto p-3 lg:grid lg:grid-cols-[250px_1fr] gap-4">
    {/* Left: Sidebar Menu */}
    <aside className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r border-gray-200 bg-white z-10">
      <UserDashboardMenu />
    </aside>

    {/* Right: Main Content */}
    <main className="bg-white min-h-[75vh] relative z-0">
      <Outlet />
    </main>
  </div>
</section>

  )
}

export default UserDashboard
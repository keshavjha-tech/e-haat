import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Home from '../pages/Home.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import Register from '../pages/Register.jsx'
import Login from '../pages/Login.jsx'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            { path : '', element : <Home />},
            { path : "search", element : <SearchPage /> },
            { path : "login", element : <Login /> },
            { path : "register", element : <Register /> },
        ]
    }
])

export default router
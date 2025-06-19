import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Home from '../pages/Home.jsx'
import SearchPage from '../pages/SearchPage.jsx'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            { path : '', element : <Home />},
            { path : "search", element : <SearchPage /> }
        ]
    }
])

export default router
import Layout from './components/Layout'
import toast, { Toaster } from 'react-hot-toast';
import fetchUserDeatil from './utils/fetchUserDetail';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch()

  const fetchUser = async()=>{
    const userData = await fetchUserDeatil()
    dispatch(setUser(userData));
    // console.log("userData",userData);   
  }

  useEffect(()=>{
    fetchUser()
  },[])


  return (
    <>
     <Layout />
     <Toaster />
    </>
  )
}

export default App
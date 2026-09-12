import toast from "react-hot-toast"

const AxiosToastError = (error)=>{
    toast.error(
        error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
    )
}

export default AxiosToastError
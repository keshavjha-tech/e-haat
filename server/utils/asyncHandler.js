const asyncHandler = (requestHandler) =>{
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

// const asyncHandler = (requestHandler)=>{
//     return(req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next))
//         .catch((err)=>next(err));
//     }
// }

export {asyncHandler};
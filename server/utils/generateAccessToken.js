import jwt from 'jsonwebtoken'

export const generateAccessToken = async(userId) => {
    const access_token =  jwt.sign(
        { id : userId}, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        {expiresIn : '1h'})

        return access_token;
}
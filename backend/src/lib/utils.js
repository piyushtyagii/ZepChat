import jwt from 'jsonwebtoken';
export const generateToken = (userID,res)=>{
    const token = jwt.sign({userID},process.env.JWT_SECRET, {expiresIn: '7d'});
    //this expiresIn will set the token to expire in 7 days means the user will have to login again after 7 days

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, lifetime of cookie..after 7 days the user have to login again
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie..makes the cookie inaccessibke in browser using document.cookie..only the server can send or recieve this cookie
        sameSite: 'strict', // helps prevent CSRF attacks..means the cookie can eb sent over same site only..not from other sites..maybe malicious sites
        secure:process.env.NODE_ENV !== "development" // ensures the cookie is sent over HTTPS in production
        //the above line will set secure to true in production and false in development
    })

    return token;
}

//max-age example..remember-me for 7days
// 7 days in milliseconds: 7 * 24 * 60 * 60 * 1000
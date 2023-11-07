const jwt = require('jsonwebtoken');
const JWT_SCERET = "santhu2002";

const fetchuser = (req,res,next)=>{
    // getting user details by decoding the auth-token using jwt and add id to req object
    const token =req.header("auth-token");
    if(!token){
        res.status(401).send({error:"please authenticate using valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SCERET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error:"please authenticate using valid token"});
    }


}


module.exports = fetchuser
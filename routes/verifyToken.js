const jwt = require('jsonwebtoken');

const verifyToken = (req, res,next)=> {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        

            jwt.verify(token, process.env.JWT_SEC, (err, user)=> {
                if(err)
                    res.sendStatus(403);

                req.user = user;
                next();    
            });
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {verifyToken};
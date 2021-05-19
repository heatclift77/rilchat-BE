const jwt = require('jsonwebtoken')
const tokenValidation = (req, res, next) => {
    const {token} = req.query;
    jwt.verify(token, process.env.PRIVATE_KEY, function(err, decode){
        if(err){
            res.status(400).json({message : "token Invalid"});
        }else{
            next();
        }
    });
}

module.exports = tokenValidation
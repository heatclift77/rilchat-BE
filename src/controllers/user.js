const { v4:uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")
const model = require("../models/user")
const jwt = require("jsonwebtoken");
exports.register = (req, res, next) => {
    const {username, email, password} = req.body
    if(username == undefined || email == undefined || password == undefined){
        res.status(400).json({message : "beberapa field tidak terbaca, proses tidak bisa dilanjutkan"})
    }else{
        const id_user = uuidv4()
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const img_profil_default = `${process.env.SERVER}/img/default.jpg`
        model.register(id_user, hash, email, username, img_profil_default)
        .then(response => {
            res.status(response.status).json({message : response.message})
            next()
        })
        .catch(err => {
            res.status(err.status).json({message : err.message})
        })
    }
}
exports.verifyAcount = (req, res) => {
    const { email } = req.params
    model.verifyAcount(email)
    .then(response=>{
        res.redirect(`${process.env.APP}/auth/login`)
    })
    .catch(err =>{
        res.status(err.status).json({message : err.message})
    })
}
exports.login = (req, res) => {
    const { email, pass } = req.body
    if(email == undefined || pass == undefined){
        res.status(400).json({message : "beberapa field tidak terbaca, proses tidak bisa dilanjutkan"})
    }else{
        model.login(email, pass)
        .then(response => {
            const payload = {email : response.data[0].email};
            jwt.sign(payload, process.env.PRIVATE_KEY, {expiresIn: "24h" }, function(err, token){
                res.status(response.status).json({
                    message : response.message,
                    token : token,
                    data : response.data[0]
                })
            });
        })
        .catch(err => {
            res.status(err.status).json({message:err.message})
        })
    }
}
exports.sendDataUser = (req, res) => {
    const {token} = req.query
    jwt.verify(token, process.env.PRIVATE_KEY, function(err, decode){
        if(!err){
            const email = decode.email
            model.sendDataUser(email)
            .then(response=>{
                res.status(response.status).json({data : response.data})
            })
            .catch(err=>{
                res.status(err.status).json({message : err.message})
            })
        }else{
            console.log(err);
        }
    });
}
exports.search = (req, res) => {
    const {key, id_user} = req.query
    model.searchFriends(key, id_user)
    .then(response => {
        res.status(response.status).json({data : response.data})
    })
    .catch(err => {
        res.status(err.status).json({message : err.message})
    })
}
exports.getFriends = (req, res) => {
    const {id_user} = req.query
    model.getFriends(id_user)
    .then(response => {
        res.status(response.status).json({data : response.data})
    })
    .catch(err => {
        res.status(err.status).json({message : err.message})
    })
}
exports.updateProfil = (req, res) => {
    const { column, value, id_user } = req.body
    model.updateProfil(column, value, id_user)
    .then(response => {
        res.status(response.status).json({data : response.data, message: response.message})
    })
    .catch(err => {
        res.status(err.status).json({message : err.message})
    })
}
exports.updateImgProfil = (req, res, next) => {
    const {id_user} = req.body
    const image = `${process.env.DIR_IMG}/${req.file.filename}`;
    if(image == undefined){
        res.status(400).json({message:"beberapa field tidak terbaca"})
    }else{
        model.setImgProfil(image, id_user)
        .then(response => {
            res.status(response.status).json({message:response.message, data:response.data})
        })
        .catch(err => {
            res.status(err.status).json({message:err.message})
        })
    }
}
exports.cekUsername = (req, res, next)=>{
    const {username} = req.body
    model.cekUsername(username)
    .then(()=>{
        next()
    })
    .catch(err=>{
        res.status(err.status).json({message: err.message})
    })
}
exports.cekEmail = (req, res, next)=>{
    const {email} = req.body
    model.cekEmail(email)
    .then(()=>{
        next()
    })
    .catch(err=>{
        res.status(err.status).json({message: err.message})
    })
}
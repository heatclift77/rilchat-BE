const connection = require("../config/db")
const bcrypt = require("bcryptjs")
const model = {
    register : (id_user, hash, email, username, img_profil_default) => {
        return new Promise((resolve, reject)=>{
            connection.query(`INSERT INTO user 
            (id_user, email, password, phoneNumber, img_profil, username, status, biodata) 
            VALUES 
            ('${id_user}','${email}', '${hash}', '-','${img_profil_default}', '${username}','0', '-')`, (err, results)=>{
                if(!err){
                    resolve({
                        message : "Register Berhasil",
                        status : 200
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    cekUsername: (username)=>{
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE username='${username}'`, (err, results)=>{
                if(!err){
                    if(results.length == 0){
                        resolve()
                    }else{
                        reject({
                            message : "username sudah digunakan",
                            status : 400
                        })
                    }
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    cekEmail : (email)=>{
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE email='${email}'`, (err, results)=>{
                if(!err){
                    if(results.length == 0){
                        resolve()
                    }else{
                        reject({
                            message : "email sudah digunakan",
                            status : 400
                        })
                    }
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    updateProfil : (column, value, id_user) => {
        return new Promise((resolve, reject)=>{
            connection.query(`UPDATE user SET ${column}='${value}' WHERE id_user='${id_user}'`, (err, results)=>{
                if(!err){
                    connection.query(`SELECT * FROM user WHERE id_user='${id_user}'`, (err, results)=>{
                        if(!err){
                            resolve({
                                data : results[0],
                                message : "update berhasil",
                                status : 200
                            })
                        }else{
                            reject({
                                message : err.message,
                                status : 500
                            })
                        }
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    verifyAcount : (email) => {
        return new Promise((resolve, reject)=>{
            connection.query(`UPDATE user SET status='1' WHERE email='${email}'`, (err, results)=>{
                if(!err){
                    resolve({
                        message : "acount verified",
                        status : 200
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    login : (email, pass) => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE email='${email}'`,(err, results)=>{
                if(!err){
                    if(results.length !== 0){
                        if(results[0].status == 1){
                            const passwordMatch = bcrypt.compareSync(pass, results[0].password);
                            if(passwordMatch){
                                if(results[0].online == 0){
                                    resolve({
                                        message : "login sukses",
                                        data : results,
                                        status : 200
                                    })
                                }else{
                                    reject({
                                        message : "Sesi sedang Berlangsung, Seseorang sedang login di tempat Lain",
                                        status : 400
                                    })
                                }
                            }else{
                                reject({
                                    message : "Password salah",
                                    status : 400
                                })
                            }
                        }else{
                            reject({
                                message : "email belum terverifikasi",
                                status : 400
                            })
                        }
                    }else{
                        reject({
                            message : "email belum terdaftar",
                            status : 400
                        })
                    }
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    sendDataUser : (email) => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE email='${email}'`, (err, results)=>{
                if(!err){
                    resolve({
                        status : 200,
                        data : results[0]
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    searchFriends : (key, id_user) => {
        if(key == undefined){
            return new Promise((resolve, reject)=>{
                connection.query(`SELECT * FROM user WHERE id_user !='${id_user}'`, (err, results)=>{
                    if(!err){
                        resolve({
                            data : results,
                            status : 200
                        })
                    }else{
                        reject({
                            message : err.message,
                            status : 500
                        })
                    }
                })
            })
        }else{
            return new Promise((resolve, reject)=>{
                connection.query(`SELECT * FROM user WHERE username LIKE '%${key}%' AND id_user !='${id_user}'`, (err, results)=>{
                    if(!err){
                        resolve({
                            data : results,
                            status : 200
                        })
                    }else{
                        reject({
                            message : err.message,
                            status : 500
                        })
                    }
                })
            })
        }
    },
    getFriends : (id_user) => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE id_user!='${id_user}'`,(err, results)=>{
                if(!err){
                    resolve({
                        data : results,
                        status : 200
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    getAllUser : () => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user`,(err, results)=>{
                if(!err){
                    resolve({
                        data : results,
                        status : 200
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    getChat : (id_user, id_reciever) => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE id_user='${id_user}'`,(err, friend)=>{
                if(!err){
                    connection.query(`SELECT * FROM chat WHERE id_user='${id_user}' AND id_reciever='${id_reciever}' OR id_user='${id_reciever}' AND id_reciever='${id_user}'`,(err, chats)=>{
                        if(!err){
                            resolve({
                                friend : friend[0], 
                                chats : chats,
                                status : 200
                            })
                        }else{
                            reject({
                                message : err.message,
                                status : 500
                            })
                        }
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    sendDataUser : (email) => {
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT * FROM user WHERE email='${email}'`, (err, results)=>{
                if(!err){
                    resolve({
                        status : 200,
                        data : results[0]
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    searchFriends : (key, id_user) => {
        if(key == undefined){
            return new Promise((resolve, reject)=>{
                connection.query(`SELECT * FROM user`, (err, results)=>{
                    if(!err){
                        resolve({
                            data : results,
                            status : 200
                        })
                    }else{
                        reject({
                            message : err.message,
                            status : 500
                        })
                    }
                })
            })
        }else{
            return new Promise((resolve, reject)=>{
                connection.query(`SELECT * FROM user WHERE username LIKE '%${key}%' AND id_user !='${id_user}'`, (err, results)=>{
                    if(!err){
                        resolve({
                            data : results,
                            status : 200
                        })
                    }else{
                        reject({
                            message : err.message,
                            status : 500
                        })
                    }
                })
            })
        }
    },
    addChat : (id_user, id_reciever, message) => {
        return new Promise((resolve, reject)=>{
            connection.query(`INSERT INTO chat (id_user, id_reciever, message) 
            VALUES 
            ('${id_user}','${id_reciever}','${message}')
            `,(err, results)=>{
                if(!err){
                    resolve({
                        data : results,
                        status : 200
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    },
    setImgProfil : (image, id_user) => {
        return new Promise((resolve, reject)=>{
            connection.query(`UPDATE user SET img_profil='${image}' WHERE id_user='${id_user}'`, (err, results)=>{
                if(!err){
                    connection.query(`SELECT * FROM user WHERE id_user='${id_user}'`, (err, results)=>{
                        if(!err){
                            resolve({
                                status : 200,
                                message : "Update Profil Berhasil",
                                data : results[0]
                            })
                        }else{
                            reject({
                                message : err.message,
                                status : 500
                            })
                        }
                    })
                }else{
                    reject({
                        message : err.message,
                        status : 500
                    })
                }
            })
        })
    }
}

module.exports = model
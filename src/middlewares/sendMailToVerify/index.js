const nodemailer = require("nodemailer");
const sendVerification = (req, res, next) => {
    const email = req.body.email;
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "adityapratamaputra74@gmail.com",
            pass: "eurekaseven",
        }
    });
    let mailOptions = {
        from: "RILCHAT",
        to: email,
        subject: "Verify Acount",
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <title>Email Verification</title>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="my-5">
                    <img src="../assets/Vector.svg" alt="" style="width: 120px;">
                </div>
                <h2>accunt Varification</h2>
                <p>Click Button Below to Verify</p>
                <a href="${process.env.SERVER}/v1/user/verifycation/${email}">verify</a>
            </div>
        </div>
    </div>
</body>
</html>
        `
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("user baru terdaftar, email terkirim");
        }
    });
};

module.exports = sendVerification;
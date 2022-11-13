const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { Kafka } = require('kafkajs')
const userModel = require("../model/user.js");

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092'],
  })

exports.getToken = (req, res) => {
    let token = jwt.sign({userName: 'farhan'}, 'shh')
    res.json({
        token
    })
}

exports.updateUserId = (req, res) => {
    const updateUser = {
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber,
    }
    userModel.updateOne({_id : req.params.userId}, {$set:updateUser})
        .then(result => {
            res.status(200).json({
                message_user: "Data Berhasil Diperbaharui",
                data: result
            })
        })
        .catch(err => {
            res.json({
                message_user: err.message,
                message_developer: err.message,
            })
        })

}

exports.createUser = (req, res) => {
    let{userName, emailAddress, identityNumber} = req.body;
    userName = userName.trim();
    emailAddress = emailAddress.trim();
    identityNumber = identityNumber.trim();

    if (userName == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Username Harus diisi",
        })
    }
    else if (emailAddress == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Email Harus diisi",
        })
    }
    else if (identityNumber == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Nomor Identitas Harus diisi",
        })
    }
    userModel.find({userName})
        .then((result) => {
            if (result.length) {
                res.statusCode = 400;
                res.json({
                    status_code: res.statusCode,
                    message_user: "Username Telah Terdaftar",
                })
            } else {
                const userData = new userModel ({
                    userName,
                    accountNumber: uuid.v4(),
                    emailAddress,
                    identityNumber,
                })
                userData.save()
                .then(result => {
                    res.statusCode = 200;
                    res.json({
                        status_code: res.statusCode,
                        message_user: "Berhasil ditambahkan",
                        data: user
                    })
                })
                .catch(error => {
                    res.statusCode = 400;
                    res.json({
                        status_code: res.statusCode,
                        message_user: "Terjadi kesalahan",
                        message_developer : error.message,
                    })
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.statusCode = 500;
            res.json({
                status_code: res.statusCode,
                message_user: err.message,
                message_developer: err.message,
            })
        })
}

exports.getUser = (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const query = req.query.q

    if (!query){
        userModel
            .find()
            .limit(limit)
        .then(result => {
            res.json({
                data: result,
            })
        })
        .catch(err => {
            res.json({
                message_user: err.message,
                message_developer: err.message,
            })
        })
    }
    else {
        userModel
            .find({accountNumber : query})
            .limit(limit)
        .then(result => {
            res.json({
                data: result,
            })
        })
        .catch(err => {
            res.json({
                message_user: err.message,
                message_developer: err.message,
            })
        })
    }
}

exports.getUserId = (req, res) => {
    const userId = req.params.userId;
    console.log(userId)
    userModel.find({_id : userId})
    .then(result => {
        res.json({
            data: result,
        })
    })
    .catch(err => {
        res.json({
            message_user: err.message,
            message_developer: err.message,
        })
    })
}

exports.deleteUserId = (req, res) => {
    userModel.deleteOne({_id : req.params.userId})
    .then(result => {
        res.status(200).json({
            message_user: "Berhasil menghapus data",
            data: result,
        })
    })
    .catch(err => {
        res.json({
            message_user: err.message,
            message_developer: err.message,
        })
    })
}


exports.postKafka = async (req, res) => {
    const producer = kafka.producer()
    let{userName, emailAddress, identityNumber} = req.body;
    userName = userName.trim();
    emailAddress = emailAddress.trim();
    identityNumber = identityNumber.trim();

    if (userName == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Username Harus diisi",
        })
    }
    else if (emailAddress == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Email Harus diisi",
        })
    }
    else if (identityNumber == "") {
        res.statusCode = 400;
        res.json({
            status_code: res.statusCode,
            message_user: "Nomor Identitas Harus diisi",
        })
    }
    userModel.find({userName})
        .then((result) => {
            if (result.length) {
                res.statusCode = 400;
                res.json({
                    status_code: res.statusCode,
                    message_user: "Username Telah Terdaftar",
                })
            } else {
                const userData = new userModel ({
                    userName,
                    accountNumber: uuid.v4(),
                    emailAddress,
                    identityNumber,
                })
                userData.save()
                
                .then(result => {
                    res.statusCode = 200;
                    producer.connect()
                    producer.send({
                        topic: 'kafka_farhan_betest',
                        messages: [
                        { value: user },
                        ],
                    })
                })
                .catch(error => {
                    res.statusCode = 400;
                    res.json({
                        status_code: res.statusCode,
                        message_user: "Terjadi kesalahan",
                        message_developer : error.message,
                    })
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.statusCode = 500;
            res.json({
                status_code: res.statusCode,
                message_user: err.message,
                message_developer: err.message,
            })
        })
}

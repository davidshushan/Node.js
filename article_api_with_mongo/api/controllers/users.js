const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // importent for token who used in requests to identify the sender in DB
const User = require('../models/user');


module.exports = {
    signup: (req, res) => {
        const { email, password } = req.body;

        User.find({ email }).then((users) => {
            if (users.length >= 1) {
                return res.status(409).json({ // 409 = some conflict was found
                    message: 'Email exists!'
                })
            }

            bcrypt.hash(password, 10, (error, hash) => {
                // hash represent the password, so we wont save the password directly in DB
                // but hash is not good enough on famos pass - like: '1234'
                // so we need to add 'solt' to the password (string - length - 10)
                if (error) {
                    return res.status(500).json({
                        error
                    })
                }
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email,
                    password: hash
                })

                user.save().then((result) => {

                    console.log(result);

                    res.status(200).json({
                        message: 'User Created!'
                    });
                }).catch(error => {
                    res.status(500).json({
                        error

                    })
                });
            })
        })

    },
    login: (req, res) => {
        const { email, password } = req.body;

        User.find({ email }).then((users) => {
            if (users.length === 0) {
                return res.status(401).json({ // return is importent to exit the function
                    message: 'Auth failed'
                })
            }

            const [user] = users; // email and password in our DB 
            //password is the password from client
            bcrypt.compare(password, user.password, (error, result) => { // result is boolean result of compare passwords
                if (error) {
                    return res.status(401).json({ // return is importent to exit the function
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({ // token for after user auth
                            id: user._id,
                            email: user.email,
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1H" // token valid time is for 1 hour, and aftr - need to re-login
                        })
                    return res.status(200).json({ // we need to return if true
                        message: 'Auth successfuly',
                        token
                    })
                }

                // if we arrived here thats mean that passwords are not matching
                res.status(401).json({
                    message: 'Auth failed'
                })
            })

        })
    }

}
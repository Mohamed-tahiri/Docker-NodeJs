const User = require("../models/user.model");

const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    const {username, password} = req.body
    
    try {
        const hashPassword = await bcrypt.hash(password, 12) 
        
        const newUser = await User.create({
            username,
            password: hashPassword
        })

        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            user: newUser
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
        })
    }
} 

const login = async (req, res) => {
    const {username, password} = req.body
    
    try {
        const user = await User.findOne({username}) 
        
        if(!user) {
            res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect){
            req.session.user = user
            res.status(200).json({
                status: 'success',
            })
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }

    } catch (error) {
        res.status(400).json({
            status: 'fail',
        })
    }
}

module.exports = {
    signUp,
    login
}

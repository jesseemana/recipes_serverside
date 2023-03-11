const User = require('../models/users')
const bcrypt = require('bcrypt');


const getUSers = async(req, res) => {
    const users = await User.find()

    if(!users?.length) return res.status(400).json({message: 'Users not found'})

    res.json(users)
};

const registerUSer = async(req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password) return res.status(400).json({message: 'Please fill out all fields'})

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const duplicate = await User.findOne({email})

    if(duplicate) return res.status(409).json({message: 'Account already exist'}).collation({locale: 'en', strength: 2}).lean().exec();


    const newUser = {
        username: username,
        email: email,
        password: hashedPassword
    }

    const user = await User.create(newUser)

    if(user) {
        return res.status(200).json({message: `New user ${username} has been created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'});
    }
};

const updateUser = async(req, res) => {
    res.json({message: 'User updated'});
};

const deleteUser = async(req, res) => {
    res.json({message: 'User deleted'});
};

module.exports = {
    getUSers,
    registerUSer,
    updateUser,
    deleteUser,
}

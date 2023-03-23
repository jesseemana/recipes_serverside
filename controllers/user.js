const User = require('../models/users')
const bcrypt = require('bcrypt')


const getUsers = async(req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message: 'No users found'})
    res.json(users)
}


async function getUser(req, res){ 
    const {id} = req.params
    if(!id) return res.status(400).json({message: 'Provide a user ID'})

    const user = await User.findById(id)
    if(!user) return res.status(400).json({message: 'User does not exist'})

    res.json(user)
}


const updateUser = async (req, res) => {
    const {id, username, password, role} = req.body

    if(!id || !username || !role) return res.status(400).json({message: 'All fields except password are required'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User Not Found'})

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength: 2}).lean().exec()
    if(duplicate) return res.status(409).json({message: 'User already exist'})

    user.username = username
    user.role = role

    const updatedUser = await user.save()

    // PASSWORD UPDATE FROM FRONTEND 
    if(password)
        user.password = await bcrypt.hash(password, 10)
    

    res.json({message: `${updatedUser.username} updated`})
}


const deleteUser = async(req, res) => {
    const {id} = req.body

    if(!id) return res.status(400).json({message: 'Please provide user id'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User Not Found'})

    await User.deleteOne(user)
    const message = `User ${user.username} with ID ${user._id} deleted`

    res.json(message)
}


module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
}
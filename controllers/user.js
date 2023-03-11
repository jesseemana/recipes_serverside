const User = require('../models/users')
const bcrypt = require('bcrypt');


const getUSers = async(req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message: 'Users not found'})

    res.json(users)
};



const createUSer = async(req, res) => {
    const {username, email, password} = req.body
    if(!username || !email || !password) return res.status(400).json({message: 'Please fill out all fields'})

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const duplicate = await User.findOne({email}).collation({locale: 'en', strength: 2}).lean().exec();
    if(duplicate) return res.status(409).json({message: 'Account already exist'})


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



const updateUser = async (req, res) => {
    const {id} = req.params
    const {username, password, role} = req.body

    if(!username || !role) return res.status(400).json({message: 'All fields except password are required'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User Not Found'})

    const duplicate = await User.findById({id}).collation({locale: 'en', strength: 2}).lean().exec();
    if(duplicate) return res.status(409).json({message: 'Account already exist'})

    user.username = username
    user.role = role

    const updatedUser = await user.save()


    // PASSWORD UPDATE FROM FRONTEND 
    if(password)
        user.password = await bcrypt.hash(password, 10)
    

    res.json({message: `${updatedUser.username} updated`});
};



const deleteUser = async(req, res) => {
    const {id} = req.params

    if(!id) return res.status(400).json({message: 'Please provide user id'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User Not Found'})

    await User.deleteOne(user)
    const message = `Username ${user.username} with ID ${user._id} deleted`

    res.json(message)
};



module.exports = {
    getUSers,
    createUSer,
    updateUser,
    deleteUser,
}

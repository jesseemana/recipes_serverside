const User = require('../models/users')
const Recipe = require('../models/recipe')
const bcrypt = require('bcrypt')


const getUsers = async(req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message: 'No users found'})
    res.status(200).json(users)
}


async function getUser(req, res){ 
    const {id} = req.params
    if(!id) return res.status(400).json({message: 'Provide a user ID'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User does not exist'})

    res.status(200).json(user)
}


const addRemoveBookamrk = async (req, res) => {
    const {id, recipeId} = req.params
    if(!id || !recipeId) return res.status(400).json({messae: 'id or recipeId is not provided'})

    const user = await User.findById(id).lean().exec()

    if(!user) return res.status(400).json({messae: 'User or recipe does not exist'})

    if(user.bookmarks.include(recipeId)) {
        user.bookmarks = user.bookmarks.filter((id) => id !== recipeId) // REMOVE RECIPE FROM BOOKMARKS
    } else {
        user.bookmarks.push(recipeId) // ADD(PUSH) RECIPE INTO BOOKAMRKS
    }

    await user.save()

    const userBookmarks = await Promise.all(
        user.bookmarks.map((id) => Recipe.findById(id))
    )

    const formattedBookamrks = userBookmarks.map(({_id, name, ingridients, procedure, category, picture, time}) => {
        return {_id, name, ingridients, procedure, category, picture, time}
    })

    res.status(200).json(formattedBookamrks)
}


const updateUser = async (req, res) => {
    const {id, username, password} = req.body

    if(!id || !username) return res.status(400).json({message: 'All fields except password are required'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message: 'User Not Found'})

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength: 2}).lean().exec()
    if(duplicate) return res.status(409).json({message: 'User already exist'})

    user.username = username

    const updatedUser = await user.save()

    // PASSWORD UPDATE FROM FRONTEND 
    if(password)
        user.password = await bcrypt.hash(password, 10)
    
    res.status(201).json(updatedUser)
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
    addRemoveBookamrk,
}
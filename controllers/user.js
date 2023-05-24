const User = require('../models/User');
const bcrypt = require('bcrypt');


const getUsers = async (req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length) return res.status(400).json({message: 'No users found'});
    res.status(200).json(users);
};


async function getUser(req, res) {
    const {id} = req.params;
    if(!id) return res.status(400).json({message: 'Provide a user ID'});

    const user = await User.findById(id).exec();
    if(!user) return res.status(400).json({message: 'User does not exist'});

    res.status(200).json(user);
}


const updateUser = async (req, res) => {
    const {id, firstName, lastName, password} = req.body;

    if(!id || !firstName || !lastName) return res.status(400).json({message: 'All fields except password are required'});

    const user = await User.findById(id).exec();
    if(!user) return res.status(400).json({message: 'User Not Found'});

    user.firstName = firstName;
    user.lastName = lastName;

    const updatedUser = await user.save();

    // PASSWORD UPDATE FROM FRONTEND 
    if(password)
        user.password = await bcrypt.hash(password, 10);

    res.status(201).json(updatedUser);
};


const deleteUser = async (req, res) => {
    const {id} = req.body;

    if(!id) return res.status(400).json({message: 'Please provide user id'});

    const user = await User.findById(id).exec();
    if(!user) return res.status(400).json({message: 'User Not Found'});

    await User.deleteOne(user);
    const message = `User ${user.firstName} ${user.lastName} with ID ${user._id} deleted`;

    res.json(message);
};


module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
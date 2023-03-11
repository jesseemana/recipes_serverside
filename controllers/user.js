const User = require('../models/users')


const getUSers = (req, res) => {
    res.json({message: 'User found'})
};

const registerUSer = (req, res) => {
    res.json({message: 'User created'});
};

const updateUser = (req, res) => {
    res.json({message: 'User updated'});
};

const deleteUser = (req, res) => {
    res.json({message: 'User deleted'});
};

module.exports = {
    getUSers,
    registerUSer,
    updateUser,
    deleteUser,
}

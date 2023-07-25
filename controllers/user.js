const User = require('../models/User');
const bcrypt = require('bcrypt');
// const getUsers = async (req, res) => {
//   const users = await User.find().select('-password').lean();
//   if (!users?.length) return res.status(400).json({ message: 'No users found' });
//   res.status(200).json(users);
// }
async function getUser(req, res) {
  const {id} = req.params;
  if (!id) return res.status(400).json({ message: 'Provide a user ID' });
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: 'User does not exist' });

  res.status(200).json(user);
}


const updateUser = async (req, res) => {
  const { id, first_name, last_name, password } = req.body;

  if (!id || !first_name || !last_name) 
    return res.status(400).json({ message: 'All fields except password are required' });

  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: 'User Not Found' });

  user.first_name = first_name;
  user.last_name = last_name;
  const updated_user = await user.save();
  // PASSWORD UPDATE FROM FRONTEND 
  if (password) { user.password = await bcrypt.hash(password, 10) };

  res.status(201).json(updated_user);
};


const deleteUser = async (req, res) => {
  const {id} = req.body;
  if (!id) return res.status(400).json({ message: 'Please provide user id' });
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: 'User Not Found' });
  
  await User.deleteOne(user);
  const message = `User ${user.first_name} ${user.last_name} with ID: ${user._id} deleted`;
  res.json(message);
};


module.exports = {
  // getUsers,
  getUser,
  updateUser,
  deleteUser,
};
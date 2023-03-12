const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const login = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password) return res.status(400).json({message: 'Provide email and password'})

    const user = await User.findOne({email}).exec()
    if(!user) return res.status(401).json({message: 'Unauthorized'})

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(401).json({message: `User password doesn't match`})


    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": user.username,
                "role": user.role
            }
        },
        process.env.ACCESS_TOKEN,
        {expiresIn: '15m'}
    )

    const refreshToken = jwt.sign(
        {"username": user.username},
        process.env.REFRESH_TOKEN,
        {expiresIn: '7d'}
    )

    res.cookie = ('jwt', refreshToken, {
        httpOnly: true, // -> store refresh token in memory, accessible only by web server
        secure: true, // -> https
        sameSite: 'None', // -> cross-site access
        maxAge: 7 * 24 * 60 * 60 * 1000 // -> cookie expiry set to 7 days(same as refresh token)
    })

    res.status(200).json(accessToken)
}


const refresh = async(req, res) => {}


const logout = async(req, res) => {}

module.exports = {
    login,
    refresh,
    logout
}

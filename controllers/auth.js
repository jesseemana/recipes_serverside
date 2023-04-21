const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const createUSer = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if(!firstName || !lastName || !email || !password) {
        return res.status(400).json({message: 'Please fill out all fields'})
    }

    const duplicate = await User.findOne({email}).collation({locale: 'en', strength: 2}).lean().exec(); // .collation()... fir checking case sensitivity
    if(duplicate) return res.status(409).json({message: 'email already in use'})

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
    })

    const user = await newUser.save()

    if(user) {
        return res.status(201).json({message: `New user ${firstName} ${lastName} has been created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        return res.status(400).json({message: 'Provide email and password'})
    }

    const user = await User.findOne({email}).exec()
    if(!user) return res.status(401).json({message: 'Unauthorized'})

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(400).json({message: `Entered wrong password`})

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": user.email,
                "role": user.role
            }
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '7d' }
    )

    const refreshToken = jwt.sign(
        { "email": user.email },
        process.env.REFRESH_TOKEN,
        { expiresIn: '14d' }
    )

    // STORING THE REFRESH TOKEN IN COOKIE(MEMORY) 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // -> store refresh token in memory, accessible only by web server
        secure: process.env.MODE = false, // -> https, set to true when not in dev mode
        sameSite: 'None', // -> cross-site access
        maxAge: 7 * 24 * 60 * 60 * 1000 // -> cookie expiry set to 7 days(same as refresh token)
    })

    res.status(200).json({user, ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken})
}


const refresh = async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async function(err, decoded) {
            if(err) return res.status(403).json({message: 'Forbidden'})

            const user = await User.findOne({email: decoded.email}).exec() // -> decoding the refresh token
            if(!user) return res.status(401).json({message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": user.email,
                        "role": user.role
                    }
                },
                process.env.ACCESS_TOKEN,
                {expiresIn: '7d'}
            );

            res.json(accessToken)
        }
    )
}


// CLEAR THE REFESHTOKEN FROM THE COOKIE
const logout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) // No content -> cookie don't exist we're good either way

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })

    res.json({message: 'Cookie cleared'})
}


module.exports = {
    createUSer,
    login,
    refresh,
    logout
}   
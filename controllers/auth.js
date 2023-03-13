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
                "email": user.email,
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

    // console.log(`ACCESS_TOKEN: ${accessToken}`)
    // console.log(`REFRESH_TOKEN: ${refreshToken}`)

    // STORING THE REFRESH TOKEN IN COOKIE(MEMORY) 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // -> store refresh token in memory, accessible only by web server
        secure: false, // -> https
        sameSite: 'None', // -> cross-site access
        maxAge: 7 * 24 * 60 * 60 * 1000 // -> cookie expiry set to 7 days(same as refresh token)
    })

    res.status(200).json({ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken})
}


const refresh = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'}) 

    // console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {
            if(err) return res.status(403).json({message: 'Forbiden'})

            const user = await User.findOne({email: decoded.email})
            if(!user) return res.status(401).json({message: 'Unauthorized'})


        }
    )
}


// CLEAR THE REFESHTOKEN FROM THE COOKIE
const logout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204); //No content -> cookie don't exist we're good either way
    
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: 'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
}

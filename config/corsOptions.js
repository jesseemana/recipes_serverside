const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:5173', // FOR REACT WHEN USING VITE, CHANGE IT TO WHATEVER PORT YOUR ON IN YOUR LOCALHOST
    'https://www.mydomainname.com'
]


const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};


module.exports = corsOptions;
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173', // YOUR FRONTEND PORT
  'https://www.mydomainname.com' // HOSTING DOMAIN NAME
]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
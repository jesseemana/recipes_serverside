const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000', // CREATE REACT APP / CREATE NEXT APP
  'http://localhost:5173', // VITE
  'https://gourmandshub.vercel.app' // HOSTING DOMAIN NAME
]

const corsOptions = {
  origin: (origin: 'StaticOrigin | CustomOrigin | undefined', callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};  

export default corsOptions  

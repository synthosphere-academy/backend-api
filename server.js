const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
 

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
 const courseRoute = require('./routes/courseroute');
 app.use('/api/v1',courseRoute);


const PORT = process.env.PORT ||3000;
connectDB().then(()=>{
    app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));
})

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT ||5000;
connectDB().then(()=>{
    app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));
})
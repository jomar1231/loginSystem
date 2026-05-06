const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const PORT = 4444;
require("dotenv").config();


app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));
app.use("/auth", authRoutes);
app.get('/product', (req, res) =>{
    res.status(404).json({message : " hello "});
});

app.use('/',(req,res)=>{
    res.status(404).json({message : " 404 not found"});
});

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
});
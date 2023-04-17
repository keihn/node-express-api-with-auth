const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const imageHandler = multer({ dest: process.env.STORAGE_LOCATION });
const fs = require('fs');

const mongoose = require('./config/database');
mongoose(dbURL);
const app = express();


//Middlewares 
app.use(cors({credentials: true, origin:'http://localhost:8000'}))
app.use(express.json());
app.use(cookieParser());

//Models
const Post = require('./models/Post')
const User = require('./models/User');
const { findSourceMap } = require('module');

//App parameters
const port = 8000;
const dbURL = process.env.DB_URL;
const salt = bcrypt.genSaltSync(10);
const tokenSecret = bcrypt.genSaltSync(10);



app.post('/register', async (req, res) => 
{
    const {username, password} = req.body;
    const usernameExists = User.findOne(username);
    if(usernameExists) res.status(406).json({success: false, message: "Username already in use"});

    try{
        const user = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt)
        });
        res.json(user);
    }catch(e){
        res.status(404).json(e);
    }
})

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    const userCollection = await User.findOne({username});
    const passMatches = bcrypt.compareSync(password, userCollection.password);

    (!passMatches) ? res.json({success: false, message: "Invalid credentials"}) :  jwt.sign({username, id: userCollection._id}, tokenSecret, {}, (error, token)=>{
        if (error) throw error
        res.cookie('token', token).json('ok')
    })
})

app.post('/post', imageHandler.single('thumbnail'), async (req, res) => {
    let {originalname, filename, path} = req.file;
    const fileParts = originalname.split('.');
    const fileExtension = fileParts[fileParts.length - 1]
    const newPath = `${path}.${fileExtension}`;
    fs.renameSync(path, newPath);
    const {title, body, excerpt} = req.body
    const postData = await Post.create({
        title, body, excerpt, thumbnail: newPath,
    });
    res.status(200).json(postData);
})

app.get('/profile/', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, tokenSecret, {}, (error, data) => {
        if(error) res.json({success: false, message: "Authenticated failed"})
        res.status(200).json(data)
    });
});

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
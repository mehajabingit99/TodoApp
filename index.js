const bodyParser = require('body-parser');
const express = require('express'); //import express
const mongoose = require('mongoose');//import mongoose
const dotenv = require('dotenv')//import dotenv
const cors = require('cors')
//dotenv configuration
dotenv.config();

const PORT = process.env.PORT || 3000;

const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

const app = express(); //server creates
app.use(allowCrossDomain)
app.options('*', cors())
app.use(bodyParser.json())// json parser middleware
app.use(bodyParser.urlencoded({extended: true}))

//mongodb connectivity
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('connected'))
        .catch(err => console.log("Error",err))

        //create a user on mongodb atlas 

//schema
const demoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    salary: {
        type: Number
    },
    email: {
        type: String,
        required: true
    }
})

const user = mongoose.model('mymodel', demoSchema, 'demodata')

//GET method
app.get('/',(req,res)=>{
    res.end("Welcome to home");
})

app.get('/about',(req,res)=>{
    res.end("This is about page");
})

// http://localhost:3000/name/aaryan
app.get('/name/:myname',(req,res)=>{
    res.end("Hi everyone" + " I am " + req.params.myname);
})

//POST method
app.post('/login',(req,res)=>{
    const body = req.body;
    const username = body.username;
    const pass = body.pass;

    if(username === "Raj" && pass === 123){
        res.status(200).send("Logged in successfully");
    }
    else{
        res.status(400).send("Invalid credentials");
    }
})

app.post('/create', async (req, res) => {
    const body = req.body;

    const name = body.name;
    const age = body.age;
    const salary = body.salary;
    const email = body.email;

    const insertedUser = await user.create({name: name, age: age, salary: salary, email: email})

    res.json({msg: "User inserted successfully", data: insertedUser})
})

app.get('/count', async (req, res) =>{
    res.json({count: await user.countDocuments()})
})

app.get('/id/:name', async (req, res) => {
    const name = req.params.name;

    const namedUser = await user.find({name: name})//.where('name').equals(name);

    res.json({msg: "success", data: namedUser})
})

//start server
app.listen(PORT, ()=>{
    console.log("Server started on port 5000");
})
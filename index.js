const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');



// middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;


app.get('/',(req,res)=>{
    res.send("this is a root route");
})


app.listen(port, ()=>{
    console.log(`port ${port} is listening`);
})
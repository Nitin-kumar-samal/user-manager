const express = require('express')
const mongoose = require('mongoose')
const app = express();
// middleware to use json body
app.use(express.json());
mongoose
   .connect(
      "mongodb+srv://nitinrcp_db_user:12345678@cluster11.srqrexw.mongodb.net/?appName=Cluster11",{
         family: 4
      }
   )
   .then(()=>console.log("MongoDB connection"))
   .catch((err=>console.log("MonogoDB connection error:",err)))


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// }) 

// app.get('/login', (req, res) => {
//   res.send('Please login first!')
// }) 

// app.get('/signup', (req, res) => {
//   res.send('Please signup first!')
// }) 

// app.get('/play', (req, res) => {
//   res.send('come and play!')
// }) 
// app.get('/cricket', (req, res) => {
//   res.send('Cricket is world wide game!')
// }) 
// app.get('/login/signup/play/cricket/virat', (req, res) => {
//   res.send('King Kohli!')
// }) 

// app.listen(6000, () => {
//   console.log(`Example app listening on port `)
// })
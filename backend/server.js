const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
connectDB()

const port = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.options('*', cors())

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });


app.use('/api/spaces', require('./routes/spaceRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started at port ${port}`))
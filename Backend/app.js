//this is the npm installed that will be setup when the server does

//express is used for getting data between backend and database
const express = require('express')
//mongoose is used for getting conection to the mongodb database and so we can use some software to check the database
const mongoose = require('mongoose')
//bodyparser lets us use the body function when we wanna get/call the body of something
const bodyParser = require('body-parser')
//cookieparser is used so we can parse data intro a json file
const cookieParser = require('cookie-parser')
//morgan is used for creating a "token" that we use for http request and respond
const morgan = require('morgan')
// express validator is used for validaing a input with a set of requirments 
const expressValidator = require('express-validator')
// cors (Cross-origin resource sharing) is used to display imagine on the web side for our productect
const cors = require('cors')

//this gets the configoration we set in the .env we use is for the port number and connection the database
require("dotenv").config()

//all the routes used for the places of functions
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const braintreeRoutes = require("./routes/braintree")
const orderRoutes = require("./routes/order")

//app
const app = express()

//Database this connectes the database and logs if it has conneceted 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => console.log("DB Connected"))

//middlewares are function used for access to request of object and response object
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//routes for the routes where the function for the api and in the routes it has the models also
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", braintreeRoutes)
app.use("/api", orderRoutes)

//this sets the port number from the .env
const port = process.env.PORT || 8000

//this just gives us a log over what port the server is running on
app.listen(port, () => {
    console.log(`The Node Server Is Running on ${port}`)
});

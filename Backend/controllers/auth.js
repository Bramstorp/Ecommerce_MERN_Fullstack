const User = require("../models/user") //here we import the model that is the user
const jwt = require("jsonwebtoken") //jwt is used to create web tokens that we used for authentication and authorization
const expressJwt = require("express-jwt") //this is used for given the user the specifit permissions on the website
const {errorHandler} = require("../helpers/error") //this is the error handler we use for given out error message

//we use this to signup user
exports.signup = (req, res) => {
    const user = new User(req.body)
    //this is used to when make a new user it will save in the json
    user.save((err, user) => {
        if (err) {
            //this is just a error message that will show
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        //if theres no error under signup it will then create the user in json format
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    //find the user based on email and password in the database
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        //if user is found make sure the email and password match
        //and this will create authenticate method from the user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        //this will generate a signed token with user id and secret when u signin
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        //persist the token as 't' in cookie with expiry date that and is used so the website can give u the permission neede based on the cookie u got singed also if the coockie is removed u will be signout
        res.cookie("t", token, { expire: new Date() + 9999 })
        //return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } })
    })
}

//this will just clear out the cookie and then that will autmatic remove the login permmisions 
exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};

//this is used for check if ur signin to access part of the website where u need to be signin and is based on isAuth
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

//this is used to check if ur authorised to access that part of the website and it mosly base it on your user id
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

//this check ur role if ur admin user based on ur role number 0 = user 1+ = admin
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};

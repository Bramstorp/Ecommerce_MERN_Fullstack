//this used for when a user signup it just have some requrements for how u will signup for safetey and the user to know how to do it the "right way"
exports.userSignupValidator = (req, res, next) => {
    req.check("name", "Name is required").notEmpty()
    req.check("email", "Email must be between 3 to 32 characters").matches(/.+\@.+\..+/).withMessage("Email must contain @").isLength({min: 4,max: 32})
    req.check("password", "Password is required").notEmpty()
    req.check("password").isLength({ min: 4 }).withMessage("Password must contain at least 4 characters").matches(/\d/).withMessage("Password must contain atleast one number")
    
    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }
    next()
}

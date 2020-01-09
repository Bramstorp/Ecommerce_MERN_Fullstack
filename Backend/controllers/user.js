const User = require("../models/user") //this just import the user model 
const { Order } = require("../models/order") //this is used to track the users order 
const { errorHandler } = require("../helpers/error") //this is just the error handler

//this is used to check the user by id if u need to seach for the user
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next()
    })
}

//this is the read user out from the json of user profiles, where u still cant see the content of the password cus of encryption
exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

//this is used to update the user were it will autmatic update the user id and it ill set it in the json and also it ill ecrypt the password if it updated also
exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        }
    )
}

//this will the order to the history (order history)
exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({ _id: item._id, name: item.name, description: item.description, category: item.category, quantity: item.count, transaction_id: req.body.order.transaction_id, amount: req.body.order.amount});
    })

    //it will also update the user when it will add the history to the user api
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true },
        (error) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                })
            }
            next()
        }
    )
}

//this is used to check the order history pased on user/user id and if no error it will add it to the order api
exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id }).populate("user", "_id name").sort("-created").exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(orders)
        })
}

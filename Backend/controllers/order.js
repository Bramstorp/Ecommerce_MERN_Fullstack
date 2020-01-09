const { Order, CartItem } = require("../models/order")
const { errorHandler } = require("../helpers/error")

//here we seach for a order by it id about everything in it 
exports.orderById = (req, res, next, id) => {
    Order.findById(id).populate("products.product", "name price").exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            req.order = order;
            next();
        })
}

//this will crete and order and it will also get what user that has order
exports.create = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json(data);
    })
}

//here we can see all of the order in the database 
exports.listOrders = (req, res) => {
    Order.find().populate("user", "_id name address").sort("-created").exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders)
        })
}

//we use this so the admin can set what status the order is at like if it shipped or cancled
exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues)
}

//here we can update the order when u update the status the id of the order will also update
exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        }
    )
}

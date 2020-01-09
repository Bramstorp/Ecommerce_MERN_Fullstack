const Category = require("../models/category") //this get the model from the category 
const { errorHandler } = require("../helpers/error") //this used for the general error message 

//this is used for seaching the category in the database 
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "the category does not exist"
            });
        }
        req.category = category
        next()
    })
}

//this is used to create the category and past as a json in the database
exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data })
    })
}

//herer we read the category from the database
exports.read = (req, res) => {
    return res.json(req.category)
};

//this is used to update the while category u can only update the name here  
exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

//this remove the while category from the database 
exports.remove = (req, res) => {
    const category = req.category
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Category deleted"
        })
    })
}

//list is used to show all the category in the database
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
}

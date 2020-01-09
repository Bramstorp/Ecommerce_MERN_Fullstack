"use strict"

//this for error message where the uniqueMessage its called
const uniqueMessage = error => {
    let output
    try {
        let fieldName = error.message.substring(error.message.lastIndexOf(".$") + 2,error.message.lastIndexOf("_1"));
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            " already exists"
    } catch (ex) {
        output = "Unique field already exists"
    }

    return output
}

//this is the gernalal error message where it will take the name of the error and display it as a message
exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error)
                break
            default:
                message = "Something went wrong"
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message
}


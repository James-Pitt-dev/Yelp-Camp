class ExpressError extends Error {
    //Attr

    //Constr
    constructor(message, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }

    //Methods
}

module.exports = ExpressError;
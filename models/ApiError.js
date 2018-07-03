class ApiError {
    constructor(message, code){
        this.message = message
        this.code = code
        this.datetime = Date()
    }

    getMessage() {
        return this.message
    }

    getCode() {
        return this.code
    }

    getDatetime() {
        return this.datetime
    }

}
module.exports=ApiError
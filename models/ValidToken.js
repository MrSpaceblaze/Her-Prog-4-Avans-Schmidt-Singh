class ValidToken {
    constructor(token, email){
        this.token = token
        this.email = email
    }

    getToken() {
        return this.token
    }

    getEmail() {
        return this.email
    }
}
module.exports=ValidToken
class UserRegisterJSON {
    constructor(firstname, lastname, email, password) {
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
    }

    getFirstname() {
        return this.firstname
    }

    getLastname() {
        return this.lastname
    }
    
    getEmail() {
        return this.email
    }

    getPassword() {
        return this.password
    }
}
module.exports=UserRegisterJSON
class DelerResponse {
    constructor(voornaam, achternaam, email) {
        this.voornaam = voornaam
        this.achternaam = achternaam
        this.email = email
    }

    getVoornaam() {
        return this.voornaam
    }

    getAchternaam() {
        return this.achternaam
    }
    
    getEmail() {
        return this.email
    }
}
module.exports=UserLoginJSON
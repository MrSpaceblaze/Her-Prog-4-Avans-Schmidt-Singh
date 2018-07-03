class CategorieResponse {
    constructor(ID, naam, beschrijving, beheerder, email) {
        this.ID = ID
        this.naam = naam
        this.beschrijving = beschrijving
        this.beheerder = beheerder
        this.email = email
    }

    getID() {
        return this.ID
    }

    getNaam() {
        return this.naam
    }

    getBeschrijving() {
        return this.beschrijving
    }

    getBeheerder() {
        return this.beheerder
    }
    
    getEmail() {
        return this.email
    }
}
module.exports=CategorieResponse
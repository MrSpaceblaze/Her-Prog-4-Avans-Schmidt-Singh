class Categorie {
    constructor(naam, beschrijving){
        this.naam = naam
        this.beschrijving = beschrijving
    }

    getNaam() {
        return this.naam
    }

    getBeschrijving() {
        return this.beschrijving
    }
}
module.exports=Categorie
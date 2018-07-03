class Ding {
    constructor(naam, beschrijving, merk, soort, bouwjaar) {
        this.naam = naam
        this.beschrijving = beschrijving
        this.merk = merk
        this.soort = soort
        this.bouwjaar = bouwjaar
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

    getMerk() {
        return this.merk
    }
    
    getSoort() {
        return this.soort
    }

    getBouwjaar() {
        return this.bouwjaar
    }
}
module.exports=Ding
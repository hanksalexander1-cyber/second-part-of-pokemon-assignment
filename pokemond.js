export class Pokemon {
    static totalCreated = 0
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.image = data.sprites.front_default
        this.types = data.types.map(type => type.type.name)

        this.maxHealth = data.stats.find(stat => stat.stat.name === "hp").base_stat
        this._health = this.maxHealth

        this.attackPower = data.stats.find(stat => stat.stat.name === "attack").base_stat
        this.defense = data.stats.find(stat => stat.stat.name === "defense").base_stat

        Pokemon.totalCreated++
    }
    get health() {
        return this._health
    }
    set health(value) {
        if (value < 0) {
            this._health = 0
        } else if (value > this.maxHealth) {
            this._health = this.maxHealth
        } else {
            this._health = value
        }
    }
    get healthPercent() {
        return (this.health / this.maxHealth) * 100
    }
    get isFainted() {
        return this.health === 0
    }
    takeDamage(amount) {
        if (amount < 0) return
        this.health = this.health - amount
    }
    heal(amount) {
        if (amount < 0) return
        this.health = this.health + amount
    }
    resetHealth() {
        this.health = this.maxHealth
    }
    static getTotalCreated() {
        return Pokemon.totalCreated
    }
}

export async function getPokemon(i) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    if (!response.ok) throw new Error("Pokemon not found")
    const data = await response.json()
    return new Pokemon(data)
}

export async function loadPokemon(startId = 1, endId = 12) {
    let pokemonList = []
    for (let i = startId; i <= endId; i++) {
        let pokemon = await getPokemon(i)
        pokemonList.push(pokemon)
    }
    return pokemonList
}
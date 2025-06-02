
<template>
  <div class="app">
    <h1>Pokémon Kasa Açma</h1>

    <div class="case-buttons">
      <button @click="caseType = 'random'">🎲 Random Case</button>
      <button @click="caseType = 'legendary'">🔥 Legendary Case</button>
      <button @click="caseType = 'mythical'">🌟 Mystical Case</button>
    </div>

    <div v-if="caseType && !isSpinning">
      <button @click="openCase">Kasa Aç</button>
    </div>

    <div v-if="caseType" class="slider-container">
      <div class="pointer"></div>
      <div class="slider" :style="{ transform: `translateX(${position}px)` }">
        <div
          class="pokemon"
          v-for="(poke, index) in pokemons"
          :key="index"
          :class="poke.rarity"
        >
          <img :src="poke.image" :alt="poke.name" />
        </div>
      </div>
    </div>

    <div v-if="selectedPokemon" class="result">
      <h2>Kazanan: {{ selectedPokemon.name.toUpperCase() }}</h2>
      <img :src="selectedPokemon.image" :alt="selectedPokemon.name" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pokemons = ref([])
const selectedPokemon = ref(null)
const isSpinning = ref(false)
const position = ref(0)
const caseType = ref('') // boş başlar (seçim yapılmadı)

let animationFrameId = null

const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1

const getPokemonRarity = async (id) => {
  try {
    const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    const { is_legendary, is_mythical, evolution_chain } = species.data

    if (is_legendary) return 'legendary'
    if (is_mythical) return 'mythical'

    const evoChain = await axios.get(evolution_chain.url)
    const chain = evoChain.data.chain

    const isFinalEvolution = (pokemonName, chainNode) => {
      if (chainNode.evolves_to.length === 0) return chainNode.species.name === pokemonName
      return chainNode.evolves_to.some(evo => isFinalEvolution(pokemonName, evo))
    }

    const isFinal = isFinalEvolution(species.data.name, chain)
    return isFinal ? 'final' : ''
  } catch {
    return ''
  }
}

const animateSlider = (onComplete, offsetToCenter) => {
  const totalDuration = 11000 // 11 saniye
  const startTime = performance.now()

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  const step = (timestamp) => {
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / totalDuration, 1)

    position.value = - (offsetToCenter * easeOutCubic(progress))

    if (progress >= 1) {
      cancelAnimationFrame(animationFrameId)
      onComplete()
    } else {
      animationFrameId = requestAnimationFrame(step)
    }
  }

  animationFrameId = requestAnimationFrame(step)
}

const openCase = async () => {
  // Başta loading kutuları göster
  pokemons.value = Array.from({ length: 50 }, () => ({
    name: 'Loading...',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
    rarity: ''
  }))

  isSpinning.value = true;
  selectedPokemon.value = null;
  position.value = 0;

  const filtered = []
  const maxAttempts = 1000
  const batchSize = 50 // her seferde 50 Pokémon isteği at
  let attempts = 0

  while (filtered.length < 30 && attempts < maxAttempts) {
    const ids = Array.from({ length: batchSize }, getRandomPokemonId)
    const promises = ids.map(async (id) => {
      try {
        const [res, rarity] = await Promise.all([
          axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
          getPokemonRarity(id)
        ])
        const matchesCase =
          caseType.value === 'random' ||
          (caseType.value === 'legendary' && rarity === 'legendary') ||
          (caseType.value === 'mythical' && rarity === 'mythical')

        if (matchesCase && res.data.sprites.front_default) {
          return {
            id: res.data.id,
            name: res.data.name,
            image: res.data.sprites.front_default,
            rarity
          }
        }
      } catch {
        return null
      }
    })

    const results = await Promise.all(promises)
    filtered.push(...results.filter(Boolean))
    attempts += batchSize
  }

  if (filtered.length === 0) {
    alert(`Seçilen "${caseType.value}" kasası için uygun Pokémon bulunamadı.`)
    isSpinning.value = false
    return
  }

  // 30 Pokémon ile slider listesi oluştur
  const finalList = filtered.slice(0, 30)
  const repeated = []
  for (let i = 0; i < 5; i++) {
    repeated.push(...finalList.map(p => ({ ...p })))
  }

  pokemons.value = repeated

  const totalWidth = pokemons.value.length * 100
  const maxOffset = totalWidth - 400
  const randomOffset = Math.floor(Math.random() * maxOffset)
  const offsetToCenter = randomOffset

  animateSlider(() => {
    setTimeout(() => {
      const centerX = 200
      const indexAtCenter = Math.floor((offsetToCenter + centerX) / 100)
      selectedPokemon.value = pokemons.value[indexAtCenter]
      isSpinning.value = false
    }, 1000)
  }, offsetToCenter)
}


</script>

<style>
.app {
  text-align: center;
  margin-top: 30px;
}
button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

.case-buttons {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  gap: 15px;
}
.case-buttons button {
  padding: 10px 14px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #333;
  color: white;
  transition: 0.3s;
}
.case-buttons button:hover {
  background-color: #555;
}

.slider-container {
  position: relative;
  width: 400px;
  height: 120px;
  overflow: hidden;
  margin: 40px auto;
  border: 4px solid #444;
  border-radius: 12px;
  background-color: #111;
}

.pointer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 200px;
  width: 4px;
  background-color: white;
  z-index: 10;
}

.slider {
  display: flex;
  align-items: center;
  transition: transform 0.05s linear;
}

.pokemon {
  width: 100px;
  height: 100px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}
.pokemon img {
  width: 80px;
}

.legendary {
  background-color: #b30000;
}
.mythical {
  background-color: #ffd700;
}
.final {
  background-color: #0066ff;
}

.result {
  margin-top: 30px;
}
</style>

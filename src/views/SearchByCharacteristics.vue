<template>
  <div class="speechSearchView">
    <div id="nav">
      <router-link to="/"><font-awesome-icon icon="times" /></router-link>
    </div>
    <CharacteristicSearch/>
    <Footer/>
  </div>
</template>

<script>
import CharacteristicSearch from '@/components/CharacteristicSearch.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'SearchByCharacteristics',
  components: {
    CharacteristicSearch,
    Footer
  }
}
</script>

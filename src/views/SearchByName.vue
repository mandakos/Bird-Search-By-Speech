<template>
  <div class="speechSearchView">
    <div id="nav">
      <router-link to="/"><font-awesome-icon icon="times" /></router-link>
    </div>
    <SpeciesSearch/>
    <Footer/>
  </div>
</template>

<script>
import SpeciesSearch from '@/components/SpeciesSearch.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'SearchByName',
  components: {
    SpeciesSearch,
    Footer
  }
}
</script>

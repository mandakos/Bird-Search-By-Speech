<template>
  <div class="speechSearchView">
    <div id="nav">
      <router-link to="/lintuhaku"><font-awesome-icon icon="times" class="close-icon" /></router-link>
    </div>
    <SpeechSearch/>
    <Footer/>
  </div>
</template>

<script>
import SpeechSearch from '@/components/SpeechSearch.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Search',
  components: {
    SpeechSearch,
    Footer
  }
}
</script>

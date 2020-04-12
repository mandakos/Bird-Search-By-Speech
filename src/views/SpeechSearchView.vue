<template>
  <div class="speechSearchView">
    <div id="nav">
      <router-link to="/"><font-awesome-icon icon="times" /></router-link>
    </div>
    <SpeechSearch/>
  </div>
</template>

<script>
// @ is an alias to /src
import SpeechSearch from '@/components/SpeechSearch.vue'

export default {
  name: 'SpeechSearchView',
  components: {
    SpeechSearch
  }
}
</script>

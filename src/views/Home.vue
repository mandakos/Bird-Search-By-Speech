<template>
  <div class="home">
    <SpeechSearch/>
  </div>
</template>

<script>
// @ is an alias to /src
import SpeechSearch from '@/components/SpeechSearch.vue'

export default {
  name: 'Home',
  components: {
    SpeechSearch
  }
}
</script>

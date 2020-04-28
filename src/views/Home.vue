<template>
  <div class="home-wrapper">
    <div class="home">
      <h1>Lintuhaku puheen tunnistuksella</h1>
      <p class="ingress">Helppo lintuhaku, ilman kirjoittamista</p>
      <p>
        Hae lintulajeja nopeasti puheella. Muista antaa selaimelle lupa nauhoittaa ääntä.
      </p>
      <router-link to="/lintuhaku-nimella" class="home-button btn">Etsi lintua nimellä</router-link>
      <router-link to="/lintuhaku-tuntomerkeilla" class="home-button btn">Etsi lintua tuntomerkeillä</router-link>
    </div>
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Footer
  }
}
</script>
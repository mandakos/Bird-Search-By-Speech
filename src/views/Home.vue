<template>
  <div class="home-wrapper">
    <div class="home">
      <h1>
        Lintuhaku puheen tunnistuksella
      </h1>
      <p class="ingress">Helppo lintuhaku, ilman kirjoittamista</p>
      <router-link to="/lintuhaku/puhu" class="speech-home-button btn">ALOITA LINTUHAKU</router-link>
      <p>
        Hae lintulajeja joko nimellä tai tuntomerkeillä (beta-ominaisuus).
      </p>
      <p>
        <b>VINKKI!</b> Jos haluat kuunnella linnun kuvauksen, sano myös "kuuntele". Esimerkiksi
        "kuuntele varpunen".
      </p>
      <p>
        <b>Huom</b> Puheentunnistusominaisuus toimii toistaiseksi vain
        Chrome-selaimella.
      </p>
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
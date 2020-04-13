<template>
  <div class="home-wrapper">
    <div class="home">
      <h1>Lintuhaku puheen tunnistuksella</h1>
      <p class="ingress">Helppo lintuhaku, ilman kirjoittamista</p>
      <p>
        Hae lintulajeja nopeasti puheella. Valitse haluatko etsiä lajia nimen vai tuntomerkkien perusteella. Muista antaa selaimelle lupa nauhoittaa ääntä (puhetta ei tallenneta, sitä käytetään vain sanojen tunnistamiseen)!
      </p>
      <router-link to="/lintuhaku" class="home-button btn">Etsi lintua nimellä</router-link>
    </div>
    <div class="home-license-description">
      <p>
        Tämän sivuston lintujen nimet, lajitekstit ja kuvat
        on haettu Suomen Lintuatlaksen avoimen datan lähteistä.
        <a target="_blank" href="http://atlas3.lintuatlas.fi/taustaa/kaytto">Lue täältä lisää Lintuatlaksen käyttöoikeuksista.</a>
      </p>
    </div>
  </div>
</template>

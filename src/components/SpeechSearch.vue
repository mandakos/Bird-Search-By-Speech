<template>
  <div class="birdSearchMain">
    <h1>Lintulajin tunnistus puheesta</h1>
    <p>Paina nappia, ja sano ilmestyvä lintulaji.</p>

    <button v-on:click="startRecognition">Aloita</button>
    <button v-on:click="cancelRecognition" ref="stop" style="display: none;">Peruuta</button>

    <div>
        <p class="phrase" ref="phrase">Lintulaji...</p>
        <p class="result" ref="result">Oikein vai väärin?</p>
        <p class="output" ref="output"></p>
    </div>
  </div>
</template>

<script>
import BirdNameRecognizer from '@/js/speech.js'
import birdNames from '@/json/birdNames.json';
import birdSpeciesInfo from '@/json/birdSpeciesInfo.json';

export default {
  name: 'Hello',
  data: function() {
    return {
        phrase: '',
        result: '',
        output: '',
        stopBtn: '',
        jsonBirdNames: {},
        jsonLength: '',
        recognizer: null
    };
  },
  methods: {
    startRecognition: function (event) {
      var clickedElement = event.target;
      var newPhrase = this.newPhrase();
      this.recognizer = new BirdNameRecognizer(clickedElement, newPhrase, this.phrase, this.result, this.output, this.stopBtn);
      this.recognizer.startRecognizing();
    },
    cancelRecognition: function () {
      this.recognizer.stopRecognizing();
    },
    countJsonLength: function () {
      var count = Object.keys(birdNames).length;
      this.jsonLength = count;
    },
    randomItem: function () {
      var number = Math.floor(Math.random() * this.jsonLength);
      return number;
    },
    newPhrase: function() {
      var randomArr = this.jsonBirdNames[this.randomItem()];
      var newPhrase = randomArr[1].speciesFI;
      return newPhrase;
    },
    jsonToArray: function(json) {
      var arr = [];
      for(var i in json)
          arr.push([i,json[i]]);
      return arr;
    }
  },
  mounted () {
    this.phrase = this.$refs.phrase;
    this.result = this.$refs.result;
    this.output = this.$refs.output;
    this.stopBtn = this.$refs.stop;
    this.countJsonLength();
  },
  created () {
    this.jsonBirdNames = this.jsonToArray(birdNames);
  },
}
</script>

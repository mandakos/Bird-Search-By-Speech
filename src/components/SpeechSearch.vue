<template>
  <div class="birdSearchMain">
    <h1>Lintulajin tunnistus puheesta</h1>
    <p>Paina nappia, ja sano ilmestyvä lintulaji.</p>

    <button v-on:click="recognize">Aloita</button>

    <div>
        <p class="phrase" ref="phrase">Lintulaji...</p>
        <p class="result" ref="result">Oikein vai väärin?</p>
        <p class="output" ref="output"></p>
    </div>
  </div>
</template>

<script>
import speechRecognition from '@/speech.js'
import birdNames from '@/birdNames.json';

export default {
  name: 'Hello',
  data: function() {
    return {
        phrase: '',
        result: '',
        output: '',
        jsonBirdNames: {},
        jsonLength: ''
    };
  },
  methods: {
    recognize: function (event) {
      var clickedElement = event.target;
      var newPhrase = this.newPhrase();
      speechRecognition(clickedElement, newPhrase, this.phrase, this.result, this.output);
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
    this.countJsonLength();
  },
  created () {
    this.jsonBirdNames = this.jsonToArray(birdNames);
  },
}
</script>

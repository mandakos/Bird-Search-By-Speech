<template>
  <div class="birdSearchMain">
    <h1>Lintulajin tunnistus puheesta</h1>

    <button v-on:click="startRecognition" v-bind:disabled="startDisable">Aloita</button>
    <button v-on:click="cancelRecognition" ref="stop" style="display: none;">Peruuta</button>

    <div>
        <p class="speechResult" ref="output"></p>
        <p class="birdDescription" ref="description"></p>
        <p class="birdDescriptionAuthor" ref="author"></p>
    </div>
  </div>
</template>

<script>
import BirdNameRecognizer from '@/js/speech.js'
import birdNames from '@/json/birdNames.json';
import birdSpeciesInfo from '@/json/birdSpeciesInfo.json';

export default {
  name: 'BirdSearchBySpeech',
  data: function() {
    return {
        output: '',
        stopBtn: '',
        description: '',
        author: '',
        speechInput: '',
        startDisable: true,
        jsonBirdNamesSCIandFI: [],
        jsonBirdNamesFI: [],
        jsonBirdInfo: [],
        recognizer: null,
        speechResult: ''
    };
  },
  methods: {
    startRecognition: function (event) {
      var clickedElement = event.target;
      this.recognizer = new BirdNameRecognizer(clickedElement, this.output, this.stopBtn, this.description, 
                                              this.jsonBirdNamesFI, this.jsonBirdNamesSCIandFI,
                                              this.jsonBirdInfo, this.author);
      this.recognizer.startRecognizing();
    },
    cancelRecognition: function () {
      this.recognizer.stopRecognizing();
    },
    countJsonLength: function (json) {
      var count = Object.keys(json).length;
      return count;
    },
    /*randomItem: function () {
      var number = Math.floor(Math.random() * this.jsonLength);
      return number;
    },
    newPhrase: function() {
      var randomArr = this.jsonBirdNames[this.randomItem()];
      var newPhrase = randomArr[1].speciesFI;
      return newPhrase;
    },*/
    jsonToArray: function(json) {
      var arr = [];
      for(var i in json)
          arr.push([i,json[i]]);
      return arr;
    }
  },
  mounted () {
    this.output = this.$refs.output;
    this.stopBtn = this.$refs.stop;
    this.description = this.$refs.description;
    this.author = this.$refs.author;
  },
  created () {
    // create two arrays for finnish names and fi=>sci names
    var birdArray = this.jsonToArray(birdNames);
    var birdFinnishNames = [];
    var birdSCIandFInames = new Map();
    
    for(var i = 0; i <= this.countJsonLength(birdNames); i++) {
      var bird = birdArray[i];

      if(bird) {
        var nameFi = bird[1].speciesFI.toLowerCase();
        var nameSci = bird[1].speciesSCI;
        birdSCIandFInames.set(nameFi, nameSci);
        birdFinnishNames.push(nameFi);
      }
    }
    this.jsonBirdNamesFI = birdFinnishNames;
    this.jsonBirdNamesSCIandFI = birdSCIandFInames;

    this.jsonBirdInfo = this.jsonToArray(birdSpeciesInfo);
    console.log(this.jsonToArray(birdSpeciesInfo));

    this.startDisable = false; // allow using button when everything is ready
  },
}
</script>

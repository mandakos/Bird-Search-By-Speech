<template>
  <div class="birdSearchSpeech result-container" ref="container">
    <h1 class="search-title">Etsi lintulajin nimellä</h1>

    <button class="btn" v-on:click="startRecognition" ref="start" v-bind:disabled="startDisable">Aloita puhe</button>
    <button class="btn" v-on:click="cancelRecognition" ref="stop" style="display: none;">Peruuta</button>

    <div>
        <p class="speech-result" ref="output"></p>
        <div class="bird-image-container" ref="image"></div>
        <p class="bird-image-author" ref="imageAuthor"></p>
        <p class="bird-description" ref="description"></p>
        <p class="bird-description-author" ref="author"></p>
        
    </div>
  </div>
</template>

<script>
import BirdNameRecognizer from '@/js/speech.js'
import birdNames from '@/json/birdNames.json';
import birdSpeciesInfo from '@/json/birdSpeciesInfo.json';
import birdImageInfo from '@/json/imageAuthors.json';

export default {
  name: 'BirdSearchBySpeech',
  data: function() {
    return {
        output: '',
        startBtn: '',
        stopBtn: '',
        description: '',
        author: '',
        image: '',
        imageAuthor: '',
        speechInput: '',
        container: '',
        startDisable: true,
        jsonBirdNamesSCIandFI: [],
        jsonBirdNamesFI: [],
        jsonBirdInfo: [],
        jsonBirdImgInfo: [],
        recognizer: null,
        speechResult: ''
    };
  },
  methods: {
    startRecognition: function (event) {
      if(event) {
        var startBtn = event.target;
      } else {
        var startBtn = this.startBtn;
      }

      // Create new speech recognition object and
      // pass all needed elements and arrays
      this.recognizer = new BirdNameRecognizer(startBtn, this.output, this.stopBtn, this.description, 
                                              this.jsonBirdNamesFI, this.jsonBirdNamesSCIandFI,
                                              this.jsonBirdInfo, this.author, this.image, this.imageAuthor,
                                              this.jsonBirdImgInfo, this.container);
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
    this.image = this.$refs.image;
    this.imageAuthor = this.$refs.imageAuthor;
    this.container = this.$refs.container;
    this.startBtn = this.$refs.start;
    //this.startDisable = false; // allow using button when everything is ready
    this.startRecognition();
  },
  created () {
    // create two custom arrays for finnish names and fi=>sci names
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

    // convert species info and image author jsons to arrays,
    // and set in variables
    this.jsonBirdInfo = this.jsonToArray(birdSpeciesInfo);
    this.jsonBirdImgInfo = this.jsonToArray(birdImageInfo);
  },
}
</script>

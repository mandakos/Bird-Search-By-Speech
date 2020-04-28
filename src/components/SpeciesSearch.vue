<template>
  <div class="bird-search-wrapper" ref="container">
    <div class="birdSearchSpeech result-container">
      <h1 class="search-title">Etsi lintulajin nimellä</h1>

      <button class="btn btn-start" v-on:click="startRecognition" ref="start" v-bind:disabled="startDisable">Aloita puhe</button>

      <div class="recording-icon-wrapper" style="display: none;" ref="mic">
        <div class="recording-icon recording-icon-circle">
          <div class="recording-icon-circle recording-icon-inner inner-circle">
            <div class="recording-icon-circle recording-icon-inner-inner inner-circle">
              <font-awesome-icon icon="microphone" class="recording-icon-mic" />
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-cancel" v-on:click="cancelRecognition" ref="stop" style="display: none;">Peruuta</button>
      <p class="speech-result" id="detect-speech" ref="output" v-show="!isBird"></p>

      <div v-if="isBird">
        <div class="name-and-sound">
          <div class="bird-name">
            <h1 class="bird-name-title speech-result-correct">{{birdFIname}}</h1>
            <p class="bird-name-scientific scientific-name">{{birdSCIname}}</p>
          </div>

          <div class="bird-sound">
            <div class="speech-synthesis">
              <a href="#" class="btn-play" v-if="!this.isSpeaking && !this.speakStarted" @click="startSpeech"><font-awesome-icon icon="play"/> Kuuntele lajikuvaus</a>
              <a href="#" class="btn-play" v-if="!this.isSpeaking && this.speakStarted" @click="resumeSpeech()"><font-awesome-icon icon="play"/></a>
              <a href="#" class="btn-pause" v-if="this.isSpeaking" @click="pauseSpeech"><font-awesome-icon icon="pause"/></a>
              <a href="#" class="btn-refresh" v-if="this.speakStarted" @click="startSpeech"><font-awesome-icon icon="redo"/></a>
            </div>
          </div>
        </div>

        <div class="bird-image-container">
          <img clas="bird-image" v-bind:src="image" /> 
        </div>

        <p class="bird-image-author">
          <a target="_blank" v-bind:href="imageAuthorUrl">{{imageAuthor}}</a> | 
          <a target="_blank" v-bind:href="imageUrl">{{imageName}}</a> | 
          <a target="_blank" v-bind:href="imageLicense">Lisenssi</a>
        </p>

        <iframe v-if="isSound" v-bind:src='sound' scrolling='no' frameborder='0' width='340' height='115'></iframe>

        <p class="bird-description">{{description}}</p>  
        <p v-html="extraLink"></p>
      </div>
    </div>
      <p class="bird-description-author" v-html="author"></p>
  </div>
</template>

<script>
import {SpeechRecognizer,NotSpeechRecognizer} from '@/js/recognizeSpeech.js'
import {getBirdByName} from '@/js/getBirdInfo.js'
import {startSpeech} from '@/js/speak.js';
import {pauseSpeech} from '@/js/speak.js';
import {resumeSpeech} from '@/js/speak.js';
import {stopSpeech} from '@/js/speak.js';
import axios from 'axios';

export default {
  name: 'BirdSearchBySpeech',
  data: function() {
    return {
        birdFIname: '',
        birdSCIname: '',
        output: '',
        extraLink: '',
        startBtn: '',
        stopBtn: '',
        description: '',
        author: '',
        image: '',
        imageUrl: '',
        imageName: '',
        imageAuthor: '',
        imageAuthorUrl: '',
        imageLicense: '',
        sound: '',
        isSound: false,
        container: '',
        mic: '',
        startDisable: true,
        recognizer: null,
        isBird: false,
        isSpeaking: false,
        speakStarted: false
    };
  },
  methods: {
    startRecognition: function (event) {

      stopSpeech();
      this.isSpeaking = false;
      this.speakStarted = false;
      this.isBird = false;
      this.isSound = false;

      if(event) {
        var startBtn = event.target;
      } else {
        var startBtn = this.startBtn;
      }

      // Create new speech recognition object and
      // pass all needed elements and arrays
      this.recognizer = new SpeechRecognizer(
        startBtn, this.output, this.stopBtn, this.container, this.mic, "name"
      );
      this.recognizer.startRecognizing();

      this.detectSpeechResult();
    },
    cancelRecognition: function () {
      this.recognizer.abortRecognizing();
    },
    getBirdInfo: function(speech) {
      var birdInfo = getBirdByName(speech);

      if(birdInfo) {

        if(birdInfo.fiName) {
          this.birdFIname = birdInfo.fiName;
        }

        if(birdInfo.sciName) {
          this.birdSCIname = birdInfo.sciName;
          this.getBirdSound(this.birdSCIname);
        }

        if(birdInfo.imgInfo){
          this.imageAuthor = birdInfo.imgInfo.authName;
          this.imageAuthorUrl = birdInfo.imgInfo.authUrl;
          this.imageName = birdInfo.imgInfo.imgName;
          this.imageUrl = birdInfo.imgInfo.srcUrl;
          this.imageLicense = birdInfo.imgInfo.license;
          var baseUrl = window.location.origin;
          this.image = baseUrl + '/img/bird-images/' + birdInfo.sciName + '.jpg';
        }

        if(birdInfo.descText) {
          this.description = birdInfo.descText;
        }

        if(birdInfo.descAuthor){
          this.extraLink = '<a class="atlas-link" target="_blank" href="http://atlas3.lintuatlas.fi/tulokset/laji/' + 
                            birdInfo.fiName + '">Katso pesimäalueiden levinneisyys Lintuatlaksessa</a>';
          this.author = 'Lajiteksti: <a target="_blank" href="http://atlas3.lintuatlas.fi/">' +
                        'Suomen III lintuatlas</a>' + birdInfo.descAuthor +
                        ', Luonnontieteellinen keskusmuseo Luomus. <br>' + 
                        '<a class="cc-link" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi">' + 
                        'Creative Commons Nimeä-Epäkaupallinen-Tarttuva</a>';
        }

        this.isBird = true;
      }
    },
    callbackObserver: function(mutationsList, observer) {
      var speechResult = this.$refs.output.innerHTML;
      this.getBirdInfo(speechResult);
    },
    detectSpeechResult: function() {
      const targetNode = document.getElementById('detect-speech');
      const config = { childList: true };
      const observer = new MutationObserver(this.callbackObserver);
      observer.observe(targetNode, config);
    },
    startSpeech: function() {
      startSpeech(this.description);
      this.isSpeaking = true;
      this.speakStarted = true;
    },
    resumeSpeech: function() {
      resumeSpeech();
      this.isSpeaking = true;
    },
    pauseSpeech: function() {
      pauseSpeech();
      this.isSpeaking = false;
    },
    getBirdSound: function(sciName) {
      var apiBase = 'https://www.xeno-canto.org/api/2/recordings?query=';
      var apiName = sciName.split(' ').join('+');
      var apiUrl = apiBase + apiName.toLowerCase();

      axios
      .get(apiUrl)
      .then(response => {
        var min = 0;
        var max = response.data.numRecordings;
        var random = Math.floor(Math.random() * (+max - +min)) + +min; 
        var mp3Id = response.data.recordings[random].id;
        this.sound = 'https://www.xeno-canto.org/' + mp3Id + '/embed?simple=1';
        this.isSound = true;
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.output = this.$refs.output;
    this.stopBtn = this.$refs.stop;
    this.container = this.$refs.container;
    this.startBtn = this.$refs.start;
    this.mic = this.$refs.mic;

    this.startRecognition();
  }
}
</script>

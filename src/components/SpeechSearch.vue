<template>
  <div class="bird-search-wrapper" ref="container">
    <div class="birdSearchSpeech result-container">
      <h1 class="search-title">Etsi lintulajin nimellä</h1>
      <h1>
        <font-awesome-icon icon="crow" class="crow-icon" />
        <font-awesome-icon icon="microphone" class="speech-home-icon" />
      </h1>
      <button class="btn btn-start" v-on:click="startRecognition" ref="start" v-bind:disabled="startDisable">Odota...</button>
      <div class="notSupported" style="display: none;" ref="notSupported">
        <p>Valitettavasti selaimesi ei tue puheentunnistusta.</p>
        <p><a href="/lintuhaku">Palaa takaisin</a> tai hae kirjoittamalla alle lintulajin nimi tai tuntomerkit<br>
        (paina ENTER hakeaksesi):</p>
        <input type="text" size="60" id="fallback-search" v-on:keyup.enter="submitForm" ref="notSupportedForm">
      </div>
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
        <ul v-if="bestMatches.length > 0" class="best-matches">
          <li>Katso myös: </li>
          <li class="best-matches-li" v-for="item in bestMatches" :key="item">
            <a href="#" class="best-matches-link" @click="getBirdInfo(item)">{{item}}</a>
          </li>
        </ul>

        <div class="name-and-sound">
          <div class="bird-name">
            <h1 class="bird-name-title speech-result-correct">{{birdFIname}}</h1>
            <p class="bird-name-scientific scientific-name">{{birdSCIname}}</p>
          </div>
          <div class="bird-listen-desc">
            <div class="speech-synthesis">
              <a href="#" class="btn-play" v-if="!this.isSpeaking && !this.speakStarted" @click="startSpeech"><font-awesome-icon icon="play"/> Kuuntele lajikuvaus</a>
              <a href="#" class="btn-play" v-if="!this.isSpeaking && this.speakStarted" @click="resumeSpeech"><font-awesome-icon icon="play"/></a>
              <a href="#" class="btn-pause" v-if="this.isSpeaking" @click="pauseSpeech"><font-awesome-icon icon="pause"/></a>
              <a href="#" class="btn-refresh" v-if="this.speakStarted" @click="startSpeech"><font-awesome-icon icon="redo"/></a>
            </div>
          </div>
        </div>
        <div class="bird-image-container">
          <img clas="bird-image" v-bind:src="image" /> 
        </div>
        <p class="bird-image-author">
          Kuva: 
          <a target="_blank" v-bind:href="imageAuthorUrl">{{imageAuthor}}</a> | 
          <a target="_blank" v-bind:href="imageUrl">{{imageName}}</a> | 
          <a target="_blank" v-bind:href="imageLicense">Lisenssi</a>
        </p>
        <div class="bird-audio">
          <iframe v-if="isSound" v-bind:src='sound' scrolling='no' frameborder='0' width='340' height='115'></iframe>
        </div>
        <p class="bird-description">{{description}}</p>  
        <p v-html="extraLink"></p>
      </div>
    </div>
    <p v-if="isBird" class="bird-description-author" v-html="author"></p>
  </div>
</template>

<script>
import {SpeechRecognizer} from '@/js/recognizeSpeech.js'
import {getBirdFromSpeech} from '@/js/getBirdInfo.js'
import {startSpeech} from '@/js/speak.js';
import {pauseSpeech} from '@/js/speak.js';
import {resumeSpeech} from '@/js/speak.js';
import {stopSpeech} from '@/js/speak.js';
//import axios from 'axios';

export default {
  name: 'SpeechSearch',
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
        notSupported: '',
        mic: '',
        startDisable: true,
        recognizer: null,
        isBird: false,
        isSpeaking: false,
        speakStarted: false,
        bestMatches: ''
    };
  },
  methods: {
    startRecognition: function (event) {
      stopSpeech();
      this.isSpeaking = false;
      this.speakStarted = false;
      this.isBird = false;
      this.isSound = false;
      var startButton = this.startBtn;

      if(event) {
        startButton = event.target;
      }

      // Create new speech recognition object and
      // pass all needed elements and arrays
      
      this.recognizer = new SpeechRecognizer(
        startButton, this.output, this.stopBtn, 
        this.container, this.mic, this.notSupported
      );
      this.recognizer.startRecognizing();

      this.detectSpeechResult();
    },
    cancelRecognition: function () {
      this.recognizer.abortRecognizing();
    },
    getBirdInfo: function(speech) {
      var birdInfo = getBirdFromSpeech(speech.toLowerCase());

      if(birdInfo) {

        if(birdInfo.fiName) {
          this.birdFIname = birdInfo.fiName;
        }

        if(birdInfo.sciName) {
          this.birdSCIname = birdInfo.sciName;

          /*if(this.birdSCIname) {
            this.getBirdSound(this.birdSCIname);
          }*/
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
          this.author = '<b>Lajiteksti: </b>' + birdInfo.descAuthor + ', <a target="_blank" href="http://atlas3.lintuatlas.fi/">' +
                        'Suomen III lintuatlas</a>,<br>' + 'Luonnontieteellinen keskusmuseo Luomus. <br>' + 
                        '<a class="cc-link" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi">' + 
                        'Creative Commons Nimeä-Epäkaupallinen-Tarttuva</a>';
        }

        if(birdInfo.playAudio) {
          this.startSpeech();
        }

        if(birdInfo.bestMatches) {
          this.bestMatches = birdInfo.bestMatches;
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
      if(this.description) {
        startSpeech(this.description);
        this.isSpeaking = true;
        this.speakStarted = true;
      }
    },
    resumeSpeech: function() {
      resumeSpeech();
      this.isSpeaking = true;
    },
    pauseSpeech: function() {
      pauseSpeech();
      this.isSpeaking = false;
    },
    /* API not supporting CORS requests for now
    getBirdSound: function(sciName) {
      var apiBase = 'https://www.xeno-canto.org/api/2/recordings?query=';
      var apiName = sciName.split(' ').join('+');
      var apiUrl = apiBase + apiName.toLowerCase() + '&cnt=finland';

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
    },
    */
    submitForm: function() {
      var text = this.$refs.notSupportedForm.value;
      var clearedText = text.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      this.getBirdInfo(clearedText.toLowerCase());
    }
  },
  mounted () {
    this.output = this.$refs.output;
    this.stopBtn = this.$refs.stop;
    this.container = this.$refs.container;
    this.startBtn = this.$refs.start;
    this.mic = this.$refs.mic;
    this.notSupported = this.$refs.notSupported;
    this.startRecognition();
  }
}
</script>

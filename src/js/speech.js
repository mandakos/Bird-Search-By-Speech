var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
//var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

class BirdNameRecognizer
{
  startBtn = null;
  diagnosticPara = null;
  stopBtn = null;
  author = null;
  image = null;
  imageAuthor = null;
  birdNames = [];
  description = null;
  birdDescriptions = [];
  birdnamesFItoSCI = [];
  birdImageInfo = [];

  recognition = null;
  grammar = null;
  speechRecognitionList = null;
  speechResult = "";

  constructor(startBtn, diagnosticPara, stopBtn, desc, birdNames, birdnamesFItoSCI, 
              birdInfo, author, img, imgAuth, imgInfo) 
  {
    this.startBtn = startBtn;
    this.diagnosticPara = diagnosticPara;
    this.stopBtn = stopBtn;
    this.description = desc;
    this.birdNames = birdNames;
    this.birdnamesFItoSCI = birdnamesFItoSCI;
    this.birdDescriptions = birdInfo;
    this.author = author;
    this.image = img;
    this.imageAuthor = imgAuth;
    this.birdImageInfo = imgInfo;
  }

  startRecognizing() {
    this.stopBtn.style.display = "block";
    this.startBtn.disabled = true;
    this.startBtn.textContent = 'Hetki...';
    this.diagnosticPara.textContent = '';
    this.description.textContent = '';
    this.author.textContent = '';
    this.imageAuthor.textContent = '';
    this.image.src = '';

    this.grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + this.birdNames.join(' | ') + ' ;';
    this.recognition = new SpeechRecognition();
    this.speechRecognitionList = new SpeechGrammarList();
    this.speechRecognitionList.addFromString(this.grammar, 1);
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.lang = 'fi-FI';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.start();

    this.recognition.addEventListener('result', event => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at position 0.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object 
      var speechResult = event.results[0][0].transcript.toLowerCase();

      // check if speechResult can be found in finnish bird names
      if(this.birdnamesFItoSCI.get(speechResult)) {
        var birdSCIName = this.birdnamesFItoSCI.get(speechResult);

        // show specie name in all available languages
        this.diagnosticPara.innerHTML = '<h2 class="speech-result-correct">' + speechResult + '</h2>' +
                                        '<span class="specie-scientic-name">'+ birdSCIName + '</span>';


        // get description text by scientific name and
        // add a link to Lintuatlas
        for(var i = 0; i < this.birdDescriptions.length; i++) {
          if(this.birdDescriptions[i][0] === birdSCIName) {
            this.description.innerHTML = '<p class="description-text">' + this.birdDescriptions[i][1].post_content + '</p>'+
                                          '<a class="atlas-link" target="_blank" href="http://atlas3.lintuatlas.fi/tulokset/laji/' + 
                                          speechResult + '">Katso pesimäalueiden levinneisyys Lintuatlaksessa</a>';
            this.author.innerHTML = 'Lajiteksti: <a target="_blank" href="http://atlas3.lintuatlas.fi/">Suomen III lintuatlas</a> – ' + 
                                      this.birdDescriptions[i][1].post_author +
                                      ', Luonnontieteellinen keskusmuseo Luomus. <br><a class="cc-link" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi">Creative Commons Nimeä-Epäkaupallinen-Tarttuva</a>';
          }
        }

        // set bird image by scientific name
        var baseUrl = window.location.origin;
        this.image.src = baseUrl +  '/img/bird-images/' + birdSCIName + '.jpg';

        // get bird image author and set in place
        for(var i = 0; i < this.birdImageInfo.length; i++) {
          if(this.birdImageInfo[i][0] === birdSCIName) {
            this.imageAuthor.innerHTML = 'Kuva: <a target="_blank" href="' + 
                                          this.birdImageInfo[i][1][0].photographerUrl + '">' + 
                                          this.birdImageInfo[i][1][0].PhotographerName + '</a>' +
                                          ' | <a target="_blank" href="' + 
                                          this.birdImageInfo[i][1][0].imageSourceUrl + '">' + 
                                          this.birdImageInfo[i][1][0].imageName + '</a>'+
                                          ' | <a target="_blank" href="' + 
                                          this.birdImageInfo[i][1][0].license + '">Lisenssi</a>';
          }
        }
      }
      else {
        // if not recognized as bird name in finnish
        this.diagnosticPara.innerHTML = 'Sanoit: <span class="speech-result-invalid">' + speechResult + 
          '</span>. Tämä ei taida olla lintulaji, ainakaan suomessa. Kokeile uudestaan?';
      }

    })

    this.recognition.addEventListener('speechend', event => {
      this.stopRecognizing();
    })

    this.recognition.addEventListener('error', event => {
      this.diagnosticPara.textContent = 'Tapahtui virhe: ' + event.error;
      this.stopRecognizing();
    })

    this.recognition.addEventListener('audiostart', event => {
      //Fired when the user agent has started to capture audio.
      this.startBtn.textContent = 'Sano lintulaji...';
    })

    /*
    this.recognition.addEventListener('end', event => {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
    })
    
    this.recognition.onaudioend = function(event) {
        //Fired when the user agent has finished capturing audio.
        console.log('SpeechRecognition.onaudioend');
    }
    
    this.recognition.onnomatch = function(event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log('SpeechRecognition.onnomatch');
    }
    
    this.recognition.onsoundstart = function(event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log('SpeechRecognition.onsoundstart');
    }
    
    this.recognition.onsoundend = function(event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log('SpeechRecognition.onsoundend');
    }
    
    this.recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log('SpeechRecognition.onspeechstart');
    }
    this.recognition.onstart = function(event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log('SpeechRecognition.onstart');
    }
    */
  }

  stopRecognizing() {
    this.recognition.stop();
    this.startBtn.disabled = false;
    this.stopBtn.style.display = "none";
    this.startBtn.textContent = 'Aloita uudestaan';
  }

}

export default BirdNameRecognizer
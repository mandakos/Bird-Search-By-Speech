var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

class BirdNameRecognizer
{
  startBtn = null;
  diagnosticPara = null;
  stopBtn = null;
  author = null;
  birdNames = [];
  description = null;
  birdDescriptions = {};
  birdnamesFItoSCI = [];

  recognition = null;
  grammar = null;
  speechRecognitionList = null;
  speechResult = "";

  constructor(startBtn, diagnosticPara, stopBtn, description, birdNames, birdnamesFItoSCI, birdInfo, author) 
  {
    this.startBtn = startBtn;
    this.diagnosticPara = diagnosticPara;
    this.stopBtn = stopBtn;
    this.description = description;
    this.birdNames = birdNames;
    this.birdnamesFItoSCI = birdnamesFItoSCI;
    this.birdDescriptions = birdInfo;
    this.author = author;
  }

  startRecognizing() {
    this.stopBtn.style.display = "block";
    this.startBtn.disabled = true;
    this.startBtn.textContent = 'Sano lintulaji...';
    this.diagnosticPara.textContent = '';
    this.description.textContent = '';
    this.author.textContent = '';

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
      this.diagnosticPara.textContent = speechResult;

      if(this.birdnamesFItoSCI.get(speechResult)) {
        var birdSCIName = this.birdnamesFItoSCI.get(speechResult);
        this.description.textContent = birdSCIName;

        for(var i = 0; i < this.birdDescriptions.length; i++) {
          if(this.birdDescriptions[i][0] === birdSCIName) {
            this.description.textContent = this.birdDescriptions[i][1].post_content;
            this.author.textContent = "Teksti: " + this.birdDescriptions[i][1].post_author;
          }
        }
      }

    })

    this.recognition.addEventListener('speechend', event => {
      this.stopRecognizing();
    })

    this.recognition.addEventListener('error', event => {
      this.diagnosticPara.textContent = 'Tapahtui virhe: ' + event.error;
      this.stopRecognizing();
    })

    /*
    this.recognition.addEventListener('end', event => {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
    })

    this.recognition.onaudiostart = function(event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }
    
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
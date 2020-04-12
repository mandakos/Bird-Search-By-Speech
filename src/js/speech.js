var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

class BirdNameRecognizer
{
  startBtn = null;
  phrase = null;
  phrasePara = null;
  resultPara = null;
  diagnosticPara = null;
  stopBtn = null;

  recognition = null;
  grammar = null;
  speechRecognitionList = null;

  isRecognizing = false;

  constructor(startBtn, phrase, phrasePara, resultPara, diagnosticPara, stopBtn) 
  {
    this.startBtn = startBtn;
    this.phrase = phrase;
    this.phrasePara = phrasePara;
    this.resultPara = resultPara;
    this.diagnosticPara = diagnosticPara;
    this.stopBtn = stopBtn; 
  }

  startRecognizing() {
    this.stopBtn.style.display = "block";
    this.startBtn.style.display = "none";
    this.startBtn.textContent = 'Sano alla oleva lintulaji...';

    this.phrase = this.phrase.toLowerCase();
    this.phrasePara.textContent = this.phrase;
    this.resultPara.textContent = 'Oikein vai väärin?';
    this.resultPara.style.background = 'rgba(0,0,0,0.2)';
    this.diagnosticPara.textContent = '';

    this.grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + this.phrase +';';
    this.recognition = new SpeechRecognition();
    this.speechRecognitionList = new SpeechGrammarList();
    this.speechRecognitionList.addFromString(this.grammar, 1);
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.lang = 'fi-FI';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.start();
    this.isRecognizing = true;  

    this.recognition.addEventListener('result', event => {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at position 0.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object 
      var speechResult = event.results[0][0].transcript.toLowerCase();
      this.diagnosticPara.textContent = 'Havaittu sana: ' + speechResult + '.';
      if(speechResult === this.phrase) {
        this.resultPara.textContent = 'Nappiin meni!';
        this.resultPara.style.background = 'lime';
      } else {
        this.resultPara.textContent = 'Ei onnistunut.';
        this.resultPara.style.background = 'red';
      }
    })

    this.recognition.addEventListener('speechend', event => {
      this.stopRecognizing();
    })

    this.recognition.addEventListener('error', event => {
      this.stopRecognizing();
      this.diagnosticPara.textContent = 'Tapahtui virhe: ' + event.error;
    })
    
    /*
    this.recognition.onaudiostart = function(event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }
    
    this.recognition.onaudioend = function(event) {
        //Fired when the user agent has finished capturing audio.
        console.log('SpeechRecognition.onaudioend');
    }
    
    this.recognition.onend = function(event) {
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
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
    this.startBtn.style.display = "block";
    this.stopBtn.style.display = "none";
    this.isRecognizing = false;
    this.startBtn.textContent = 'Aloita uudestaan';
    this.phrasePara.textContent = 'Tunnistus keskeytetty';
  }

}

export default BirdNameRecognizer
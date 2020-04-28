var synth = window.speechSynthesis;

export function startSpeech(text){
  synth.cancel(); // remove earlier utterance

  if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
  }

  if (text !== '') {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterance.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterance.lang = 'fi-FI'; // Finnish voice
    utterance.pitch = 1.1;
    utterance.rate = 0.8;
    synth.speak(utterance);
  }
}

export function pauseSpeech(){
  synth.pause()
}

export function resumeSpeech(){
  synth.resume()
}

export function stopSpeech(){
  synth.cancel();
}
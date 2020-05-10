var synth = window.speechSynthesis;

export function startSpeech(text){
  synth.cancel();

  if (text !== '') {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI'; // Finnish voice
    utterance.pitch = 1.0;
    utterance.rate = 0.9;
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
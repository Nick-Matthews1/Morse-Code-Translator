class audio {}

window.AudioContext = (window.AudioContext || audio);

class Tone {
  constructor() {
    this.ctx = new AudioContext();
    this.noteLength = 1/4;
    this.attack = 1/64;
    
    if (this.ctx.constructor === audio) {
      this.ctx = null;
      
    }
  }
  
  playNote(note, duration = 1, delay = 0) {
    if (!this.ctx) return;
    
    let oscillator = this.ctx.createOscillator();
    let gainNode = this.ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    let start = this.ctx.currentTime + this.noteLength * delay;
    let end = start + this.noteLength * duration;
    
   
    gainNode.gain.setValueAtTime(0, start);
    
    gainNode.gain.linearRampToValueAtTime(1, start + this.attack);
    
    gainNode.gain.linearRampToValueAtTime(0, end);
    
    oscillator.frequency.value = this._midiToFrec(note);
    
    oscillator.start(start);
    oscillator.stop(end);
    
    return end;
  }
  
  play(note, durationMs = 60, delayMs = 0) {
    if (!this.ctx) return;
    
    let oscillator = this.ctx.createOscillator();
    let gainNode = this.ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    let start = this.ctx.currentTime + delayMs * 0.001;
    let end = start + durationMs * 0.001;
    
 
    gainNode.gain.setValueAtTime(0, start);
    
    gainNode.gain.linearRampToValueAtTime(1, start + this.attack);
    
    gainNode.gain.linearRampToValueAtTime(0, end);
    
    oscillator.frequency.value = this._midiToFrec(note);
    
    oscillator.start(start);
    oscillator.stop(end);
    
    return end;
  }
  
 
  _midiToFrec(note) {
    return (Math.pow(2, (note - 69) / 12)) * 440.0;
  }
}
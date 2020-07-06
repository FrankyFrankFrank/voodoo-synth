import EventEmitter from "es-event-emitter";
import keyMap from '@/keys';

export default class Keyboard  {
    constructor() {
        this.emitter = new EventEmitter();
        console.log(this.emitter);
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
        window.addEventListener('keyup', this.handleKeyUp.bind(this))
    }

    handleKeyDown(e) {
        if (e.repeat) return;
        if (!keyIsAValidNote(e.key)) return;
        
        this.emitter.emit('note', 2); 
    }

    handleKeyUp(e) {
        this.emitter.emit('note-stop', e.key)
    }

    onKeyDown(fn) {
        this.emitter.on('note', fn);
    }

    
}

const keyIsAValidNote = (key) => {
    return keyMap[key] !== undefined;
}
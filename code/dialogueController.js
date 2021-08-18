import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';

const DIALOGUE_STATES = {
    Typing: 'Typing',
    Finished: 'Finished',
}


var dialogueDivs;

export class DialogueController {
    constructor(dialogue = TEST_DIALOGUE, callback = null) {
        this.dialogue = dialogue;
        this.progress = 0;
        this.callback = callback;
        //gameDiv.appendChild(dialogueDivs);
    }

    getDialogueLine() {
        const me = this;

        var ret = document.createElement('div');
        ret.className = "dialogueLine";
        ret.textContent = this.dialogue.lines[this.progress].statement;

        var talkSprite = ENTITIES[this.dialogue.lines[this.progress].speaker];
        talkSprite.graphics.animState = this.dialogue.lines[this.progress].emotion;
        talkSprite.graphics.goto(0.20, 0.70);

        graphicsController.entities = [talkSprite];
        
        setTimeout( function () {
            if(me.progress + 1 >= me.dialogue.lines.length) {
                console.log("aa");
                gameDiv.onclick = me.callback;
            } else {
                console.log("AAAA");
                gameDiv.onclick = function () {
                    console.log("boop");
                    gameDiv.removeChild(dialogueDivs);
                    me.progress++;
                    me.getDialogueLine();
                };
            }
        }, 50
        );


        dialogueDivs = document.createElement('div');
        dialogueDivs.className = "dialogueDivs";
        dialogueDivs.appendChild(ret);
        gameDiv.appendChild(dialogueDivs);
    }
}


class DialogueLine {
    constructor(speaker, emotion, statement) {
        this.speaker = speaker;
        this.emotion = emotion;
        this.statement = statement;
    }
}

//New Dialogue Line shorthand
function nL(speaker, emotion, statement) {return new DialogueLine(speaker, emotion, statement)};

//todo allow putting functions at the end of dialogue
class Dialogue {
    constructor(lines) {
        this.lines = lines;
    }
}

const TEST_DIALOGUE = new Dialogue([
    nL('cactus', 'neutral', 'Hello world!'),
    nL('cactus', 'neutral', 'This system is a bit clunky at the moment, but I hope it works!'),
    nL('cactus', 'neutral', 'Also: Get Tillmaned Lol')
]);
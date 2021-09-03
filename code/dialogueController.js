import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { DEF_DIMENSIONS } from "./graphics/graphics.js";


const TALKSPRITE_COORDS = {
    x: 0.20 * DEF_DIMENSIONS.width,
    y: 0.70 * DEF_DIMENSIONS.height
};

const DIALOGUE_COORDS = {
    x: 0.25 * DEF_DIMENSIONS.width,
    y: 0.70 * DEF_DIMENSIONS.height
};

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
        const divCoords = graphicsController.convertCoordinates(DIALOGUE_COORDS.x, DIALOGUE_COORDS.y);
        ret.style.left = "" + divCoords.x + "px";
        ret.style.top = "" + divCoords.y + "px";

        ret.textContent = this.dialogue.lines[this.progress].statement;

        var talkSprite = ENTITIES[this.dialogue.lines[this.progress].speaker];
        talkSprite.graphics.animState = this.dialogue.lines[this.progress].emotion;
        talkSprite.graphics.goto(TALKSPRITE_COORDS.x, TALKSPRITE_COORDS.y);

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
    nL('cactus', 'neutral', 'This system is a bit clunky and barebones at the moment, but I hope it works!'),
    nL('cactus', 'neutral', 'im going to keep doing my little dance')
]);
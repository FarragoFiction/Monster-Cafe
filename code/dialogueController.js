const DIALOGUE_STATES = {
    Typing: 'Typing',
    Finished: 'Finished',
}


export default class DialogueController {
    constructor(dialogue) {
        this.dialogue = dialogue;
        this.progress = {
            phrase: 0,
            letter: 0,
            pEnd: dialogue.lines.length(),
            lEnd: dialogue.lines[0].statement.length()
        };
        this.speaker = dialogue.lines[this.progress.phrase].speaker;
        this.saying = dialogue.lines[this.progress.phrase].statement;
        this.said = "";
        this.state = DIALOGUE_STATES.Typing;
    }

    processInput() {
        switch (this.state) {
            case DIALOGUE_STATES.Typing:
                //todo
                break;
        
            case DIALOGUE_STATES.Finished:
                //todo
                break;
        }
    }
    
    update() {
        switch (this.state) {
            case DIALOGUE_STATES.Typing:
                if(this.progress.letter <= this.progress.lEnd) {
                    this.said = this.saying.substring(0, this.progress.letter);
                    this.progress.letter++;
                } else {
                    this.said = this.saying;
                    this.state = DIALOGUE_STATES.Finished;
                }
                break;
        
            case DIALOGUE_STATES.Finished:
                //should be nothing
                break;
        }
    }

    render() {
        var output = document.createElement('div'); //todo make this pretty
        switch (this.state) {
            case DIALOGUE_STATES.Typing:
                output.textContent = this.speaker + ": " + this.said;
                break;
        
            case DIALOGUE_STATES.Finished:
                output.textContent = this.speaker + ": " + this.saying + "\n(press Space to continue)";//todo do we wanna use space?
                //todo make the extra sentence blink
                break;
        }
        return output;
    }

    static TEST_DIALOGUE = new Dialogue([
        nL('Cactus', 'Neutral', 'Hello world!'),
        nL('Cactus', 'Neutral', 'This system is a bit clunky at the moment, but I hope it works!'),
        nL('Cactus', 'Neutral', 'Also: Get Tillmaned Lol')
    ]);
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

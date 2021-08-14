import { graphicsController, gameDiv} from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";

export class StartMenuController {
    constructor() {
    }

    processInput() {
        
    }
    
    update() {
         //if we want fancy background graphics we can put them here i guess?       
    }
    
    render() {
        
    }

    begin() {
        gameDiv.append(getStartMenuDivs());
    }
}

function getStartMenuDivs() {
    var ret = document.createElement('div');
    ret.className = "startMenuHolder";

    ret.append(getStartMenuTitle("Diner Of The Damned"));
    ret.append(getStartMenuButton("Resume Game", fuck));
    ret.append(document.createElement('br'));
    ret.append(getStartMenuButton("New Game", fuck));
    ret.append(document.createElement('br'));
    ret.append(getStartMenuButton('Settings', fuck));

    return ret;
}

function getStartMenuButton(text, callback) {
    var ret = document.createElement('button');
    ret.className = "startMenuButton";
    ret.textContent = text;
    ret.onclick = callback;
    return ret;
}

function getStartMenuTitle(text) {
    var ret = document.createElement('h1');
    ret.className = "startMenuTitle";
    ret.textContent = text;
    return ret;
}

function fuck() {
    ENTITIES["friend"].graphics.goto(0.5,0.5);
    ENTITIES["friend"].graphics.goto(1,1,1000, Ease.inExpo);

    ENTITIES["friend"].graphics.makeChange("r", 0);
    ENTITIES["friend"].graphics.makeChange("r", 3, 5000, Ease.outSine);
    graphicsController.entities = [ENTITIES["friend"], ENTITIES["background"]];
}
import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";
import { DialogueController } from "./dialogueController.js";

export class StartMenuController {
    constructor() {
    }

    begin() {
        gameDiv.append(getStartMenuDivs());
        makeBackground();
    }
}

var startMenuDivs;

function getStartMenuDivs() {
    startMenuDivs = document.createElement('div');
    startMenuDivs.className = "startMenuHolder";

    startMenuDivs.append(getStartMenuTitle("Diner Of The Damned"));
    startMenuDivs.append(getStartMenuButton("test combat", 1, testCombat));
    startMenuDivs.append(document.createElement('br'));
    startMenuDivs.append(getStartMenuButton("fly into the corner", 2, fuck));
    startMenuDivs.append(document.createElement('br'));
    startMenuDivs.append(getStartMenuButton("test dialogue", 3, startTestDialogue));
    startMenuDivs.append(document.createElement('br'));

    return startMenuDivs;
}

function getStartMenuButton(text, index, callback) {
    var ret = document.createElement('button');
    ret.className = "startMenuButton";
    ret.textContent = text;
    ret.onclick = callback;

    ret.style.animationDelay = `${index/8}s`;

    return ret;
}

function getStartMenuTitle(text) {
    var ret = document.createElement('h1');
    ret.className = "startMenuTitle";
    ret.textContent = text;
    return ret;
}

function fuck() {
    gameDiv.removeChild(startMenuDivs);
    ENTITIES["friend"].graphics.goto(0.5,0.5);
    ENTITIES["friend"].graphics.goto(1,1,1000, Ease.inExpo);

    ENTITIES["friend"].graphics.makeChange("r", 0);
    ENTITIES["friend"].graphics.makeChange("r", 3, 5000, Ease.outSine);
    ENTITIES["friend"].graphics.makeChange("scale", 100, 100000);
    graphicsController.entities = [ENTITIES["friend"], ENTITIES["overhead"]];

    gameDiv.appendChild(getTestMenuDivs());
}

function startTestDialogue() {
    gameDiv.removeChild(startMenuDivs);
    var talk = new DialogueController();
    talk.getDialogueLine();
}

function makeBackground() {
    graphicsController.entities = [ENTITIES["interiorScenery"]];
}


var testMenuDivs;
function getTestMenuDivs() {
    testMenuDivs = document.createElement('div');
    testMenuDivs.className = "startMenuHolder";

    testMenuDivs.append(getStartMenuTitle("get tillmaned lol"));
    testMenuDivs.append(getStartMenuButton("Pause", 1, pause));

    return testMenuDivs;
}

function testCombat() {
    
}
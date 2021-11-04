import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";
import { DialogueController } from "./dialogueController.js";
import { CombatController } from "./combatController.js";
import { PreparationController } from "./preparationController.js";
import { DEF_DIMENSIONS } from "./graphics/graphics.js";

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
    startMenuDivs.append(getStartMenuButton("new game", 1, newGame));
    startMenuDivs.append(document.createElement('br'));
    startMenuDivs.append(getStartMenuButton("test combat", 2, testCombat));
    startMenuDivs.append(document.createElement('br'));
    startMenuDivs.append(getStartMenuButton("fly into the corner", 3, testMovement));
    startMenuDivs.append(document.createElement('br'));
    startMenuDivs.append(getStartMenuButton("test dialogue", 4, startTestDialogue));
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

function testMovement() {
    gameDiv.removeChild(startMenuDivs);
    ENTITIES["friend"].graphics.goto(0.5 * DEF_DIMENSIONS.width,0.5 * DEF_DIMENSIONS.height);
    ENTITIES["friend"].graphics.goto(0.7 * DEF_DIMENSIONS.width,0.7 * DEF_DIMENSIONS.height, 1000, Ease.inExpo);
    ENTITIES["friend"].graphics.makeChange("r", 0);
    ENTITIES["friend"].graphics.makeChange("r", 3, 5000, Ease.outSine);
    ENTITIES["friend"].graphics.makeChange("scale", 2, 100);
    graphicsController.entities = [ENTITIES["friend"], ENTITIES["overhead"]];

    graphicsController.camera.goto(0.5 * DEF_DIMENSIONS.width, DEF_DIMENSIONS.height, 1000, Ease.inExpo);
    graphicsController.camera.makeChange("scale", 0.7, 5000, Ease.linear);
    graphicsController.camera.makeChange("r", -6, 10000, Ease.outBack);

    gameDiv.appendChild(getTestMenuDivs());
}

function startTestDialogue() {
    gameDiv.removeChild(startMenuDivs);
    var talk = new DialogueController();
    talk.getDialogueLine();
}

function newGame() {
    gameDiv.removeChild(startMenuDivs);

    var prep = new PreparationController();

    prep.build();
    
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
    gameDiv.removeChild(startMenuDivs);
    var combat = CombatController.makeTestScenario();
    combat.draw();
    combat.playerTurn();
}
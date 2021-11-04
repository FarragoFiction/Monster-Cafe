import { graphicsController, gameDiv, pause} from "./main.js";
import { ACTION_EVENTS, ACTIONS, makeUIButton, Action, ACTION_TYPES, ACTION_TYPE_NAMES} from "./combat/action.js";
import { ENTITIES } from "./entity.js";
import { PARTYMEMBERS, ENEMIES } from "./combatParticipants.js";
import { DEF_DIMENSIONS } from "./graphics/graphics.js";

const CHARSELECT_COORDS = {
    x: 0 * DEF_DIMENSIONS.width,
    y: 0.1 * DEF_DIMENSIONS.height
};

const FOOD_COORDS = {
    x: 0.8 * DEF_DIMENSIONS.width,
    y: 0.1 * DEF_DIMENSIONS.height
};

export class PreparationController {
    constructor() {
        
    }

    build() {
        buildCharacterSelect();
        buildFoodSelect();
        buildScenarioPreview();
    }
}

var charSelect;
function buildCharacterSelect() {
    charSelect = document.createElement('div');
    charSelect.className = "charSelect";
    
    graphicsController.moveElement(charSelect, CHARSELECT_COORDS.x, CHARSELECT_COORDS.y);
    for(var character in PARTYMEMBERS) {
        charSelect.append(makeUIButtonCharacter(PARTYMEMBERS[character]));
        charSelect.append(document.createElement('br'));
    }
    gameDiv.appendChild(charSelect);
}

var foodSelect;
function buildFoodSelect() {
    foodSelect = document.createElement('div');
    foodSelect.className = "foodSelect";
    graphicsController.moveElement(foodSelect, FOOD_COORDS.x, FOOD_COORDS.y);
    for(var food in ACTIONS) {
        foodSelect.append(makeUIButton(ACTIONS[food]));
        foodSelect.append(document.createElement('br'));
    }
    gameDiv.appendChild(foodSelect);
}

var scenarioPreview;
function buildScenarioPreview() {
    scenarioPreview = document.createElement('div');

    gameDiv.appendChild(scenarioPreview);
}


/*
this page needs:
-choosing characters
-building menu for the day
-displaying warnings about the menu?
-display info about the upcoming day
-
*/

export function makeUIButtonCharacter(character) {
    var option = document.createElement('button');
    option.className = "combatOptionButton";
    
    var name = document.createElement('h3');
    name.textContent = character.name;

    var desc = document.createElement('i');
    desc.textContent = ACTION_TYPE_NAMES[character.proficiency];
    
    option.appendChild(name);
    option.appendChild(desc);
    option.append(document.createElement('br'));

    return option;
}
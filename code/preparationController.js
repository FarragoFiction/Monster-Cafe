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

var charSelect;
var foodSelect;
var scenarioPreview;

export class PreparationController {
    constructor() {
        this.daily_party = {
            length: 0,
            col: {}
        };
        this.daily_menu = {
            length: 0,
            col: {},
        };
    }

    build() {
        this.buildCharacterSelect();
        this.buildFoodSelect();
        this.buildScenarioPreview();
    }

    buildCharacterSelect() {
        const me = this.daily_party;
        
        charSelect = document.createElement('div');
        charSelect.className = "charSelect";
        
        graphicsController.moveElement(charSelect, CHARSELECT_COORDS.x, CHARSELECT_COORDS.y);
        for(const character in PARTYMEMBERS) {
            const button = makeUIButtonCharacter(PARTYMEMBERS[character]);
            button.onclick = function() {toggle(button, me, character)};
            charSelect.append(button);
            charSelect.append(document.createElement('br'));
        }
        
        gameDiv.appendChild(charSelect);
    }

    buildFoodSelect() {
        const me = this.daily_menu;
        foodSelect = document.createElement('div');
        foodSelect.className = "foodSelect";
        graphicsController.moveElement(foodSelect, FOOD_COORDS.x, FOOD_COORDS.y);
        for(const food in ACTIONS) {
            const button = makeUIButton(ACTIONS[food]);
            button.onclick = function() {toggle(button, me, food)};
            foodSelect.append(button);
            foodSelect.append(document.createElement('br'));
        }
        gameDiv.appendChild(foodSelect);
    }

    buildScenarioPreview() {
        scenarioPreview = document.createElement('div');
    
        gameDiv.appendChild(scenarioPreview);
    }
}

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

function toggle(option, collection, item) {
    if(collection.col[item] == undefined) {
        console.log("not present! adding...");
        collection.col[item] = item;
        collection.length++;
        option.classList.add("selectedOptionButton");
    } else {
        console.log("present! removing...");
        delete collection.col[item];
        collection.length--;
        option.classList = ["combatOptionButton"];
    }
}

/*
this page needs:
-choosing characters
-building menu for the day
-displaying warnings about the menu?
-display info about the upcoming day
-
*/
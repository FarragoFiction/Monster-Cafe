import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";
import { DialogueController } from "./dialogueController.js";
import { PartyMember, CustomerMember } from "./combatParticipants.js";
import { ACTION_EVENTS, TEST_ACTIONS } from "./combat/action.js";

const COMBAT_BG = "overhead";

export class CombatController {
    constructor(combatScenario) {
        this.combatScenario = combatScenario;
        this.turnsElapsed = 0;
    }

    draw() {
        var entities = [ENTITIES[COMBAT_BG]]; //im being lazy - combat participants aren't entities, but they have a "graphics" module just like them. If this causes problems for future me, you're welcome to throw hands at the back of a dennys.

        entities = this.combatScenario.draw(entities)
        graphicsController.entities = entities;
    }

    static makeTestScenario() {
        var chef = new PartyMember(ENTITIES["friend"], 4);
        
        var foodMenu = [TEST_ACTIONS.hug, TEST_ACTIONS.juice, TEST_ACTIONS.soup, TEST_ACTIONS.steak];

        var section0 = new CombatSection(new PartyMember(ENTITIES["friend"], 1), [new CustomerMember(ENTITIES["friend"])]);
        var section1 = new CombatSection(new PartyMember(ENTITIES["friend"], 2), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var section2 = new CombatSection(new PartyMember(ENTITIES["friend"], 3), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var sectionK = new KitchenSection(chef);
        var combatScenario = new CombatScenario(20, section0, section1, section2, sectionK, foodMenu);
        return new CombatController(combatScenario);
    }

    playerTurn() {
        const me = this;
        var allDone = true;
        for(var i = 0; i < this.combatScenario.sections.length; i++) {
            const pc = this.combatScenario.sections[i].playerCharacter;
            if(pc.hasActed == false) {
                allDone = false;
                const sec = this.combatScenario.sections[i];
                pc.graphics.onClick = function() {
                    graphicsController.camera.gotoEntity(pc.graphics, 500, Ease.outQuad);
                    clearCombatOptionDivs();
                    gameDiv.append(getCombatOptionDiv(me.combatScenario.foodMenu, pc, sec, me.combatScenario, me));
                }
            }
        }

        if(allDone) {
            console.log("it should be the enemies turn now");
            this.combatLoop(false);
        }
    }

    combatLoop(isPlayersTurn) {
        if(isPlayersTurn) {
            for(var i = 0; i < this.combatScenario.sections.length; i++) {
                this.combatScenario.sections[i].playerCharacter.hasActed = false;
                for(var j = 0; j < this.combatScenario.sections[i].enemies.length; j++) {
                    this.combatScenario.sections[i].enemies[j].hasActed = false;
                }
            }
            this.playerTurn();
        } else {
            this.enemyTurn();
        }
    }

    enemyTurn() {
        console.log("ENEMIES DONT DO ANYTHING YET");
        this.turnsElapsed++;
        this.combatLoop(true);
    }
}

//OK SO I NEED TO
//MAKE THE FOOD MENU
//HANDLE ENEMIES WALKING IN AND OUT
//UHHH PLAYER HP?
//

class CombatScenario {
    constructor(rounds, section0, section1, section2, sectionK, foodMenu) {
        this.rounds = rounds;
        this.section0 = section0;
        this.section1 = section1;
        this.section2 = section2;
        this.sectionK = sectionK;
        this.foodMenu = foodMenu;
        this.sections = [
            this.section0,
            this.section1,
            this.section2,
            this.sectionK
        ];
    }

    draw(entities = []) {
        entities = this.section0.draw(1/6, entities);
        entities = this.section1.draw(3/6, entities);
        entities = this.section2.draw(5/6, entities);
        entities = this.sectionK.draw(3/6, entities);
        return entities;
    }

    removeOnClicks() {
        for(var i = 0; i < this.sections.length; i++) {
            this.sections[i].removeOnClicks();
        }
    }
}

class CombatSection {
    constructor(playerCharacter, enemies = []) {
        this.playerCharacter = playerCharacter;
        this.enemies = enemies;
    }

    draw(offsetX, entities = []) {
        entities.push(this.playerCharacter);
        this.playerCharacter.graphics.goto(offsetX, 0.7);
        console.log(""+ this.playerCharacter.graphics.x + ", " + this.playerCharacter.graphics.y);

        var yIncrement = 1 / this.enemies.length;
        for(var i = 0; i < this.enemies.length; i++) {
            var y = 0.5 * ((i + 1) * yIncrement);
            var x = offsetX + (0.5 - i % 2) * 1/6;
            this.enemies[i].graphics.goto(x, y);
            console.log(""+ this.enemies[i].graphics.x + ", " + this.enemies[i].graphics.y);
            entities.push(this.enemies[i]);
        }

        return entities;
    }

    removeOnClicks() {
        this.playerCharacter.graphics.onClick = null;
        for(var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].graphics.onClick = null;
        }
    }
}

class KitchenSection {
    constructor(playerCharacter) {
        this.playerCharacter = playerCharacter;
        this.enemies = [];
    }

    draw(offsetX, entities = []) {
        entities.push(this.playerCharacter);
        this.playerCharacter.graphics.goto(offsetX, 0.9);

        return entities;
    }

    removeOnClicks() {
        this.playerCharacter.graphics.onClick = null;
    }
}

var combatOptionDiv = null;
function getCombatOptionDiv(menu, player, section, combatScenario, combatController) {
    combatOptionDiv = document.createElement('div');
    combatOptionDiv.className = "combatOptionsDiv";
    combatOptionDiv.id = "combatOptionsDiv";
    const sec = section;
    const pc = player;
    const scen = combatScenario;
    const cont = combatController;
    for(var i = 0; i < menu.length; i++) {
        const thisOption = menu[i];
        if(thisOption.type == pc.proficiency || thisOption.type == 0) {
            var option = document.createElement('button');
            option.className = "combatOptionButton";
            option.textContent = menu[i].name;
            option.onclick = function() {
                scen.removeOnClicks();
                var targ = getAllowedTargets(thisOption, sec, scen);
                buildTargets(thisOption, pc, targ, scen, cont);
            }
            combatOptionDiv.append(option);
        }
    }

    return combatOptionDiv;
}

function getAllowedTargets(food, section, combatScenario) {
    var ret = [];
    if(food.type != 4) {
        return section.enemies;
    } else {
        for(var i = 0; i < combatScenario.sections.length; i++) {
            ret.push(combatScenario.sections[i].playerCharacter);
        }
    }
    return ret;
}

function clearCombatOptionDivs() {
    var div = document.getElementById("combatOptionsDiv");
    if(div != null) {
        gameDiv.removeChild(div);
    }
    
}

function buildTargets(food, playerChar, targets, combatScenario, combatController) {
    var x = 0;
    var y = 0;
    const myFood = food;
    const pc = playerChar;
    const scen = combatScenario;
    const cont = combatController;
    for(var i = 0; i < targets.length; i++) {
        const targ = targets[i];
        x += targ.graphics.x;
        y += targ.graphics.y;
        targ.graphics.onClick = function() {
            for(var event in myFood.events) {
                ACTION_EVENTS[event](pc, targ, myFood.events[event]);
                scen.removeOnClicks();
                clearCombatOptionDivs();
                pc.hasActed = true;
                graphicsController.camera.goto(0.5, 0.5, 500, Ease.outQuad);
                cont.playerTurn();
            }
        }
    }
    x = x / targets.length;
    y = y / targets.length;

    graphicsController.camera.goto(x, y, 500, Ease.outQuad);
}
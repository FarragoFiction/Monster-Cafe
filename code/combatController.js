import { graphicsController, gameDiv, pause } from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";
import { DialogueController } from "./dialogueController.js";
import { PartyMember, CustomerMember } from "./combatParticipants.js";
import { ACTION_EVENTS, TEST_ACTIONS, makeUIButton, Action, ACTION_TYPES} from "./combat/action.js";
import { DEF_DIMENSIONS } from "./graphics/graphics.js";
import { GraphicsEntity } from "./graphics/graphicsEntity.js";

//TODO haha remember when i said i was going to focus on making this not a tangled mess?
//refactoring this code is on the block.

const COMBAT_BG = "overhead";

const MENU_COORDS = {
    x: 0.8 * DEF_DIMENSIONS.width,
    y: 0.1 * DEF_DIMENSIONS.height
};

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
        var chef = new PartyMember(ENTITIES["goth"], 4);

        var foodMenu = [TEST_ACTIONS.hug, TEST_ACTIONS.juice, TEST_ACTIONS.soup, TEST_ACTIONS.steak];

        var section0 = new CombatSection(new PartyMember(ENTITIES["goth"], 1), [new CustomerMember(ENTITIES["friend"])]);
        var section1 = new CombatSection(new PartyMember(ENTITIES["goth"], 2), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var section2 = new CombatSection(new PartyMember(ENTITIES["goth"], 3), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var sectionK = new KitchenSection(chef);
        var combatScenario = new CombatScenario(20, section0, section1, section2, sectionK, foodMenu);
        return new CombatController(combatScenario);
    }

    playerTurn() {
        const me = this;
        var allDone = true;
        for (var i = 0; i < this.combatScenario.sections.length; i++) {
            const pc = this.combatScenario.sections[i].playerCharacter;
            if (pc.hasActed == false) {
                allDone = false;
                const sec = this.combatScenario.sections[i];
                pc.graphics.onClick = function () {
                    graphicsController.camera.gotoEntity(pc.graphics, 500, Ease.outQuad);
                    clearCombatOptionDivs();
                    gameDiv.append(getCombatOptionDiv(me.combatScenario.foodMenu, pc, sec, me.combatScenario, me));
                }
            }
        }

        if (allDone) {
            console.log("it should be the enemies turn now");
            this.combatLoop(false);
        }
    }

    combatLoop(isPlayersTurn) {
        if (isPlayersTurn) {
            for (var i = 0; i < this.combatScenario.sections.length; i++) {
                this.combatScenario.sections[i].playerCharacter.hasActed = false;
                for (var j = 0; j < this.combatScenario.sections[i].enemies.length; j++) {
                    if (this.combatScenario.sections[i].enemies[j] != null)
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

    
    clearFinishedParticipants() {
        var redraw = false;
        for (var i = 0; i < this.combatScenario.sections.length; i++) {
            var sec = this.combatScenario.sections[i];
            if (sec.playerCharacter.health <= 0) {
                //TODO player down
                redraw = true;
            }
            for (var j = 0; j < sec.enemies.length; j++) {
                var en = sec.enemies[j];
                if (en != null && en.health <= 0) {
                    //TODO enemy defeated
                    sec.enemies[j] = null;
                    redraw = true;
                }
            }
        }

        if (redraw) {
            this.draw();
        }
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
        entities = this.section0.draw(1 / 6, entities);
        entities = this.section1.draw(3 / 6, entities);
        entities = this.section2.draw(5 / 6, entities);
        entities = this.sectionK.draw(3 / 6, entities);
        return entities;
    }

    removeOnClicks() {
        for (var i = 0; i < this.sections.length; i++) {
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
        this.playerCharacter.graphics.goto(offsetX * DEF_DIMENSIONS.width, 0.7 * DEF_DIMENSIONS.height);
        console.log("" + this.playerCharacter.graphics.x + ", " + this.playerCharacter.graphics.y);

        var yIncrement = 1 / this.enemies.length || -1;
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] != null) {
                var y = 0.5 * ((i + 1) * yIncrement) * DEF_DIMENSIONS.height;
                var x = (offsetX + (0.5 - i % 2) * 1 / 6) * DEF_DIMENSIONS.width;
                this.enemies[i].graphics.goto(x, y);
                console.log("" + this.enemies[i].graphics.x + ", " + this.enemies[i].graphics.y);
                entities.push(this.enemies[i]);
            }
        }

        return entities;
    }

    removeOnClicks() {
        this.playerCharacter.graphics.onClick = null;
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] != null)
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
        this.playerCharacter.graphics.goto(offsetX * DEF_DIMENSIONS.width, 0.9 * DEF_DIMENSIONS.height);

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
    graphicsController.moveElement(combatOptionDiv, MENU_COORDS.x, MENU_COORDS.y);
    //combatOptionDiv.style.transform = "rotate(45deg)";

    var header = document.createElement('h3');
    header.textContent = "MENU";
    combatOptionDiv.append(header);
    combatOptionDiv.append(document.createElement("br"));
    
    const sec = section;
    const pc = player;
    const scen = combatScenario;
    const cont = combatController;
    for (var i = 0; i < menu.length; i++) {
        const thisOption = menu[i];
        if (thisOption.type == pc.proficiency || thisOption.type == 0) {
            var option = makeUIButton(thisOption);
            option.onclick = function () {
                scen.removeOnClicks();
                var targ = getAllowedTargets(thisOption, sec, scen);
                buildTargets(thisOption, pc, targ, scen, cont);
            }
            combatOptionDiv.append(option);
            combatOptionDiv.append(document.createElement("br"));
        }
    }

    //skip button too!
    var skip = makeUIButton(new Action("skip", ACTION_TYPES.NONE, { }, "do nothing."),)
    skip.onclick = function () {
        //todo skip
        scen.removeOnClicks();
        pc.hasActed = true;
        clearCombatOptionDivs();
        graphicsController.camera.goto(0.5 * DEF_DIMENSIONS.width, 0.5 * DEF_DIMENSIONS.height, 500, Ease.outQuad);
        cont.playerTurn();  
    } 
    combatOptionDiv.append(skip);

    return combatOptionDiv;
}

function getAllowedTargets(food, section, combatScenario) {
    var ret = [];
    if (food.type != 4) {
        return section.enemies;
    } else {
        for (var i = 0; i < combatScenario.sections.length; i++) {
            ret.push(combatScenario.sections[i].playerCharacter);
        }
    }
    return ret;
}

function clearCombatOptionDivs() {
    var div = document.getElementById("combatOptionsDiv");
    if (div != null) {
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
    for (var i = 0; i < targets.length; i++) {
        const targ = targets[i];
        if (targ != null) {
            x += targ.graphics.x;
            y += targ.graphics.y;
            targ.graphics.onClick = function () {
                for (var event in myFood.events) {
                    var ret = ACTION_EVENTS[event](pc, targ, myFood.events[event]);
                    scen.removeOnClicks();
                    clearCombatOptionDivs();
                    pc.hasActed = true;
                    graphicsController.camera.goto(0.5 * DEF_DIMENSIONS.width, 0.5 * DEF_DIMENSIONS.height, 500, Ease.outQuad);

                    var damageDiv = document.createElement('div');
                    damageDiv.className = "damageDiv";
                    damageDiv.id = "damageDiv";
                    damageDiv.textContent = ret;

                    graphicsController.moveElement(damageDiv, targ.graphics.x, targ.graphics.y);
                    gameDiv.appendChild(damageDiv);

                    setTimeout(function () {
                        gameDiv.removeChild(damageDiv);
                    }, 5000);

                    cont.clearFinishedParticipants();


                    cont.playerTurn();
                }
            }
        }
    }
    x = x / targets.length;
    y = y / targets.length;

    graphicsController.camera.goto(x, y, 500, Ease.outQuad);
}

function gameOver() {
    //TODO implement me 
}

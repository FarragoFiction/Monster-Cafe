import { graphicsController, gameDiv, pause } from "./main.js";
import { ENTITIES } from './entity.js';
import { Ease } from "./graphics/easing.js";
import { DialogueController } from "./dialogueController.js";
import { PartyMember, CustomerMember, ENEMIES, PARTYMEMBERS} from "./combatParticipants.js";
import { ACTION_EVENTS, ACTIONS, makeUIButton, Action, ACTION_TYPES } from "./combat/action.js";
import { DEF_DIMENSIONS } from "./graphics/graphics.js";
import { GraphicsEntity } from "./graphics/graphicsEntity.js";

//TODO haha remember when i said i was going to focus on making this not a tangled mess?
//refactoring this code is on the block.

const COMBAT_BG = "overhead";

const COMBAT_PATH = "./data/combat.json"

const SECTION_CAPACITY = 3;

const MENU_COORDS = {
    x: 0.8 * DEF_DIMENSIONS.width,
    y: 0.1 * DEF_DIMENSIONS.height
};

export var COMBAT_SCENARIOS = {};

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
        var foodMenu = [ACTIONS.hug, ACTIONS.juice, ACTIONS.soup, ACTIONS.steak, ACTIONS.mondae];
        /*
        var section0 = new CombatSection(new PartyMember(PARTYMEMBERS["spoonGuy"]), [new CustomerMember(ENEMIES["rock"])]);
        var section1 = new CombatSection(new PartyMember(PARTYMEMBERS["goth"]), [new CustomerMember(ENEMIES["paper"]), new CustomerMember(ENEMIES["scissors"])]);
        var section2 = new CombatSection(new PartyMember(PARTYMEMBERS["forkGuy"]), [new CustomerMember(ENEMIES["rock"]), new CustomerMember(ENEMIES["paper"]), new CustomerMember(ENEMIES["scissors"])]);
        var sectionK = new KitchenSection(new PartyMember(PARTYMEMBERS["knifeGuy"]));
        
        var rates = new SpawnRate(0.5, [{ enemy: ENEMIES["rock"], value: 1 }, { enemy: ENEMIES["paper"], value: 0.5 }, { enemy: ENEMIES["scissors"], value: 0.5 }]);
        
        var combatScenario = new CombatScenario(5, section0, section1, section2, sectionK, foodMenu, rates);
        return new CombatController(combatScenario);*/

        var combatScenario = COMBAT_SCENARIOS["example"];
        combatScenario.foodMenu = foodMenu;
        combatScenario.section0.playerCharacter = new PartyMember(PARTYMEMBERS["spoonGuy"]);
        combatScenario.section1.playerCharacter = new PartyMember(PARTYMEMBERS["goth"]);
        combatScenario.section2.playerCharacter = new PartyMember(PARTYMEMBERS["forkGuy"]);
        combatScenario.sectionK.playerCharacter = new PartyMember(PARTYMEMBERS["knifeGuy"]);

        return new CombatController(combatScenario);
    }

    playerTurn() {
        var gameTimer = null;
        clearGameTimer();
        gameTimer = document.createElement('h3');
        gameTimer.id = "gameTimer";
        gameTimer.textContent = "" + this.turnsElapsed + " / " + this.combatScenario.rounds;
        gameDiv.append(gameTimer);

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
            }
            this.playerTurn();
        } else {
            var stillStanding = false;
            for (var i = 0; i < this.combatScenario.sections.length; i++) {
                for (var j = 0; j < this.combatScenario.sections[i].enemies.length; j++) {
                    if (this.combatScenario.sections[i].enemies[j] != null) {
                        stillStanding = true;
                        this.combatScenario.sections[i].enemies[j].hasActed = false;
                    }
                }
            }
            if (stillStanding || this.turnsElapsed <= this.combatScenario.rounds) {
                this.enemyTurn();
            } else {
                console.log("GAME OVER YOU WIN AND SHIT");
                //TODO GAME END STUFF
            }
        }
    }

    enemyTurn() {
        console.log("ENEMIES DONT DO ANYTHING YET");

        if (this.turnsElapsed <= this.combatScenario.rounds) {
            this.runSpawnCheck();
        }
        this.turnsElapsed++;
        this.combatLoop(true);
    }

    runSpawnCheck() {
        for (var i = 0; i < this.combatScenario.sections.length; i++) {
            var sec = this.combatScenario.sections[i];
            for (var j = 0; j < sec.enemies.length; j++) {
                if (sec.enemies[j] == null && this.combatScenario.spawnRates.checkIfSpawning()) {
                    //spawning a new enemy
                    console.log("SPAWN");
                    sec.enemies[j] = this.combatScenario.spawnRates.spawn();
                } else {
                    console.log("NOSPAWN");
                }
            }
        }
        this.draw();
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

export class CombatScenario {
    constructor(rounds, section0, section1, section2, sectionK, foodMenu, spawnRates) {
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
        this.spawnRates = spawnRates;
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

    static parse(callback) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            COMBAT_SCENARIOS = JSON.parse(this.responseText);
            for (var i in COMBAT_SCENARIOS) {
                var scen = COMBAT_SCENARIOS[i];
                //get the enemies properly
                scen.section0 = new CombatSection(null, makeEnemiesReal(scen.section0.enemies));
                scen.section1 = new CombatSection(null, makeEnemiesReal(scen.section1.enemies));
                scen.section2 = new CombatSection(null, makeEnemiesReal(scen.section2.enemies));
                scen.sectionK = new KitchenSection(null);

                //make spawn rates
                for(var j = 0; j < scen.spawnRates.rates.length; j++) {
                    scen.spawnRates.rates[j].enemy = ENEMIES[scen.spawnRates.rates[j].enemy];
                }
                scen.spawnRates = new SpawnRate(scen.spawnRates.baseChance, scen.spawnRates.rates);

                //anddd put it all together
                COMBAT_SCENARIOS[i] = new CombatScenario(scen.rounds, scen.section0, scen.section1, scen.section2, scen.sectionK, null, scen.spawnRates);
            }
            callback();
        }
        xmlhttp.open("GET", COMBAT_PATH);
        xmlhttp.send();
        
    }
}

//take an array of enemy names and return an array of clones of those enemies
function makeEnemiesReal(arr) {
    var ret = [];
    for(var i = 0; i < arr.length; i++) {
        ret.push(new CustomerMember(ENEMIES[arr[i]]));
    }
    return ret;
}

class CombatSection {
    constructor(playerCharacter, enemies = [], capacity = SECTION_CAPACITY) {
        this.playerCharacter = playerCharacter;
        this.enemies = enemies;
        this.capacity = capacity;

        while (this.enemies.length < this.capacity) {
            this.enemies.push(null);
        }
    }

    draw(offsetX, entities = []) {
        entities.push(this.playerCharacter);
        this.playerCharacter.graphics.goto(offsetX * DEF_DIMENSIONS.width, 0.7 * DEF_DIMENSIONS.height);
        //console.log("" + this.playerCharacter.graphics.x + ", " + this.playerCharacter.graphics.y);

        var yIncrement = 1 / this.capacity || -1;
        for (var i = 0; i < this.capacity; i++) {
            if (this.enemies[i] != null) {
                var y = 0.5 * ((i + 1) * yIncrement) * DEF_DIMENSIONS.height;
                var x = (offsetX + (0.5 - i % 2) * 1 / 6) * DEF_DIMENSIONS.width;
                this.enemies[i].graphics.goto(x, y);
                //console.log("" + this.enemies[i].graphics.x + ", " + this.enemies[i].graphics.y);
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

    var header = document.createElement('h2');
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
                buildTargets(thisOption, pc, targ, scen, cont, sec);
            }
            combatOptionDiv.append(option);
            combatOptionDiv.append(document.createElement("br"));
        }
    }

    //skip button too!
    var skip = makeUIButton(new Action("skip", ACTION_TYPES.NONE, {}, "Do nothing.", 0));
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

function clearGameTimer() {
    var div = document.getElementById("gameTimer");
    if (div != null) {
        gameDiv.removeChild(div);
    }

}

function buildTargets(food, playerChar, targets, combatScenario, combatController, combatSection) {
    var x = 0;
    var y = 0;
    const myFood = food;
    const pc = playerChar;
    const scen = combatScenario;
    const cont = combatController;
    const sec = combatSection;
    var count = 0;
    for (var i = 0; i < targets.length; i++) {
        const targ = targets[i];
        if (targ != null) {
            count++;
            x += targ.graphics.x;
            y += targ.graphics.y;
            targ.graphics.onClick = function () {
                for (var event in myFood.events) {
                    var value;
                    if (myFood.events[event] == null) {
                        value = myFood.value;
                    } else {
                        value = myFood.events[event];
                    }
                    var ret = ACTION_EVENTS[event](pc, targ, value, myFood.type, sec);
                    scen.removeOnClicks();
                    clearCombatOptionDivs();
                    pc.hasActed = true;
                    graphicsController.camera.goto(0.5 * DEF_DIMENSIONS.width, 0.5 * DEF_DIMENSIONS.height, 500, Ease.outQuad);

                    for (var j = 0; j < ret.length; j++) {
                        var damageDiv = document.createElement('div');
                        damageDiv.className = "damageDiv";
                        damageDiv.id = "damageDiv";
                        damageDiv.textContent = ret[j].value;

                        graphicsController.moveElement(damageDiv, ret[j].ent.graphics.x, ret[j].ent.graphics.y);
                        
                        const myDam = damageDiv;
                        gameDiv.appendChild(myDam);

                        setTimeout(function () {
                            gameDiv.removeChild(myDam);
                        }, 5000);
                    }

                    cont.clearFinishedParticipants();


                    cont.playerTurn();
                }
            }
        }
    }
    if (count != 0) {
        x = x / count;
        y = y / count;
    }
    console.log("Camera To: (" + x + ", " + y + ")");
    graphicsController.camera.goto(x, y, 500, Ease.outQuad);
}

/*
    alright, so some stuff i need to add to the combat loop.
    -sections need to have set capacities of how many enemies can enter them
    -weighted random enemy spawning from a list
    -combat ends when all enemies are gone and the turn timer is at 0.
*/

class SpawnRate {
    constructor(baseChance = 0.5, rates) {
        this.baseChance = baseChance;
        this.rates = rates;
    }

    checkIfSpawning() {
        if (Math.random() >= this.baseChance) {
            return true;
        }
        return false;
    }

    spawn() {
        var max = 0;
        var rand = Math.random();
        for (var i = 0; i < this.rates.length; i++) {
            max += this.rates[i].value;
        }
        rand *= max;

        for (var i = 0; i < this.rates.length; i++) {
            if (rand <= this.rates[i].value) {
                console.log("OK FOUND SOMETHING TO SPAWN");
                return new CustomerMember(this.rates[i].enemy);
            } else {
                rand -= this.rates[i].value;
            }
        }
    }
}

/*
    -clean up the UI (damage output, turn counter)
    -add enemy AI (it can be shitty as balls but they gotta do something)
    -end combat loop and go to the gacha game
*/
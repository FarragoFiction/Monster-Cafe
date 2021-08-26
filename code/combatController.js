import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { DialogueController } from "./dialogueController.js";
import { PartyMember, CustomerMember } from "./combatParticipants.js";

const COMBAT_BG = "overhead";

export class CombatController {
    constructor(combatScenario) {
        this.combatScenario = combatScenario;
    }

    draw() {
        var entities = [ENTITIES[COMBAT_BG]]; //im being lazy - combat participants aren't entities, but they have a "graphics" module just like them. If this causes problems for future me, you're welcome to throw hands at the back of a dennys.

        entities = this.combatScenario.draw(entities)
        graphicsController.entities = entities;
    }

    static makeTestScenario() {
        var chef = new PartyMember(ENTITIES["friend"], 1);
        
        var foodMenu = ["fuck"];

        var section0 = new CombatSection(new PartyMember(ENTITIES["friend"], 0), [new CustomerMember(ENTITIES["friend"])]);
        var section1 = new CombatSection(new PartyMember(ENTITIES["friend"], 0), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var section2 = new CombatSection(new PartyMember(ENTITIES["friend"], 0), [new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"]), new CustomerMember(ENTITIES["friend"])]);
        var sectionK = new KitchenSection(chef);
        var combatScenario = new CombatScenario(20, section0, section1, section2, sectionK, foodMenu);
        return new CombatController(combatScenario);
    }

    playerTurn() {
        const me = this;
        for(var i = 0; i < this.combatScenario.sections.length; i++) {
            console.log("hi");
            this.combatScenario.sections[i].playerCharacter.graphics.onClick = function() {
                console.log("food menu: " + me.combatScenario.foodMenu);
            }
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
        entities = this.section0.draw(1/6, entities);
        entities = this.section1.draw(3/6, entities);
        entities = this.section2.draw(5/6, entities);
        entities = this.sectionK.draw(3/6, entities);
        return entities;
    }
}

class CombatSection {
    constructor(playerCharacter, enemies = {}) {
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
}

class KitchenSection {
    constructor(playerCharacter) {
        this.playerCharacter = playerCharacter;
    }

    draw(offsetX, entities = []) {
        entities.push(this.playerCharacter);
        this.playerCharacter.graphics.goto(offsetX, 0.9);

        return entities;
    }
}


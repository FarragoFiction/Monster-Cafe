import { graphicsController, gameDiv, pause} from "./main.js";
import { ENTITIES } from './entity.js';
import { DialogueController } from "./dialogueController.js";

export class CombatController {

}

//OK SO I NEED TO
//MAKE THE FOOD MENU
//HANDLE ENEMIES WALKING IN AND OUT
//UHHH PLAYER HP?
//

class CombatScenario {
    constructor() {
        
    }
}

class CombatSection {
    constructor(server, enemies = {}) {
        this.server = server;
        this.enemies = enemies;
    }
}
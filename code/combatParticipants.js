import { GraphicsEntity } from "./graphics/graphicsEntity.js";
import { ENTITIES } from './entity.js';

export var ENEMIES = {};

export const JOBS = {
    SERVER: 0,
    CHEF: 1
};

const ENEMY_PATH = "./data/enemies.json";

//TODO use inheritance please
export class PartyMember {
    constructor(entity, proficiency) {
        this.entity = entity;
        this.health = 100; //player HP
        this.proficiency = proficiency;
        this.hasActed = false; //tracks if they've performed an action this turn

        //lets make a new graphics entity for this
        this.graphics = GraphicsEntity.clone(entity.graphics);

        this.section = null;
    }
}

export class CustomerMember {
    constructor(template) {
        this.template = template;
        this.health = template.maxHP; //customer HP
        this.hasActed = false; //tracks if they've performed an action this turn

        //lets make a new graphics entity for this
        this.graphics = GraphicsEntity.clone(template.graphics);

        //todo implement this in the constructor somehow.
        this.weaknesses = template.weaknesses;

        this.section = null;
    }

    static parse(callback) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            ENEMIES = JSON.parse(this.responseText);
            for (var enemy in ENEMIES) {
                ENEMIES[enemy].graphics = ENTITIES[ENEMIES[enemy].graphics].graphics;
            }
            callback();
        }
        xmlhttp.open("GET", ENEMY_PATH);
        xmlhttp.send();
        
    }
}
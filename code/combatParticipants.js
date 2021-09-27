import { GraphicsEntity } from "./graphics/graphicsEntity.js";

export const JOBS = {
    SERVER: 0,
    CHEF: 1
};


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
    constructor(entity) {
        this.entity = entity;
        this.health = 100; //customer HP
        this.hasActed = false; //tracks if they've performed an action this turn

        //lets make a new graphics entity for this
        this.graphics = GraphicsEntity.clone(entity.graphics);

        //todo implement this in the constructor somehow.
        this.weaknesses = {
            0: 1,
            1: 1,
            2: 1,
            3: 1,
            4: 1
        };

        this.section = null;
    }
}
import { GraphicsEntity } from "./graphics/graphicsEntity.js";

export const JOBS = {
    SERVER: 0,
    CHEF: 1
};

export class PartyMember {
    constructor(entity, proficiency) {
        this.entity = entity;
        this.health = 100; //player HP
        this.proficiency = proficiency;
        this.hasActed = false; //tracks if they've performed an action this turn

        //lets make a new graphics entity for this
        this.graphics = GraphicsEntity.clone(entity.graphics);
    }
}

export class CustomerMember {
    constructor(entity) {
        this.entity = entity;
        this.health = 100; //customer HP
        this.hasActed = false; //tracks if they've performed an action this turn

        //lets make a new graphics entity for this
        this.graphics = GraphicsEntity.clone(entity.graphics);
    }
}
import { GraphicsEntity } from "./graphics/graphicsEntity.js";

export const JOBS = {
    SERVER: 0,
    CHEF: 1
};

export class PartyMember {
    constructor(entity, job) {
        this.entity = entity;
        this.stress = 0; //player HP
        this.job = job;

        //lets make a new graphics entity for this
        this.graphicsEntity = Object.assign({}, entity.graphicsEntity);
    }
}

export class CustomerMember {
    constructor(entity, job) {
        this.entity = entity;
        this.satisfaction = 0; //customer HP

        //lets make a new graphics entity for this
        this.graphicsEntity = Object.assign({}, entity.graphicsEntity);
    }
}
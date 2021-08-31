export const ACTION_TYPES = {
    NONE: 0,
    SPOON: 1,
    FORK: 2,
    CUP: 3,
    KNIFE: 4
};

export const ACTION_EVENTS = {
    attack(instigator, target, damage) {
        target.health -= damage;
        console.log("OK TAKING DAMAGE NOW");
    },
    
    heal(instigator, target, value) {
        target.health += value;
    }
};

export class Action {
    constructor(name, type, events) {
        this.name = name;
        this.type = type;
        this.events = events;
    }
};

export const TEST_ACTIONS = {
    soup: new Action("test soup", ACTION_TYPES.SPOON, { attack: 40, }),
    steak: new Action("test steak", ACTION_TYPES.FORK, { attack: 40, }),
    juice: new Action("test juice", ACTION_TYPES.CUP, { attack: 40, }),
    hug: new Action("test hug", ACTION_TYPES.KNIFE, { heal: 40, }),
};

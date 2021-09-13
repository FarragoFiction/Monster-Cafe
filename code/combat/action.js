export const ACTION_TYPES = {
    NONE: 0,
    SPOON: 1,
    FORK: 2,
    CUP: 3,
    KNIFE: 4
};

export function makeUIButton(action) {
    var option = document.createElement('button');
    option.className = "combatOptionButton";
    
    var name = document.createElement('h3');
    name.textContent = action.name;

    var desc = document.createElement('span');
    desc.textContent = "" + action.stamina + " - ";
    
    var flavor = document.createElement("i");
    flavor.textContent = action.description;

    desc.append(flavor);


    option.appendChild(name);
    option.appendChild(desc);
    option.append(document.createElement('br'));

    return option;
}

export const ACTION_EVENTS = {
    attack(instigator, target, damage) {
        target.health -= damage;
        console.log("OK TAKING DAMAGE NOW");
        return damage;
    },
    
    heal(instigator, target, value) {
        target.health += value;
        return value;
    }
};

export class Action {
    constructor(name, type, events, description) {
        this.name = name;
        this.type = type;
        this.events = events;
        this.description = description;
        this.stamina = 40;

    }

};

export const TEST_ACTIONS = {
    soup: new Action("test soup", ACTION_TYPES.SPOON, { attack: 1000, }, "a soup that tastes like static."),
    steak: new Action("test steak", ACTION_TYPES.FORK, { attack: 1000, }, "a steak that tastes like static."),
    juice: new Action("test juice", ACTION_TYPES.CUP, { attack:4000, }, "a juice that tastes like static."),
    hug: new Action("test hug", ACTION_TYPES.KNIFE, { heal: 40, }, "a hug that tastes like static."),
};
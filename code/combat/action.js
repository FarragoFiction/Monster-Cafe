const ACTION_PATH = "../data/foods.json";

export const ACTION_TYPES = {
    NONE: 0,
    SPOON: 1,
    FORK: 2,
    CUP: 3,
    KNIFE: 4
};

export const ACTION_TYPE_NAMES = ["None", "Spoon", "Fork", "Cup", "Knife"];

export var ACTIONS = {};

// how much of an attack's damage is random.
const FUZZINESS = 0.2;

export function makeUIButton(action) {
    var option = document.createElement('button');
    option.className = "combatOptionButton";
    
    var name = document.createElement('h3');
    name.textContent = action.name;

    var desc = document.createElement('span');
    desc.textContent = "" + action.value + " - ";
    
    var flavor = document.createElement("i");
    flavor.textContent = action.description;

    desc.append(flavor);


    option.appendChild(name);
    option.appendChild(desc);
    option.append(document.createElement('br'));

    return option;
}

export const ACTION_EVENTS = {
    attack(instigator, target, value, type, section) {

        var damage = value * (1 - FUZZINESS + Math.random() * FUZZINESS * 2) * target.weaknesses[type];
        
        
        target.health -= damage;
        console.log("OK TAKING DAMAGE NOW");
        return [{
            ent: target,
            value: damage
        }];
    },
    
    heal(instigator, target, value, type, section) {
        target.health += value;
        return [{
            ent: target,
            value: value
        }];
    },

    //AOE babyyy
    attackSection(instigator, target, value, type, section) {
        var ret = [];
        for(var i = 0; i < section.enemies.length; i++) {
            if(section.enemies[i] != null) {
                const damage = value * (1 - FUZZINESS + Math.random() * FUZZINESS * 2) * section.enemies[i].weaknesses[type];
                section.enemies[i].health -= damage;
                ret.push({
                    ent: section.enemies[i],
                    value: damage
                });
            }
        }
        return ret;
    }

};

export class Action {
    constructor(name, type, events, description, value) {
        this.name = name;
        this.type = type;
        this.events = events;
        this.description = description;
        this.value = value;

    }

    static parse(callback) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            ACTIONS = JSON.parse(this.responseText);
            //console.log(ACTIONS);
            for (var act in ACTIONS) {
                ACTIONS[act].type = ACTION_TYPES[(ACTIONS[act].type).toUpperCase()];
            }
            callback();
        }
        xmlhttp.open("GET", ACTION_PATH);
        xmlhttp.send();
        
    }

};

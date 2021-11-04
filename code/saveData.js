import { ACTIONS } from "./combat/action.js";
import { PARTYMEMBERS } from "./combatParticipants.js";

const START_PROGRESS = 0;
const START_ACTIONS = [
    ACTIONS.soup,
    ACTIONS.steak,
    ACTIONS.juice,
    ACTIONS.hug
];

const START_PARTY = [
    PARTYMEMBERS["spoonGuy"],
    PARTYMEMBERS["knifeGuy"],
    PARTYMEMBERS["forkGuy"],
    PARTYMEMBERS["goth"],
]

export class SaveData {
    constructor() {
        this.progress = 0;
        this.availableActions = START_ACTIONS;
        this.availableCharacters = START_PARTY;
    }
}
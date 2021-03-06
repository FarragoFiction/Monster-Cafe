import { GraphicsController } from './graphics/graphics.js';
import { StartMenuController } from './startMenuController.js';
import { CombatScenario } from './combatController.js';
import { Action } from './combat/action.js';
import { Entity } from './entity.js';
import { CustomerMember, PartyMember } from './combatParticipants.js';

const GAME_STATES = {
    MainMenu: 'MainMenu',
    Dialogue: 'Dialogue'
};

var gameState = GAME_STATES.MainMenu;
const MS_PER_UPDATE = 16.6666666;

export var paused = false;

export var graphicsController;
export var startMenuController;

export var canvas = document.getElementById('gameCanvas');
export var gameDiv = document.getElementById('game');

var lastTime = new Date().getTime();
var lag = 0.0
9
function init() {    
    graphicsController = new GraphicsController(canvas);
    startMenuController = new StartMenuController();
    startMenuController.begin();
    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {

    var current = new Date().getTime();
    var elapsed = current - lastTime;
    lag += elapsed;

    processInput();

    while (lag >= MS_PER_UPDATE) {
        if(!paused) {
            update(MS_PER_UPDATE);
        }
        lag -= MS_PER_UPDATE;
    }

    render(lag / MS_PER_UPDATE);

    lastTime = current;
    window.requestAnimationFrame(gameLoop);

    
}

function processInput() {

}

function update(time) {
    graphicsController.update(time);
}

function render(time) {
    graphicsController.render();
}

export function pause() {
    if(paused) paused = false;
    else paused = true;
}

window.onload = function() {
    Entity.loadAllEntities( function() {
        Action.parse( function() {
            CustomerMember.parse( function() { 
                PartyMember.parse( function() {
                    CombatScenario.parse(init)
                })
            })
        })
    });
};
//import  "dialogueController.js";

const GAME_STATES = {
    MainMenu: 'MainMenu',
    Dialogue: 'Dialogue',
} 

var gameState = GAMESTATES.Dialogue;
const MS_PER_UPDATE = 16.6666666;

function gameLoop() {
    var lastTime = new Date().getTime();
    var lag = 0.0;

    while(true) {
        var current = new Date().getTime();
        var elapsed = current = lastTime;
        lag += elapsed;

        processInput();

        while(lag >= MS_PER_UPDATE) {
            update(MS_PER_UPDATE);
            lag -= MS_PER_UPDATE;
        }
        
        render(lag / MS_PER_UPDATE);
        
        lastTime = current;
    }
}

function processInput() {

}

function update() {

}

function render() {

}


gameLoop();
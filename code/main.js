import { GraphicsController, GraphicsEntity, SpriteAnimation, SpriteFrame } from './graphics/graphics.js';

const GAME_STATES = {
    MainMenu: 'MainMenu',
    Dialogue: 'Dialogue'
};

const IMAGE_SOURCES = {
    background: '../art/background.png',
    friend: '../art/friend.png',
    friend2: '../art/friend2.png'
};

var gameState = GAME_STATES.Dialogue;
const MS_PER_UPDATE = 16.6666666;

var graphicsController;

var canvas = document.getElementById('canvas');

var lastTime = new Date().getTime();
var lag = 0.0;

function init(images) {
    //todo clear all this its debug shit
    var fFrame = new SpriteFrame(images['friend'], 1000);
    var fFrame2 = new SpriteFrame(images['friend2'], 500);
    var fAnim = new SpriteAnimation([fFrame, fFrame2]);
    var fEnt = new GraphicsEntity([fAnim], 0.5, 0.5, 1);

    var bFrame = new SpriteFrame(images['background'], 1000);
    var bAnim = new SpriteAnimation([bFrame]);
    var bEnt = new GraphicsEntity([bAnim], 0, 0, 0);

    var entities = [fEnt, bEnt];
    graphicsController = new GraphicsController(canvas, entities);

    console.log('INITIALIZED');
    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {


    var current = new Date().getTime();
    var elapsed = current - lastTime;
    lag += elapsed;

    processInput();

    while (lag >= MS_PER_UPDATE) {
        console.log(lag);
        update(MS_PER_UPDATE);
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
    console.log('UPDATED');
}

function render(time) {
    graphicsController.render();
    console.log('RENDERED');
}

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for (var src in sources) {
        numImages++;
    }

    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            console.log(`${loadedImages + 1}/${numImages} images loaded`);
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

window.onload = function () {
    loadImages(IMAGE_SOURCES, init);
}

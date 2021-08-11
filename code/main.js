import { GraphicsController, GraphicsEntity, SpriteAnimation, SpriteFrame } from './graphics/graphics.js';
import { StartMenuController } from './startMenuController.js';

const GAME_STATES = {
    MainMenu: 'MainMenu',
    Dialogue: 'Dialogue'
};

var gameState = GAME_STATES.MainMenu;
const MS_PER_UPDATE = 16.6666666;


var graphicsController;

var canvas = document.getElementById('canvas');

var startMenuController = new StartMenuController(canvas);

var lastTime = new Date().getTime();
var lag = 0.0;

var sources = {};
var entities = {};
var gEntities = {};

function init(images) {

    for (var ent in entities) {
        var gAnis = {};
        for (var ani in entities[ent].animations) {
            var gFrames = [];
            for (var frame in entities[ent].animations[ani]) {
                var gFrame = new SpriteFrame(images[entities[ent].animations[ani][frame].src], entities[ent].animations[ani][frame].t);
                gFrames.push(gFrame);
            }
            var gAni = new SpriteAnimation(gFrames);
            gAnis[ani] = gAni;
        }

        var gEnt = new GraphicsEntity(gAnis, entities[ent].x, entities[ent].y, entities[ent].z);
        gEntities[ent] = gEnt;
    }

    graphicsController = new GraphicsController(canvas, gEntities);
    startMenuController.begin();
    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {


    var current = new Date().getTime();
    var elapsed = current - lastTime;
    lag += elapsed;

    processInput();

    while (lag >= MS_PER_UPDATE) {
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
}

function render(time) {
    graphicsController.render();
}

function loadImages(sources, callback) {
    const prefix = '../art/';
    const suffix = '.png';
    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for (var src in sources) {
        numImages++;
    }

    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = prefix + sources[src] + suffix;
    }
}

window.onload = function () {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        entities = JSON.parse(this.responseText);
        for (var ent in entities) {
            for (var ani in entities[ent].animations) {
                for (var frame in entities[ent].animations[ani]) {
                    sources[entities[ent].animations[ani][frame].src] = entities[ent].animations[ani][frame].src;
                }
            }
        }
        loadImages(sources, init);
    }
    xmlhttp.open("GET", "../data/assets.json");
    xmlhttp.send();

}

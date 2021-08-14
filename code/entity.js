import { GraphicsEntity, SpriteAnimation, SpriteFrame } from "./graphics/graphicsEntity.js";

const ASSET_PATH = "../data/assets.json";

export var ENTITIES = {};

export class Entity {
    constructor(graphics) {
        this.graphics = graphics;
    }

    static loadAllEntities(callback) {
        Entity.parse(callback);
    }

    static parse(callback) {
        var sources = {};
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            ENTITIES = JSON.parse(this.responseText);
            for (var ent in ENTITIES) {
                for (var ani in ENTITIES[ent].graphics.animations) {
                    for (var frame in ENTITIES[ent].graphics.animations[ani]) {
                        sources[ENTITIES[ent].graphics.animations[ani][frame].src] = ENTITIES[ent].graphics.animations[ani][frame].src;
                    }
                }
            }
            Entity.loadImages(sources, callback);
        }
        xmlhttp.open("GET", ASSET_PATH);
        xmlhttp.send();
    }

    static loadImages(sources, callback) {
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
                    Entity.assembleGraphics(images, callback);
                }
            };
            images[src].src = prefix + sources[src] + suffix;
        }
    }

    static assembleGraphics(images, callback) {
        for (var ent in ENTITIES) {
            var gAnis = {};
            for (var ani in ENTITIES[ent].graphics.animations) {
                var gFrames = [];
                for (var frame in ENTITIES[ent].graphics.animations[ani]) {
                    var gFrame = new SpriteFrame(images[ENTITIES[ent].graphics.animations[ani][frame].src], ENTITIES[ent].graphics.animations[ani][frame].t);
                    gFrames.push(gFrame);
                }
                var gAni = new SpriteAnimation(gFrames);
                gAnis[ani] = gAni;
            }
    
            var gEnt = new GraphicsEntity(gAnis);

            for(var value in ENTITIES[ent].graphics) {
                if(value !== "animations") {
                    gEnt[value] = ENTITIES[ent].graphics[value];
                }
            }

            ENTITIES[ent].graphics = gEnt;
        }
        callback();
    }
}


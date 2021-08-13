//THIS IS UNFINISHED AND UNUSED. THE CODE YOUR LOOKING FOR IS IN MAIN.JS. IM IN THE PROGRESS OF MOVING IT OVER

import { GraphicsEntity } from "./graphics/graphics.js";

const ASSET_PATH = "../data/assets.json";

export class Entity {
    constructor(graphics) {
        this.graphics = graphics;
    }


    static parse() {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            entities = JSON.parse(this.responseText);
            for (var ent in entities) {
                for (var ani in entities[ent].graphics.animations) {
                    for (var frame in entities[ent].graphics.animations[ani]) {
                        sources[entities[ent].graphics.animations[ani][frame].src] = entities[ent].graphics.animations[ani][frame].src;
                    }
                }
            }
            loadImages(sources, init);
        }
        xmlhttp.open("GET", ASSET_PATH);
        xmlhttp.send();
    }
}


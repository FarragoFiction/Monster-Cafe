/*
WHAT WE NEED HERE:

-keep ingame coordinates separate from the game's resolution
-function for rotating drawings
-easing functions

-'GraphicEntity' class (for animating characters)
    -stores frames of the animation, how long to spend on each frame
    -can have different states for different animations
*/

import { GraphicsEntity } from "./graphicsEntity.js";

const DEF_WIDTH = 1024;
const DEF_HEIGHT = 576;

export class GraphicsController {
    constructor(canvas, entities = []) {
        this.canvas = canvas;
        this.entities = entities;

        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
        this.queue = [];
        this.camera = new GraphicsEntity();

        const me = this;
        this.canvas.addEventListener('click', function(event) {
            me.checkClicks(event);
        });

    }

    //draws an image on the canvas,
    //converting relative coordinates to the position on the canvas
    drawSprite(renderData) {
        this.ctx.setTransform(this.camera.scale, 0, 0, this.camera.scale, renderData.transCoord.x, renderData.transCoord.y);
        this.ctx.rotate(this.camera.r);
        this.ctx.transform(renderData.relScale, 0, 0, renderData.relScale, renderData.worldCoord.x, renderData.worldCoord.y);
        this.ctx.rotate(renderData.r);
        this.ctx.drawImage(renderData.img, renderData.rendCoord.x, renderData.rendCoord.y);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.stroke(renderData.path);
        return renderData.path;
    }

    getRenderData(img, x, y, scale, r, camCoord, maxCoord) {
        var renderData = {
            img: img,
            worldCoord: this.convertCoordinates(x - 0.5, y - 0.5), //coordinates this sprite occupies in the world.
            transCoord: { //coordinates used for the first Transform to the camera's position.
                x: maxCoord.x - camCoord.x,
                y: maxCoord.y - camCoord.y,
            },
            relScale: scale * (this.width / DEF_WIDTH), //scale adjusted to match the screen size. 
            rendCoord: { //coordinates used after the last transform to actually draw the image.
                x: img.width / -2,
                y: img.height / -2,
            },
            r: r,
        };

        var path = new Path2D();
        //ok i need to figure out how the hell to get the 4 corners of this thing in regular coordinates.
        var adj = 0.5 * renderData.relScale * this.camera.scale; //adjustment for getting the corners
        var xAdj = img.width * adj;
        var yAdj = img.height * adj;

        var cos = Math.cos(this.camera.r);
        var sin = Math.sin(this.camera.r);
        
        //coordinates for the center of the path
        var pX = maxCoord.x - camCoord.x + ((cos * renderData.worldCoord.x) - (sin * renderData.worldCoord.y)) * this.camera.scale;
        var pY = maxCoord.y - camCoord.y + ((cos * renderData.worldCoord.y) + (sin * renderData.worldCoord.x)) * this.camera.scale;
        
        path.moveTo(pX - xAdj, pY - yAdj);
        path.lineTo(pX - xAdj, pY + yAdj);
        path.lineTo(pX + xAdj, pY + yAdj);
        path.lineTo(pX + xAdj, pY - yAdj);
        path.closePath();

        renderData.path = path;
        return renderData;
    }

    convertCoordinates(x, y) {
        const tX = x * this.width;
        const tY = y * this.height;

        return {
            x: tX,
            y: tY
        };
    }

    getSortedEntityList(entities = this.entities) {
        var list = [];
        for(var ent in entities) {
            list.push(entities[ent].graphics);
        }
        var ret = this.sortEntityGraphics(list);
        return ret;
    }

    //sorts entity graphics by layer.
    //recursive merge sort implementation.
    sortEntityGraphics(entityGraphics){
        if(entityGraphics.length <= 1) {
            return entityGraphics;
        }

        const middle = Math.floor(entityGraphics.length / 2);

        const left = entityGraphics.slice(0, middle);
        const right = entityGraphics.slice(middle);

        return this.mergeHelper(this.sortEntityGraphics(left), this.sortEntityGraphics(right));
    }

    mergeHelper(left, right) {
        var ret = [];
        var leftIndex = 0;
        var rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if(left[leftIndex].layer < right[rightIndex].layer) {
                ret.push(left[leftIndex]);
                leftIndex++;
            } else {
                ret.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return ret.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    //does the update shit for every entity
    update(time) {
        this.queue = this.getSortedEntityList();
        this.camera.update(time);
        const max = this.convertCoordinates(1,1);
        const camCoord = this.convertCoordinates(this.camera.x, this.camera.y);

        for(var i = 0; i < this.queue.length; i++) {
            var entG = this.queue[i];
            entG.update(time);
            entG.renderData = this.getRenderData(entG.img, entG.x, entG.y, entG.scale, entG.r, camCoord, max);
            entG.path = entG.renderData.path;
        }

    }

    render() {
        //this.ctx.strokeStyle = 'transparent';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.rotate(0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(var i = 0; i < this.queue.length; i++) {
            var ent = this.queue[i];
            this.drawSprite(ent.renderData);
        }
    }

    checkClicks(event) {
        for(var i = this.queue.length - 1; i >= 0; i--) {
            if(this.queue[i].path != null && this.queue[i].onClick != null) {
                if(this.ctx.isPointInPath(this.queue[i].path, event.offsetX, event.offsetY)) {
                    this.queue[i].onClick();
                }
            }
        }
    }
}


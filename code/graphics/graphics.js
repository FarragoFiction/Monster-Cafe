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

export const DEF_DIMENSIONS = {
    width: DEF_WIDTH,
    height: DEF_HEIGHT
};


export class GraphicsController {
    constructor(canvas, entities = []) {
        this.canvas = canvas;
        this.entities = entities;

        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingInabled = false;

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
        if(renderData.clickable) {
            //TODO make a better indicator
            this.ctx.stroke(renderData.path);
        }

        return renderData.path;
    }

    getRenderData(img, x, y, scale, r, camCoord, clickable) {
        var renderData = {
            img: img,
            worldCoord: {
                x: x - DEF_WIDTH/2,
                y: y - DEF_HEIGHT/2
            }, //coordinates this sprite occupies in the world.
            transCoord: { //coordinates used for the first Transform to the camera's position.
                x: DEF_WIDTH - camCoord.x,
                y: DEF_HEIGHT - camCoord.y,
            },
            relScale: scale * (this.width / DEF_WIDTH), //scale adjusted to match the screen size. 
            rendCoord: { //coordinates used after the last transform to actually draw the image.
                x: img.width / -2,
                y: img.height / -2,
            },
            r: r,
            clickable: clickable
        };

        var path = new Path2D();
        //ok i need to figure out how the hell to get the 4 corners of this thing in regular coordinates.
        var adj = 0.5 * renderData.relScale * this.camera.scale; //adjustment for getting the corners
        var xAdj = img.width * adj;
        var yAdj = img.height * adj;

        var cos = Math.cos(this.camera.r);
        var sin = Math.sin(this.camera.r);
        
        //coordinates for the center of the path
        var pX = renderData.transCoord.x + ((cos * renderData.worldCoord.x) - (sin * renderData.worldCoord.y)) * this.camera.scale;
        var pY = renderData.transCoord.y + ((cos * renderData.worldCoord.y) + (sin * renderData.worldCoord.x)) * this.camera.scale;
        
        path.moveTo(pX - xAdj, pY - yAdj);
        path.lineTo(pX - xAdj, pY + yAdj);
        path.lineTo(pX + xAdj, pY + yAdj);
        path.lineTo(pX + xAdj, pY - yAdj);
        path.closePath();

        //console.log("(" + pX + ", " + pY + ")");

        renderData.path = path;
        renderData.xAdj = xAdj;
        renderData.yAdj = yAdj;
        return renderData;
    }

    convertCoordinates(x, y) {
        const tX = x * this.width / DEF_WIDTH;
        const tY = y * this.height / DEF_HEIGHT;
        return {
            x: tX,
            y: tY
        };
    }

    //moves an HTML element to somewhere on the canvas.
    moveElement(element, x, y) {
        element.style.left = "" + x + "px";
        element.style.top = "" + y + "px";
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
        const camCoord = {x: this.camera.x, y: this.camera.y};

        for(var i = 0; i < this.queue.length; i++) {
            var entG = this.queue[i];
            entG.update(time);
            var clickable = false;
            if(entG.onClick != null) clickable = true;
            entG.renderData = this.getRenderData(entG.img, entG.x, entG.y, entG.scale, entG.r, camCoord, clickable);
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


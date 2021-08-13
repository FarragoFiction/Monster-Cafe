export class StartMenuController {
    constructor(target) {
        this.target = target;
    }

    processInput() {
        
    }
    
    update() {
         //if we want fancy background graphics we can put them here i guess?       
    }
    
    render() {
        
    }

    begin() {
        this.target.append(getStartMenuDivs());
    }
}

function getStartMenuDivs() {
    var ret = document.createElement('div');
    ret.className = "startMenuHolder";

    ret.append(getStartMenuTitle("Diner Of The Damned"));
    ret.append(getStartMenuButton("Resume Game", fuck));
    ret.append(getStartMenuButton("New Game", fuck));
    ret.append(getStartMenuButton('Settings', fuck));

    return ret;
}

function getStartMenuButton(text, callback) {
    var ret = document.createElement('button');
    ret.className = "startMenuButton";
    ret.textContent = text;
    ret.onclick = callback;
    return ret;
}

function getStartMenuTitle(text) {
    var ret = document.createElement('h1');
    ret.className = "startMenuTitle";
    ret.textContent = text;
    return ret;
}

/*class StartMenuTitle {
    constructor() {

    }

    getElement(target) {
        var ret = document.createElement('h1');
        ret.className = "startMenuTitle";
        ret.textContent = "Diner Of The Damned";
        target.append(ret);
    }
}*/

function fuck() {
    console.log("fuck");
}
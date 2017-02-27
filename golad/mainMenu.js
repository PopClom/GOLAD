
var player1buttons;
var player2buttons;
var hintbuttons;
var animationbuttons;
var cellshapebuttons;

var playButton;
var radioButtonFrames = 8;

var loadScreen = 100;
var logoAlpha = -10;
var loading = true;

var colorPalette = {
    'White': [255, 255, 255],
    'Beige': [248, 218, 184],
    'Pink': [255, 105, 180],
    'Red': [200, 0, 40],
    'Orange': [255, 100, 0],
    'Gold': [210, 180, 45],
    'Yellow': [255, 220, 0],
    'Lime': [160, 220, 0],
    'Green': [0, 150, 40],
    'Emerald': [0, 152, 117],
    'Light Blue': [0, 204, 255],
    'Blue': [0, 80, 200],
    'Violet': [160, 0, 255],
    'Purple': [150, 0, 110],
    'Fuchsia': [220, 0, 90],
    'Burgundy': [100, 0, 25],
    'Brown': [80, 30, 0],
};

function generateMainMenu() {
    background(35);
    generateLogo(255);
    fill(50);
    rectMode(CORNER);
    rect(width / 3, 0, width * 2 / 3, height);
    textSize(40 * boardDimension / 720);
    textStyle(BOLD);
    fill(255);
    textAlign(LEFT, CENTER);
    text('Settings', width / 3 + height / 15 - height / 80, height / 15);
    fill(210);
    textSize(30 * boardDimension / 720);
    text('Player 1', width / 3 + height / 15 - height / 80, height * 3 / 20);
    text('Player 2', width / 3 + height / 15 - height / 80, height * 6 / 20);
    text('Board size', width / 3 + height / 15 - height / 80, height * 9 / 20);
    text('Hints', width * 5 / 9 + height / 15 - height / 80, height * 9 / 20);
    text('Animations', width * 7 / 9 + height / 15 - height / 80, height * 9 / 20);
    text('Cell shape', width / 3 + height / 15 - height / 80, height * 12 / 20);
    text('Player 1 color', width * 5 / 9 + height / 15 - height / 80, height * 12 / 20);
    text('Player 2 color', width * 7 / 9 + height / 15 - height / 80, height * 12 / 20);

    fill(150);
    textSize(22 * boardDimension / 720);
    textAlign(LEFT, CENTER);
    textStyle(ITALIC);
    text('Check out Cary', height / 40, height * 24 / 25);
    textAlign(RIGHT, CENTER);
    text('v1.1', width / 3 - height / 40, height * 24 / 25);

    fill(60);
    rect(width / 3, height * 29 / 40, width * 2 / 3, height * 11 / 40);

    playButton.showBtn();
    sandboxButton.showBtn();
    rulesButton.showBtn();
    if (totalMoves != 0) {
        resumeButton.showBtn();
    }
    player1buttons.showBtn();
    player2buttons.showBtn();
    hintbuttons.showBtn();
    animationbuttons.showBtn();
    cellshapebuttons.showBtn();
    boardSizePicker.show();
    player1color.show();
    player2color.show();
    zoomIn.show();
    zoomOut.show();
}

function generateLogo(alphaValue) {
    rectMode(CENTER);
    noStroke();
    fill(15, alphaValue);
    rect(width / 6, height / 2, height / 2, height / 2);
    fill(190, 0, 40, alphaValue);
    rect(width / 6, height / 2, height * 3 / 8, height * 3 / 8);
    fill(10, alphaValue);
    rect(width / 6, height / 2, height / 12, height / 12);
    fill(255, alphaValue);
    textStyle(NORMAL);
    textAlign(RIGHT, CENTER);
    textSize(38 * boardDimension / 720);
    text('Game of Life', width / 6 + height / 7, height / 2 - height / 7);
    textSize(24 * boardDimension / 720);
    text('-John Conway', width / 6 + height / 7, height / 2 - height / 10);
    fill(0, alphaValue);
    textSize(38 * boardDimension / 720);
    text('and Death', width / 6 + height / 7, height / 2 + height / 10);
    textSize(24 * boardDimension / 720);
    text('-Cary Huang', width / 6 + height / 7, height / 2 + height / 7);
    textStyle(ITALIC);
    fill(150, alphaValue);
    textAlign(RIGHT, CENTER);
    textSize(22 * boardDimension / 720);
    text('-Ezequiel Keimel', width / 6 + height / 4, height / 2 + height / 3);
    textSize(34 * boardDimension / 720);
    text('Javascript Edition', width / 6 + height / 4, height / 2 + height * 2 / 7);
}

function radioButton(btext, posX, posY) {
    this.btext = btext;
    this.posX = posX;
    this.posY = posY;
    this.checked = false;
    this.currentFrame = 1;
}

radioButton.prototype.show = function() {
    ellipseMode(CENTER);
    fill(130);
    ellipse(this.posX, this.posY, height / 40, height / 40);
    fill(240);
    var newsize = (this.currentFrame / radioButtonFrames) * height / 65
    ellipse(this.posX, this.posY, newsize, newsize);
    ellipseMode(CORNER);

    textSize(24 * boardDimension / 720);
    textAlign(LEFT, CENTER);
    textStyle(NORMAL);
    fill(255);
    text(this.btext, this.posX + height / 40, this.posY);

    if (this.checked && this.currentFrame < radioButtonFrames) {
        this.currentFrame++;
    }
    if (!this.checked && this.currentFrame > 0) {
        this.currentFrame--;
    }
}

radioButton.prototype.clicked = function(x, y) {
    var distance = dist(x, y, this.posX, this.posY);
    if (distance <= height / 80) {
        return true;
    } else {
        return false;
    }
}

function radioButtonSet(btnNames, btnPosX, btnPosY, defaultval) {
    this.btnNames = btnNames;
    this.btnPosX = btnPosX;
    this.btnPosY = btnPosY;
    this.buttons = [];
    this.currentOption = defaultval;

    for (var i = 0; i < this.btnNames.length; i++) {
        this.buttons.push(new radioButton(btnNames[i], btnPosX[i], btnPosY[i]));
    }
    this.buttons[this.currentOption].checked = true;
    this.option = this.buttons[this.currentOption].btext;
}

radioButtonSet.prototype.showBtn = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].show();
    }
}

radioButtonSet.prototype.btnClick = function() {
    var buttonpressed = -1;

    for (var i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].clicked(mouseX, mouseY)) {
            buttonpressed = i;
            buttonpressed;
            if (!this.buttons[i].checked) {
                this.buttons[i].checked = true;
                this.buttons[i].currentFrame++;
            }
        }
    }

    if (buttonpressed != -1) {
        for (var i = 0; i < this.buttons.length; i++) {
            if (buttonpressed != i) {
                if (this.buttons[i].checked) {
                    this.buttons[i].checked = false;
                    this.buttons[i].currentFrame--;
                }
            }
        }
        this.currentOption = buttonpressed;
        this.option = this.buttons[this.currentOption].btext;
    }
}

function gameButton(btnName, btnPosX, btnPosY, sizeX, sizeY, btnStyle, btnTextSize) {
    this.btnName = btnName;
    this.btnPosX = btnPosX;
    this.btnPosY = btnPosY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.btnStyle = btnStyle;
    this.btnTextSize = btnTextSize;
    this.pressed = false;
}

gameButton.prototype.showBtn = function() {
    textSize(this.btnTextSize * boardDimension / 720);
    textStyle(this.btnStyle);
    textAlign(CENTER, CENTER);

    if (!this.pressed) {
        fill(0, 110, 100);
        rect(this.btnPosX, this.btnPosY + height / 150, this.sizeX, this.sizeY, 15);
        fill(0, 150, 140);
        rect(this.btnPosX, this.btnPosY, this.sizeX, this.sizeY, 15);
        fill(255);
        text(this.btnName, this.btnPosX + this.sizeX / 2, this.btnPosY + this.sizeY / 2);
    } else {
        fill(0, 60, 55);
        rect(this.btnPosX, this.btnPosY, this.sizeX, this.sizeY, 15);
        fill(0, 100, 90);
        rect(this.btnPosX, this.btnPosY + height / 150, this.sizeX, this.sizeY, 15);
        fill(180);
        text(this.btnName, this.btnPosX + this.sizeX / 2, this.btnPosY + this.sizeY / 2 + height / 150);
    }
}

gameButton.prototype.onButton = function(x, y) {
    if (x >= this.btnPosX && y >= this.btnPosY && x <= this.btnPosX + this.sizeX && y <= this.btnPosY + this.sizeY) {
        return true;
    } else {
        return false;
    }
}

function Picker(values, defaultval, posX, posY, sizeX, sizeY) {
    this.values = values;
    this.currentValue = defaultval;
    this.posX = posX;
    this.posY = posY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.pickerColor = [255, 255, 255];
    this.up = false;
    this.down = false;
    this.pickerText = this.values[this.currentValue];
}

Picker.prototype.show = function() {
    fill(130);
    rect(this.posX, this.posY, this.sizeX, this.sizeY);

    if (!this.up) {
        fill(100);
    } else {
        fill(70);
    }
    rect(this.posX + this.sizeX - height / 30, this.posY, height / 30, this.sizeY / 2);

    if (!this.down) {
        fill(100);
    } else {
        fill(70);
    }
    rect(this.posX + this.sizeX - height / 30, this.posY + this.sizeY / 2, height / 30, this.sizeY / 2);

    textSize(25 * boardDimension / 720);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    fill(this.pickerColor[0], this.pickerColor[1], this.pickerColor[2]);
    text(this.pickerText, this.posX + this.sizeY / 4, this.posY + this.sizeY / 2);
    textAlign(CENTER, CENTER);
    textSize(12 * boardDimension / 720);

    if (!this.up) {
        fill(255);
    } else {
        fill(200);
    }
    text('▲', this.posX + this.sizeX - height / 60, this.posY + this.sizeY / 4);

    if (!this.down) {
        fill(255);
    } else {
        fill(200);
    }
    text('▼', this.posX + this.sizeX - height / 60, this.posY + this.sizeY * 3 / 4);
}

Picker.prototype.onPress = function(x, y) {
    if (x >= this.posX + this.sizeX - height / 30 && y >= this.posY && x <= this.posX + this.sizeX && y < this.posY + this.sizeY / 2) {
        this.up = true;
    }
    if (x >= this.posX + this.sizeX - height / 30 && y > this.posY + this.sizeY / 2 && x <= this.posX + this.sizeX && y <= this.posY + this.sizeY) {
        this.down = true;
    }
}

Picker.prototype.onRelease = function(x, y) {
    if (x >= this.posX + this.sizeX - height / 30 && y >= this.posY && x <= this.posX + this.sizeX && y < this.posY + this.sizeY / 2) {
        if (this.up) {
            this.valueUp();
        }
    }
    if (x >= this.posX + this.sizeX - height / 30 && y > this.posY + this.sizeY / 2 && x <= this.posX + this.sizeX && y <= this.posY + this.sizeY) {
        if (this.down) {
            this.valueDown();
        }
    }
    this.down = false;
    this.up = false;
}

Picker.prototype.valueUp = function() {
    this.currentValue++;
    if (this.currentValue >= this.values.length) {
        this.currentValue = 0;
    }
    this.pickerText = this.values[this.currentValue];
}

Picker.prototype.valueDown = function() {
    this.currentValue--;
    if (this.currentValue < 0) {
        this.currentValue = this.values.length - 1;
    }
    this.pickerText = this.values[this.currentValue];
}

function nowLoading() {
    if (loadScreen > 0) {
        fill(0, map(loadScreen, 0, 15, 0, 255));
        rectMode(CORNER);
        rect(0, 0, width, height);
        push();
        var translation = (width / 3) * (1 + sin(sin(map(loadScreen, 15, 60, -PI / 2, PI / 2)) * PI / 2)) / 2;
        if (loadScreen > 60) {
            translation = width / 3;
        } else if (loadScreen < 15) {
            translation = 0;
        }
        translate(translation, 0);
        generateLogo(map(logoAlpha, 0, 15, 0, 255));
        pop();
        loadScreen--;
    } else if (loading) {
        loading = false;
    }

    if (logoAlpha < 15) {
        logoAlpha++;
    }
}

function Zoom(posX, posY, btnText) {
    this.posX = posX;
    this.posY = posY;
    this.btnText = btnText;
    this.pressed = false;

    this.show = function() {
        noFill();
        strokeWeight(3);
        ellipseMode(CENTER);
        textAlign(CENTER, CENTER);
        textSize(25 * boardDimension / 720);
        textStyle(BOLD);
        if (!this.pressed) {
            stroke(110);
            ellipse(this.posX, this.posY, height / 25, height / 25);
            fill(110);
        } else {
            stroke(70);
            ellipse(this.posX, this.posY, height / 25, height / 25);
            fill(70);
        }
        ellipseMode(CORNER);
        strokeWeight(0);
        noStroke();
        text(this.btnText, this.posX, this.posY);
    }

    this.onButton = function(x, y) {
        var distance = dist(x, y, this.posX, this.posY);
        if (distance <= height / 50) {
            return true;
        } else {
            return false;
        }
    }
}

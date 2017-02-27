var boardSize = 16;
var boardDimension = 720;
var ratio = 16 / 9;
var boardPosX = 0;
var boardPosY = 0;
var cellSize = boardDimension / (boardSize * 1.1 + 0.1);
var edgeThickness = cellSize * 0.1;
var zoomStep = 120;
var pressInterval = -8;

var onMainMenu = true;
var onGame = true;
var player = 'RED';
var hint = true;
var hintsize = 3;
var cells = [];
var cellShape = 'square';

var redAI = false;
var blueAI = true;
var gameLocked = false;
var animations = true;

var birth = [3];
var survive = [2, 3];

var defaultPlayer1 = 0;
var defaultPlayer2 = 0;
var defaultHint = 0;
var defaultAnimation = 0;
var defaultCellShape = 0;
var defaultBoardSize = 8;
var defaultPlayer1color = 3;
var defaultPlayer2color = 11;


function setup() {
    createCanvas(ratio * boardDimension, boardDimension);
    ellipseMode(CORNER);
    rectMode(CORNER);

    playButton = new gameButton('New Game', width * 4 / 10 - height / 20, height * 31 / 40, height / 3, height / 13, BOLD, 35);
    sandboxButton = new gameButton('Sandbox', width * 5 / 9 + height / 30, height * 31 / 40, height / 3, height / 13, BOLD, 35);
    rulesButton = new gameButton('Change rules', width * 7 / 9, height * 31 / 40, height / 3, height / 13, BOLD, 35);
    resumeButton = new gameButton('Resume', width * 5 / 9 + height / 30, height * 35 / 40, height / 3, height / 13, BOLD, 35);
    finishButton = new gameButton('Finish move', height + (width - height) / 6, height * 5 / 8, (width - height) * 4 / 6, height / 10, BOLD, 40);
    undoButton = new gameButton('Undo', height + (width - height) / 6, height * 3 / 4, (width - height) * 15 / 48, height / 16, NORMAL, 30);
    redoButton = new gameButton('Redo', height + (width - height) / 2 + (width - height) / 48, height * 3 / 4, (width - height) * 15 / 48, height / 16, NORMAL, 30);
    menuButton = new gameButton('Main menu', height + (width - height) / 4, height * 7 / 8, (width - height) * 3 / 6, height / 12, BOLD, 40);
    emptyButton = new gameButton('Empty', height + (width - height) / 3, height * 8 / 15, (width - height) / 3, height / 16, NORMAL, 30);

    var btnNames = ['Human', 'Dumb AI', 'Okay AI', 'Smart AI'];
    var btnPosX = [width / 3 + height / 15, width / 3 + height / 5 + height / 15, width / 3 + height * 2 / 5 + height / 15, width / 3 + height * 3 / 5 + height / 15];
    var btnPosY = [height * 2 / 10, height * 2 / 10, height * 2 / 10, height * 2 / 10];
    player1buttons = new radioButtonSet(btnNames, btnPosX, btnPosY, defaultPlayer1);

    btnNames = ['Human', 'Dumb AI', 'Okay AI', 'Smart AI'];
    btnPosX = [width / 3 + height / 15, width / 3 + height / 5 + height / 15, width / 3 + height * 2 / 5 + height / 15, width / 3 + height * 3 / 5 + height / 15];
    btnPosY = [height * 7 / 20, height * 7 / 20, height * 7 / 20, height * 7 / 20];
    player2buttons = new radioButtonSet(btnNames, btnPosX, btnPosY, defaultPlayer2);

    btnNames = ['On', 'Off'];
    btnPosX = [width * 5 / 9 + height / 15, width * 5 / 9 + height / 7 + height / 15];
    btnPosY = [height / 2, height / 2]
    hintbuttons = new radioButtonSet(btnNames, btnPosX, btnPosY, defaultHint);

    btnNames = ['On', 'Off'];
    btnPosX = [width * 7 / 9 + height / 15, width * 7 / 9 + height / 7 + height / 15];
    btnPosY = [height / 2, height / 2];
    animationbuttons = new radioButtonSet(btnNames, btnPosX, btnPosY, defaultAnimation);

    btnNames = ['Square', 'Circle'];
    btnPosX = [width / 3 + height / 15, width / 3 + height / 5 + height / 15];
    btnPosY = [height * 13 / 20, height * 13 / 20];
    cellshapebuttons = new radioButtonSet(btnNames, btnPosX, btnPosY, defaultCellShape);

    boardSizePicker = new Picker([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        defaultBoardSize, width / 3 + height / 15 - height / 80, height / 2 - height / 45, height / 9, height / 20);

    cellColors = [];
    for (var key in colorPalette) {
        cellColors.push(key);
    }

    player1color = new Picker(cellColors, defaultPlayer1color, width * 5 / 9 + height / 15 - height / 80, height * 13 / 20 - height / 45, height / 4, height / 20);
    player1color.pickerColor = colorPalette[player1color.pickerText];

    player2color = new Picker(cellColors, defaultPlayer2color, width * 7 / 9 + height / 15 - height / 80, height * 13 / 20 - height / 45, height / 4, height / 20);
    player2color.pickerColor = colorPalette[player2color.pickerText];

    zoomIn = new Zoom(height / 25, height / 25, '+');
    zoomOut = new Zoom(2.5 * height / 25, height / 25, '−');

    frameRate(30);
}

function draw() {
    if (onMainMenu) {
        generateMainMenu();
    } else {
        background(0);
        noStroke();

        for (var i = 0; i < cells.length; i++) {
            cells[i].show();
            if (cells[i].transitioning) {
                cells[i].transition();
            }
        }

        if (shapeTransitions.length == 0) {
            if (countCellTransitions() == 0) {
                getReady();
                getReady2();
            }
        }

        for (var j = 0; j < shapeTransitions.length; j++) {
            if (shapeTransitions[j].currentframe < shapetransitionframes) {
                shapeTransitions[j].nextframe();
            } else {
                shapeTransitions.splice(j, 1);
                j--;
            }
        }

        if (startAI != null) {
            if (startAI.waiting < aiTransitionFrames + 1) {
                startAI.nextframe();
            } else {
                startAI.continue();
                startAI = null;
            }
        }

        if (AIanimation != null) {
            if (AIanimation.finishstate == false) {
                AIanimation.nextframe();
            } else {
                AIanimation = null;
                gameLocked = false;
                finish(0);
            }
        }

        if (mouseIsPressed && (undoButton.pressed || redoButton.pressed || finishButton.pressed)) {
            pressInterval++;
            if (pressInterval > 3) {
                pressInterval = 0;
                if (undoButton.pressed) {
                    undo();
                } else if (redoButton.pressed) {
                    redo();
                } else if (finishButton.pressed) {
                    finish(countCellTransitions());
                }
            }
        }

        generateMenu();
    }
    nowLoading();
}

function mousePressed() {
    if (!loading) {
        if (onMainMenu) {
            if (playButton.onButton(mouseX, mouseY)) {
                playButton.pressed = true;
            }
            if (sandboxButton.onButton(mouseX, mouseY)) {
                sandboxButton.pressed = true;
            }
            if (rulesButton.onButton(mouseX, mouseY)) {
                rulesButton.pressed = true;
            }
            if (resumeButton.onButton(mouseX, mouseY)) {
                resumeButton.pressed = true;
            }
            if (zoomIn.onButton(mouseX, mouseY)) {
                zoomIn.pressed = true;
            }
            if (zoomOut.onButton(mouseX, mouseY)) {
                zoomOut.pressed = true;
            }
            if (mouseX >= 0 && mouseX <= height / 4 && mouseY >= height * 23 / 25 && mouseY <= height) {
                window.open('https://www.youtube.com/user/carykh');
            }
            player1buttons.btnClick();
            player2buttons.btnClick();
            hintbuttons.btnClick();
            animationbuttons.btnClick();
            cellshapebuttons.btnClick();
            boardSizePicker.onPress(mouseX, mouseY);
            player1color.onPress(mouseX, mouseY);
            player2color.onPress(mouseX, mouseY);
        } else {
            if (mouseX > height) {
                if (finishButton.onButton(mouseX, mouseY)) {
                    finishButton.pressed = true;
                }
                if (undoButton.onButton(mouseX, mouseY)) {
                    undoButton.pressed = true;
                }
                if (redoButton.onButton(mouseX, mouseY)) {
                    redoButton.pressed = true;
                }
                if (menuButton.onButton(mouseX, mouseY)) {
                    menuButton.pressed = true;
                }
                if (emptyButton.onButton(mouseX, mouseY) && !onGame) {
                    emptyButton.pressed = true;
                }
            } else {
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i].clicked(mouseX - boardPosX, mouseY - boardPosY)) {
                        if (!onGame) {
                            cells[i].changeState();
                        } else {
                            if (!gameLocked && player != 'DEAD') {
                                cells[i].addremove();
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function mouseReleased() {
    if (!loading) {
        if (onMainMenu) {
            if (playButton.onButton(mouseX, mouseY) && playButton.pressed) {
                play();
            }
            if (sandboxButton.onButton(mouseX, mouseY) && sandboxButton.pressed) {
                sandbox();
            }
            if (rulesButton.onButton(mouseX, mouseY) && rulesButton.pressed) {
                changeRules();
            }
            if (resumeButton.onButton(mouseX, mouseY) && resumeButton.pressed) {
                resume();
            }
            if (zoomIn.onButton(mouseX, mouseY) && zoomIn.pressed) {
                if (boardDimension < 1080) {
                    boardDimension += zoomStep;
                    resize('in');
                }
            }
            if (zoomOut.onButton(mouseX, mouseY) && zoomOut.pressed) {
                if (boardDimension > 480) {
                    boardDimension -= zoomStep;
                    resize('out');
                }
            }
            boardSizePicker.onRelease(mouseX, mouseY);
            player1color.onRelease(mouseX, mouseY);
            player2color.onRelease(mouseX, mouseY);
            player1color.pickerColor = colorPalette[player1color.pickerText];
            player2color.pickerColor = colorPalette[player2color.pickerText];
        } else {
            if (gameLocked == false) {
                if (mouseX > height) {
                    var counttransitions = countCellTransitions();
                    if (finishButton.onButton(mouseX, mouseY) && finishButton.pressed) {
                        finish(counttransitions);
                    } else if (undoButton.onButton(mouseX, mouseY) && undoButton.pressed && shapeTransitions.length == 0) {
                        if (counttransitions == 0) {
                            undo();
                        }
                    } else if (redoButton.onButton(mouseX, mouseY) && redoButton.pressed && shapeTransitions.length == 0) {
                        if (counttransitions == 0) {
                            redo();
                        }
                    } else if (emptyButton.onButton(mouseX, mouseY) && emptyButton.pressed && !onGame) {
                        if (counttransitions == 0) {
                            emptyBoard();
                        }
                    }
                }
            }
            if (menuButton.onButton(mouseX, mouseY) && menuButton.pressed) {
                onMainMenu = true;
            }
        }
        finishButton.pressed = false;
        undoButton.pressed = false;
        redoButton.pressed = false;
        menuButton.pressed = false;
        emptyButton.pressed = false;
        playButton.pressed = false;
        sandboxButton.pressed = false;
        rulesButton.pressed = false;
        resumeButton.pressed = false;
        zoomIn.pressed = false;
        zoomOut.pressed = false;
        pressInterval = -8;
    }
    return false;
}

function countCellTransitions() {
    var celltransitions = 0;
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].transitioning) {
            celltransitions++;
        }
    }
    return celltransitions;
}

var redcells = 0;
var bluecells = 0;

var shapeTransitions = [];
var shapetransitionframes = 12;

var record = [];
var totalMoves = 0;
var currentMove = 0;

var gameRules;
var gameFinished = false;

function generateBoard() {
    redcells = 0;
    bluecells = 0;

    record = [];
    shapeTransitions = [];

    totalMoves = 0;
    currentMove = 0;

    glowing = 0;
    bright = 0;

    editingX = -1;
    editingY = -1;
    prevstate = '';

    borning = false;
    ventricle1 = -1;
    ventricle2 = -1;
    showVentricle1 = false;
    showVentricle2 = false;

    cells = [];
    for (var y = 0; y < boardSize; y++) {
        for (var x = 0; x < boardSize; x++) {
            var index = y * boardSize + x;
            cells[index] = new Cell(x, y);
        }
    }

    for (var i = 0; i < Math.floor(cells.length / 2); i++) {
        cells[i].nextstate = random(['DEAD', 'DEAD', 'RED', 'BLUE']);
        cells[i].transitioning = true;
        if (cells[i].nextstate == 'RED') {
            cells[cells.length - 1 - i].nextstate = 'BLUE';
        } else if (cells[i].nextstate == 'BLUE') {
            cells[cells.length - 1 - i].nextstate = 'RED';
        }
        cells[cells.length - 1 - i].transitioning = true;
    }

    countCells();
    getReady2();

    saveStateA();
    totalMoves++;
    currentMove++;

    if (redAI != '') {
        gameLocked = true;
        startAI = new playAI(player, redAI);
    }
}

function step() {
    saveStateB();

    getReady();
    getReady2();
    for (var i = 0; i < cells.length; i++) {
        cells[i].transitioning = true;
    }

    editingX = -1;
    editingY = -1;
    ventricle1 = -1
    ventricle2 = -1
    showVentricle1 = false;
    showVentricle2 = false;
    borning = false;

    countCells();

    if (bluecells != 0 && redcells != 0) {
        if (player == 'RED') {
            player = 'BLUE';
            if (blueAI != '') {
                gameLocked = true;
                startAI = new playAI(player, blueAI);
            }
        } else {
            player = 'RED';
            if (redAI != '') {
                gameLocked = true;
                startAI = new playAI(player, redAI);
            }
        }
    } else if (bluecells == 0 && redcells != 0) {
        player = 'RED';
    } else if (bluecells != 0 && redcells == 0) {
        player = 'BLUE';
    } else if (bluecells == 0 && redcells == 0) {
        player = 'DEAD';
    }

    if (onGame && !gameFinished) {
        if (redcells == 0 && bluecells != 0) {
            alert('Player 2 wins!');
            gameFinished = true;
        } else if (bluecells == 0 && redcells != 0) {
            alert('Player 1 wins!');
            gameFinished = true;
        } else if (bluecells == 0 && redcells == 0) {
            alert('Tie!');
            gameFinished = true;
        }
    }

    saveStateA();
    totalMoves += 2;
    currentMove += 2;
}

function ShapeTransition(xi, yi, wi, hi, xf, yf, wf, hf, ventr, cellNum) {
    this.xi = xi;
    this.yi = yi;
    this.wi = wi;
    this.hi = hi;
    this.xf = xf;
    this.yf = yf;
    this.wf = wf;
    this.hf = hf;
    this.ventr = ventr;
    this.cellNum = cellNum;

    this.currentframe = 0;

    this.xinc = (this.xf - this.xi) / shapetransitionframes;
    this.yinc = (this.yf - this.yi) / shapetransitionframes;
    this.winc = (this.wf - this.wi) / shapetransitionframes;
    this.hinc = (this.hf - this.hi) / shapetransitionframes;
}

ShapeTransition.prototype.nextframe = function() {
    fill(redc[states[player]], greenc[states[player]], bluec[states[player]]);

    if (cellShape == 'square') {
        rect(this.xi, this.yi, this.wi, this.hi);
    } else if (cellShape == 'ellipse') {
        ellipse(this.xi, this.yi, this.wi, this.hi);
    }

    this.xi += this.xinc;
    this.yi += this.yinc;
    this.wi += this.winc;
    this.hi += this.hinc;
    this.currentframe++;

    if (this.currentframe == shapetransitionframes) {
        if (this.ventr == 1 && borning) {
            showVentricle1 = true;
        }
        if (this.ventr == 2 && borning) {
            showVentricle2 = true;
        }
        if (this.cellNum != -1) {
            cells[this.cellNum].state = player;
            cells[this.cellNum].locked = false;
        }
    }
}

function countCells() {
    redcells = 0;
    bluecells = 0;

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].nextstate == 'RED') {
            redcells++;
        }
        if (cells[i].nextstate == 'BLUE') {
            bluecells++;
        }
    }
}

function countCells2() {
    redcells = 0;
    bluecells = 0;

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].state == 'RED') {
            redcells++;
        }
        if (cells[i].state == 'BLUE') {
            bluecells++;
        }
    }
}

function countCells3() {
    redcells = 0;
    bluecells = 0;

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].nextnextstate == 'RED') {
            redcells++;
        }
        if (cells[i].nextnextstate == 'BLUE') {
            bluecells++;
        }
    }
}

function getReady() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].ready();
    }
}

function getReady2() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].ready2();
    }
}

function cleanRecord() {
    if (record.length != currentMove) {
        if (redcells != 0 && bluecells != 0) {
            gameFinished = false;
        }
        record.splice(currentMove, record.length - currentMove);
        totalMoves = currentMove;
    }
}

function saveStateA() {
    var boardStateA = [];

    for (var i = 0; i < cells.length; i++) {
        boardStateA[i] = cells[i].nextstate;
    }

    boardStateA[cells.length] = editingX;
    boardStateA[cells.length + 1] = editingY;
    boardStateA[cells.length + 2] = ventricle1;
    boardStateA[cells.length + 3] = ventricle2;
    boardStateA[cells.length + 4] = showVentricle1;
    boardStateA[cells.length + 5] = showVentricle2;
    boardStateA[cells.length + 6] = borning;
    boardStateA[cells.length + 6] = borning;
    boardStateA[cells.length + 7] = player;
    boardStateA[cells.length + 8] = prevstate;

    record.push(boardStateA);
}

function saveStateB() {
    var boardStateB = [];

    for (var i = 0; i < cells.length; i++) {
        boardStateB[i] = cells[i].state;
    }

    boardStateB[cells.length] = editingX;
    boardStateB[cells.length + 1] = editingY;
    boardStateB[cells.length + 2] = ventricle1;
    boardStateB[cells.length + 3] = ventricle2;
    boardStateB[cells.length + 4] = showVentricle1;
    boardStateB[cells.length + 5] = showVentricle2;
    boardStateB[cells.length + 6] = borning;
    boardStateB[cells.length + 6] = borning;
    boardStateB[cells.length + 7] = player;
    boardStateB[cells.length + 8] = prevstate;

    cleanRecord();
    record.push(boardStateB);
}

function loadState(move) {
    for (var i = 0; i < cells.length; i++) {
        cells[i].state = record[move - 1][i];
    }

    editingX = record[move - 1][cells.length];
    editingY = record[move - 1][cells.length + 1];
    ventricle1 = record[move - 1][cells.length + 2];
    ventricle2 = record[move - 1][cells.length + 3];
    showVentricle1 = record[move - 1][cells.length + 4];
    showVentricle2 = record[move - 1][cells.length + 5];
    borning = record[move - 1][cells.length + 6];
    player = record[move - 1][cells.length + 7];
    prevstate = record[move - 1][cells.length + 8];
}

function finish(counttransitions) {
    if (onGame) {
        if (shapeTransitions.length == 0) {
            if (editingX != -1 && editingY != -1) {
                if (borning && ventricle1 != -1 && ventricle2 != -1) {
                    step();
                } else if (!borning) {
                    step();
                }
            } else {
                if (counttransitions == cells.length) {
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].transitionstate = transitionframes;
                    }
                }
            }
        }
    } else {
        if (counttransitions == 0) {
            saveStateB();
            getReady();
            getReady2();
            for (var i = 0; i < cells.length; i++) {
                cells[i].transitioning = true;
            }
            countCells();
            saveStateA();
            totalMoves += 2;
            currentMove += 2;
        } else if (counttransitions == cells.length) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].transitionstate = transitionframes;
            }
        }
    }
}

function undo() {
    if (currentMove > 1) {
        if (onGame) {
            if (AorB() == 'B') {
                loadState(currentMove);
            } else {
                currentMove--;
                loadState(currentMove);
                currentMove--;
            }
        } else {
            currentMove--;
            currentMove--;
            loadState(currentMove);
        }
    } else {
        loadState(currentMove);
    }
    countCells2();
}

function redo() {
    if (currentMove < totalMoves) {
        if (onGame) {
            if (AorB() == 'A') {
                loadState(currentMove + 1);
            } else {
                currentMove++;
                currentMove++;
                loadState(currentMove);
            }
        } else {
            currentMove++;
            currentMove++;
            loadState(currentMove);
        }
        countCells2();
    }
}

function emptyBoard() {
    saveStateB();

    for (var i = 0; i < cells.length; i++) {
        cells[i].nextstate = 'DEAD';
    }

    getReady2();

    for (var i = 0; i < cells.length; i++) {
        cells[i].transitioning = true;
    }

    countCells();
    saveStateA();
    totalMoves += 2;
    currentMove += 2;
}

function AorB() {
    if (editingX != -1 && editingY != -1) {
        return 'B';
    } else {
        return 'A';
    }
}

function configureGame() {
    onMainMenu = false;

    if (hintbuttons.option == 'On') {
        hint = true;
    } else {
        hint = false;
    }

    if (cellshapebuttons.option == 'Square') {
        cellShape = 'square';
    } else if (cellshapebuttons.option == 'Circle') {
        cellShape = 'ellipse';
    }

    if (animationbuttons.option == 'On') {
        animations = true;
        shapetransitionframes = 12;
        transitionframes = 15;
        aiTransitionFrames = 14;
    } else {
        animations = false;
        shapetransitionframes = 1;
        transitionframes = 15;
        aiTransitionFrames = 1;
    }

    if (player1color.currentValue == player2color.currentValue) {
        player2color.valueUp();
    }

    gameRules = 'B';
    for (var i = 0; i < birth.length; i++) {
        gameRules = gameRules + birth[i];
    }
    gameRules = gameRules + '/S';
    for (var i = 0; i < survive.length; i++) {
        gameRules = gameRules + survive[i];
    }

    redc = [50, colorPalette[player1color.pickerText][0], colorPalette[player2color.pickerText][0], 140];
    greenc = [50, colorPalette[player1color.pickerText][1], colorPalette[player2color.pickerText][1], 140];
    bluec = [50, colorPalette[player1color.pickerText][2], colorPalette[player2color.pickerText][2], 140];
}

function play() {
    boardSize = parseInt(boardSizePicker.pickerText);
    cellSize = boardDimension / (boardSize * 1.1 + 0.1);
    edgeThickness = cellSize * 0.1;
    gameFinished = false;

    player = 'RED';
    configureGame();
    onGame = true;

    gameLocked = false;
    AIanimation = null;
    startAI = null;

    player1buttons.option = player1buttons.buttons[player1buttons.currentOption].btext;
    player2buttons.option = player2buttons.buttons[player2buttons.currentOption].btext;

    if (player1buttons.option == 'Human') {
        redAI = '';
    } else if (player1buttons.option == 'Dumb AI') {
        redAI = 'dumb';
    } else if (player1buttons.option == 'Okay AI') {
        redAI = 'okay';
    } else if (player1buttons.option == 'Smart AI') {
        redAI = 'smart';
    }

    if (player2buttons.option == 'Human') {
        blueAI = '';
    } else if (player2buttons.option == 'Dumb AI') {
        blueAI = 'dumb';
    } else if (player2buttons.option == 'Okay AI') {
        blueAI = 'okay';
    } else if (player2buttons.option == 'Smart AI') {
        blueAI = 'smart';
    }

    generateBoard();
}

function sandbox() {
    boardSize = parseInt(boardSizePicker.pickerText);
    cellSize = boardDimension / (boardSize * 1.1 + 0.1);
    edgeThickness = cellSize * 0.1;

    player = 'RED';
    configureGame();
    onGame = false;

    gameLocked = false;
    AIanimation = null;
    startAI = null;

    redAI = '';
    blueAI = '';

    player1buttons.option = 'Sandbox';
    player2buttons.option = 'Sandbox';

    generateBoard();
}

function resume() {
    configureGame();

    if (onGame) {
        if (player1buttons.option == 'Human') {
            redAI = '';
        } else if (player1buttons.option == 'Dumb AI') {
            redAI = 'dumb';
        } else if (player1buttons.option == 'Okay AI') {
            redAI = 'okay';
        } else if (player1buttons.option == 'Smart AI') {
            redAI = 'smart';
        }

        if (player2buttons.option == 'Human') {
            blueAI = '';
        } else if (player2buttons.option == 'Dumb AI') {
            blueAI = 'dumb';
        } else if (player2buttons.option == 'Okay AI') {
            blueAI = 'okay';
        } else if (player2buttons.option == 'Smart AI') {
            blueAI = 'smart';
        }
    }
}

function changeRules() {
    rulesButton.pressed = false;
    var birthRules = prompt('Birth rules', '3');
    var surviveRules = prompt('Survive rules', '23');
    if (birthRules == null) {
        birthRules = '3';
    }
    if (surviveRules == null) {
        surviveRules = '23';
    }
    birth = [];
    survive = [];

    newRules: {
        for (var i = 0; i < birthRules.length; i++) {
            var numChar = parseInt(birthRules.charAt(i))
            if (!isNaN(numChar) && numChar >= 0 && numChar <= 8) {
                if (i > 0) {
                    if (numChar > birthRules[i - 1]) {
                        birth.push(numChar);
                    } else {
                        birth = [3];
                        survive = [2, 3];
                        alert('Invalid rules');
                        break newRules;
                    }
                } else {
                    birth.push(numChar);
                }
            } else {
                birth = [3];
                survive = [2, 3];
                alert('Invalid rules');
                break newRules;
            }
        }

        for (var i = 0; i < surviveRules.length; i++) {
            var numChar = parseInt(surviveRules.charAt(i))
            if (!isNaN(numChar) && numChar <= 8 && numChar >= 0) {
                if (i > 0) {
                    if (numChar > surviveRules[i - 1]) {
                        survive.push(numChar);
                    } else {
                        birth = [3];
                        survive = [2, 3];
                        alert('Invalid rules');
                        break newRules;
                    }
                } else {
                    survive.push(numChar);
                }
            } else {
                birth = [3];
                survive = [2, 3];
                alert('Invalid rules');
                break newRules;
            }
        }
    }
}

function resize(type) {
    cellSize = boardDimension / (boardSize * 1.1 + 0.1);
    edgeThickness = cellSize * 0.1;

    for (var i = 0; i < cells.length; i++) {
        cells[i].posX = cells[i].numX * (cellSize + edgeThickness) + edgeThickness;
        cells[i].posY = cells[i].numY * (cellSize + edgeThickness) + edgeThickness;
    }

    if (type == 'in') {
        var scaling = boardDimension / (boardDimension - zoomStep);
    } else if (type == 'out') {
        var scaling = boardDimension / (boardDimension + zoomStep);
    }

    for (var i = 0; i < shapeTransitions.length; i++) {
      shapeTransitions[i].xi *= scaling;
      shapeTransitions[i].yi *= scaling;
      shapeTransitions[i].wi *= scaling;
      shapeTransitions[i].hi *= scaling;
      shapeTransitions[i].xf *= scaling;
      shapeTransitions[i].yf *= scaling;
      shapeTransitions[i].wf *= scaling;
      shapeTransitions[i].hf *= scaling;
      shapeTransitions[i].xinc *= scaling;
      shapeTransitions[i].yinc *= scaling;
      shapeTransitions[i].winc *= scaling;
      shapeTransitions[i].hinc *= scaling;
    }

    if (AIanimation != null) {
      AIanimation.xi *= scaling;
      AIanimation.yi *= scaling;
    }

    defaultPlayer1 = player1buttons.currentOption;
    defaultPlayer2 = player2buttons.currentOption;
    defaultHint = hintbuttons.currentOption;
    defaultAnimation = animationbuttons.currentOption;
    defaultCellShape = cellshapebuttons.currentOption;
    defaultBoardSize = boardSizePicker.currentValue;
    defaultPlayer1color = player1color.currentValue;
    defaultPlayer2color = player2color.currentValue;

    setup();
}

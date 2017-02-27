var glowing = 0;
var bright = 0;

function generateMenu() {
    textSize(40 * boardDimension / 720);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    fill(206, 240, 247);
    rect(height, 0, width - height, height);

    fill(10, 60, 70);
    text(gameRules, height + (width - height) / 2, height / 20);

    showPlayerSection();
    showPlayerDetails();
    showMoves();
    glow();

    finishButton.showBtn();
    undoButton.showBtn();
    redoButton.showBtn();
    menuButton.showBtn();
    if (!onGame) {
        emptyButton.showBtn();
    }
}

function glow() {
    bright = 128 + sin(glowing) * 127;
    glowing += PI / 15;
    if (glowing > TAU) {
        glowing = 0;
    }
}

function showPlayerSection() {
    textSize(40 * boardDimension / 720);
    textStyle(BOLD);

    fill(redc[states['RED']], greenc[states['RED']], bluec[states['RED']]);
    rect(height, height / 10, width - height, height / 5);
    if (player == 'RED' || !onGame) {
        fill(bright);
    } else {
        fill(0);
    }
    text('Player 1', height + (width - height) / 2, height / 5);

    fill(redc[states['BLUE']], greenc[states['BLUE']], bluec[states['BLUE']]);
    rect(height, height * 3 / 10 + height / 200, width - height, height / 5);
    if (player == 'BLUE' || !onGame) {
        fill(bright);
    } else {
        fill(0);
    }
    text('Player 2', height + (width - height) / 2, height * 2 / 5);
}

function showPlayerDetails() {
    textStyle(NORMAL);
    textSize(30 * boardDimension / 720);

    if (player == 'RED' || !onGame) {
        fill(bright);
    } else {
        fill(0);
    }
    if (cellShape == 'square') {
        text('◻×' + redcells, height + (width - height) / 2, height / 5 + height / 15);
    } else if (cellShape == 'ellipse') {
        text('⭘×' + redcells, height + (width - height) / 2, height / 5 + height / 15);
    }
    text(player1buttons.option, height + (width - height) / 2, height / 5 - height / 17);

    if (player == 'BLUE' || !onGame) {
        fill(bright);
    } else {
        fill(0);
    }
    if (cellShape == 'square') {
        text('◻×' + bluecells, height + (width - height) / 2, height * 2 / 5 + height / 15);
    } else if (cellShape == 'ellipse') {
        text('⭘×' + bluecells, height + (width - height) / 2, height * 2 / 5 + height / 15);
    }
    text(player2buttons.option, height + (width - height) / 2, height * 2 / 5 - height / 17);
}

function showMoves() {
    textStyle(NORMAL);
    textSize(30 * boardDimension / 720);

    if (onGame) {
        var AorBmove = AorB();
        if (currentMove == totalMoves) {
            var showMove = ((currentMove + 1) / 2) + AorBmove + '/' + ((totalMoves + 1) / 2) + AorBmove;
        } else {
            var showMove = ((currentMove + 1) / 2) + AorBmove + '/' + ((totalMoves + 1) / 2) + 'A';
        }
    } else {
        showMove = '';
    }
    fill(0);
    text(showMove, height + (width - height) / 2, height / 2 + height / 15);
}

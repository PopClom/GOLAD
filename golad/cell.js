var states = {
    'DEAD': 0,
    'RED': 1,
    'BLUE': 2,
    'GRAY': 3
};

var redc = [50, 190, 0, 140];
var greenc = [50, 0, 90, 140];
var bluec = [50, 40, 160, 140];

var transitionframes = 15;

var editingX = -1;
var editingY = -1;
var prevstate = '';

var borning = false;
var ventricle1 = -1;
var ventricle2 = -1;
var showVentricle1 = false;
var showVentricle2 = false;

function Cell(x, y) {
    this.numX = x;
    this.numY = y;
    this.state = 'DEAD';
    this.nextstate = 'DEAD';
    this.nextnextstate = 'DEAD';

    this.transitioning = false;
    this.transitionstate = hintsize;

    this.redneighbors = 0;
    this.blueneighbors = 0;
    this.grayneighbors = 0;

    this.locked = false;

    this.posX = this.numX * (cellSize + edgeThickness) + edgeThickness;
    this.posY = this.numY * (cellSize + edgeThickness) + edgeThickness;
}

Cell.prototype.show = function() {
    fill(redc[states[this.state]], greenc[states[this.state]], bluec[states[this.state]]);

    if (cellShape == 'square') {
        rect(this.posX, this.posY, cellSize, cellSize);
    } else if (cellShape == 'ellipse') {
        ellipse(this.posX, this.posY, cellSize, cellSize);
    }

    if (borning && this.numX == editingX && this.numY == editingY) {

        if (showVentricle1) {
            fill(redc[states[player]], greenc[states[player]], bluec[states[player]])
        } else {
            fill(redc[0], greenc[0], bluec[0]);
        }

        if (cellShape == 'square') {
            rect(this.posX + edgeThickness, this.posY + edgeThickness, (cellSize - 3 * edgeThickness) / 2, cellSize - 2 * edgeThickness);
        } else if (cellShape == 'ellipse') {
            ellipse(this.posX + edgeThickness, this.posY + edgeThickness, (cellSize - 3 * edgeThickness) / 2, cellSize - 2 * edgeThickness);
        }

        if (showVentricle2) {
            fill(redc[states[player]], greenc[states[player]], bluec[states[player]])
        } else {
            fill(redc[0], greenc[0], bluec[0]);
        }

        if (cellShape == 'square') {
            rect(this.posX + cellSize / 2 + edgeThickness / 2, this.posY + edgeThickness, (cellSize - 3 * edgeThickness) / 2, cellSize - 2 * edgeThickness);
        } else if (cellShape == 'ellipse') {
            ellipse(this.posX + cellSize / 2 + edgeThickness / 2, this.posY + edgeThickness, (cellSize - 3 * edgeThickness) / 2, cellSize - 2 * edgeThickness);
        }

    }

    if (hint || (!hint && this.transitionstate != hintsize)) {
        fill(redc[states[this.nextstate]], greenc[states[this.nextstate]], bluec[states[this.nextstate]]);
        var newsize = this.transitionstate * cellSize / transitionframes;
        if (cellShape == 'square') {
            rectMode(CENTER);
            rect(this.posX + cellSize / 2, this.posY + cellSize / 2, newsize, newsize);
            rectMode(CORNER);
        } else if (cellShape == 'ellipse') {
            ellipseMode(CENTER);
            ellipse(this.posX + cellSize / 2, this.posY + cellSize / 2, newsize, newsize);
            ellipseMode(CORNER);
        }
    }

    if (hint && this.transitionstate >= hintsize) {
        fill(redc[states[this.nextnextstate]], greenc[states[this.nextnextstate]], bluec[states[this.nextnextstate]]);
        var newsize = ((this.transitionstate - hintsize) * cellSize / (transitionframes - hintsize)) / (transitionframes / hintsize);

        if (cellShape == 'square') {
            rectMode(CENTER);
            rect(this.posX + cellSize / 2, this.posY + cellSize / 2, newsize, newsize);
            rectMode(CORNER);
        } else if (cellShape == 'ellipse') {
            ellipseMode(CENTER);
            ellipse(this.posX + cellSize / 2, this.posY + cellSize / 2, newsize, newsize);
            ellipseMode(CORNER);
        }
    }
}

Cell.prototype.changeState = function() {
    if (this.state == 'DEAD') {
        this.nextstate = 'RED';
    } else if (this.state == 'RED') {
        this.nextstate = 'BLUE';
    } else if (this.state == 'BLUE') {
        this.nextstate = 'GRAY';
    } else if (this.state == 'GRAY') {
        this.nextstate = 'DEAD';
    }

    this.nextnextstate = this.nextstate;
    this.transitioning = true;
}

Cell.prototype.addremove = function() {
    if (editingX == -1 && editingY == -1) {
        if (!this.locked) {
            if (this.state == 'DEAD') {
                borning = true;
                prevstate = this.state;
                this.state = player;
            } else {
                prevstate = this.state;
                this.state = 'DEAD';
            }
            editingX = this.numX;
            editingY = this.numY;
            cleanRecord();
        }
    } else if (this.numX == editingX && this.numY == editingY) {
        if (borning) {
            if (shapeTransitions.length == 0) {
                if (ventricle1 != -1) {
                    shapeTransitions.push(new ShapeTransition(this.posX + edgeThickness,
                        this.posY + edgeThickness,
                        cellSize / 2 - edgeThickness,
                        cellSize - 2 * edgeThickness,
                        cells[ventricle1].posX,
                        cells[ventricle1].posY,
                        cellSize, cellSize,
                        0, ventricle1));
                    cells[ventricle1].locked = true;
                    ventricle1 = -1;
                }
                if (ventricle2 != -1) {
                    shapeTransitions.push(new ShapeTransition(this.posX + edgeThickness,
                        this.posY + edgeThickness,
                        cellSize / 2 - edgeThickness,
                        cellSize - 2 * edgeThickness,
                        cells[ventricle2].posX,
                        cells[ventricle2].posY,
                        cellSize, cellSize,
                        0, ventricle2));
                    cells[ventricle2].locked = true;
                    ventricle2 = -1;
                }
                showVentricle1 = false;
                showVentricle2 = false;
                borning = false;
                this.state = prevstate;
                editingX = -1;
                editingY = -1;
                cleanRecord();
            }
        } else {
            this.state = prevstate;
            editingX = -1;
            editingY = -1;
            cleanRecord();
        }
    } else {
        if (borning) {
            if (this.state == player) {
                if (ventricle1 == -1) {
                    this.state = 'DEAD';
                    ventricle1 = this.numY * boardSize + this.numX;
                    shapeTransitions.push(new ShapeTransition(this.posX, this.posY,
                        cellSize, cellSize,
                        editingX * (cellSize + edgeThickness) + edgeThickness,
                        editingY * (cellSize + edgeThickness) + edgeThickness,
                        cellSize / 2, cellSize, 1, -1));
                } else if (ventricle2 == -1) {
                    this.state = 'DEAD';
                    ventricle2 = this.numY * boardSize + this.numX;
                    shapeTransitions.push(new ShapeTransition(this.posX, this.posY,
                        cellSize, cellSize,
                        editingX * (cellSize + edgeThickness) + cellSize / 2 + edgeThickness,
                        editingY * (cellSize + edgeThickness) + edgeThickness,
                        cellSize / 2, cellSize, 2, -1));
                }
                cleanRecord();
            }
        }
    }
}

Cell.prototype.ready = function() {
    this.redneighbors = 0;
    this.blueneighbors = 0;
    this.grayneighbors = 0;

    this.checkcolor(this.numX - 1, this.numY - 1);
    this.checkcolor(this.numX, this.numY - 1);
    this.checkcolor(this.numX + 1, this.numY - 1);
    this.checkcolor(this.numX - 1, this.numY);
    this.checkcolor(this.numX + 1, this.numY);
    this.checkcolor(this.numX - 1, this.numY + 1);
    this.checkcolor(this.numX, this.numY + 1);
    this.checkcolor(this.numX + 1, this.numY + 1);

    this.nextstate = this.checkneighbors(this.state);
}

Cell.prototype.ready2 = function() {
    this.redneighbors = 0;
    this.blueneighbors = 0;
    this.grayneighbors = 0;

    this.checkcolor2(this.numX - 1, this.numY - 1);
    this.checkcolor2(this.numX, this.numY - 1);
    this.checkcolor2(this.numX + 1, this.numY - 1);
    this.checkcolor2(this.numX - 1, this.numY);
    this.checkcolor2(this.numX + 1, this.numY);
    this.checkcolor2(this.numX - 1, this.numY + 1);
    this.checkcolor2(this.numX, this.numY + 1);
    this.checkcolor2(this.numX + 1, this.numY + 1);

    this.nextnextstate = this.checkneighbors(this.nextstate);
}

Cell.prototype.checkcolor = function(x, y) {
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
        var index = y * boardSize + x;
        if (cells[index].state == 'RED') {
            this.redneighbors++;
        } else if (cells[index].state == 'BLUE') {
            this.blueneighbors++;
        } else if (cells[index].state == 'GRAY') {
            this.grayneighbors++;
        }
    }
}

Cell.prototype.checkcolor2 = function(x, y) {
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
        var index = y * boardSize + x;
        if (cells[index].nextstate == 'RED') {
            this.redneighbors++;
        } else if (cells[index].nextstate == 'BLUE') {
            this.blueneighbors++;
        } else if (cells[index].nextstate == 'GRAY') {
            this.grayneighbors++;
        }
    }
}

Cell.prototype.checkneighbors = function(defaultstate) {
    var totalNeighbors = this.redneighbors + this.blueneighbors + this.grayneighbors;
    if (defaultstate == 'DEAD') {
        if (birth.indexOf(totalNeighbors) >= 0) {
            if (this.redneighbors > this.blueneighbors) {
                return 'RED';
            } else if (this.blueneighbors > this.redneighbors) {
                return 'BLUE';
            } else {
                return 'GRAY';
            }
        } else {
            return 'DEAD';
        }
    } else {
        if (survive.indexOf(totalNeighbors) >= 0) {
            return defaultstate;
        } else {
            return 'DEAD';
        }
    }
}

Cell.prototype.transition = function() {
    if (!animations) {
        this.transitionstate = transitionframes;
    }

    this.transitionstate++;

    if (this.transitionstate > transitionframes) {
        this.state = this.nextstate;
        this.transitionstate = hintsize;
        this.transitioning = false;
    }
}

Cell.prototype.clicked = function(x, y) {
    if (x >= this.posX && x <= this.posX + cellSize && y >= this.posY && y <= this.posY + cellSize && !this.transitioning) {
        return true;
    } else {
        return false;
    }
}

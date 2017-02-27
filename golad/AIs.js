var aiTransitionFrames = 14;
var AIanimation;
var startAI;

function playAI(team, type) {

    this.waiting = 0;

    this.nextframe = function() {
        this.waiting++;
    }

    this.continue = function() {
        var AImove;

        if(type == 'dumb'){
          AImove = dumbAI(team);
        } else if (type == 'okay') {
            AImove = okayAI(team);
        } else if (type == 'smart') {
            AImove = smartAI(team);
        }

        AIanimation = new AItransition(AImove[0], AImove[1], AImove[2]);
    }
}

function AItransition(cell1, cell2, cell3) {


    this.cell1 = cell1;
    this.cell2 = cell2;
    this.cell3 = cell3;

    this.waiting = false;
    this.cell1state = false;
    this.aiframe = 0;

    if (cell2 == -1 && cell3 == -1) {
        this.cell2state = true;
        this.cell3state = true;
    } else {
        this.cell2state = false;
        this.cell3state = false;
    }

    this.finishstate = false;
    this.xi = boardDimension;
    this.yi = boardDimension / 2;

    this.currentX = this.xi;
    this.currentY = this.yi;

    this.nextframe = function() {

        fill(255);

        if (!this.waiting) {

            this.aiframe++;

            if (this.aiframe > aiTransitionFrames) {
                this.waiting = true;
                this.aiframe = 0;
            }

        } else if (this.cell1state == false) {

            ellipseMode(CENTER);
            ellipse(this.currentX, this.currentY, cellSize / 3, cellSize / 3);
            ellipseMode(CORNER);

            this.currentX = this.xi + (cells[cell1].posX + cellSize / 2 - this.xi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;
            this.currentY = this.yi + (cells[cell1].posY + cellSize / 2 - this.yi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;

            this.aiframe++;

            if (this.aiframe > aiTransitionFrames) {
                cells[cell1].addremove();
                this.cell1state = true;
                this.aiframe = 0;
                this.xi = this.currentX;
                this.yi = this.currentY;
            }

        } else if (this.cell2state == false) {

            ellipseMode(CENTER);
            ellipse(this.currentX, this.currentY, cellSize / 3, cellSize / 3);
            ellipseMode(CORNER);

            this.currentX = this.xi + (cells[cell2].posX + cellSize / 2 - this.xi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;
            this.currentY = this.yi + (cells[cell2].posY + cellSize / 2 - this.yi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;

            this.aiframe++;

            if (this.aiframe > aiTransitionFrames) {
                cells[cell2].addremove();
                this.cell2state = true;
                this.aiframe = 0;
                this.xi = this.currentX;
                this.yi = this.currentY;
            }

        } else if (this.cell3state == false) {

            ellipseMode(CENTER);
            ellipse(this.currentX, this.currentY, cellSize / 3, cellSize / 3);
            ellipseMode(CORNER);

            this.currentX = this.xi + (cells[cell3].posX + cellSize / 2 - this.xi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;
            this.currentY = this.yi + (cells[cell3].posY + cellSize / 2 - this.yi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;

            this.aiframe++;

            if (this.aiframe > aiTransitionFrames) {
                cells[cell3].addremove();
                this.cell3state = true;
                this.aiframe = 0;
                this.xi = this.currentX;
                this.yi = this.currentY;
            }

        } else if (this.finishstate == false) {

            ellipseMode(CENTER);
            ellipse(this.currentX, this.currentY, cellSize / 3, cellSize / 3);
            ellipseMode(CORNER);

            this.currentX = this.xi + (boardDimension - this.xi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;
            this.currentY = this.yi + (boardDimension / 2 - this.yi) * (1 + sin(-PI / 2 + PI * this.aiframe / aiTransitionFrames)) / 2;

            this.aiframe++;

            if (this.aiframe > aiTransitionFrames) {
                this.finishstate = true;
            }
        }
    }
}

function dumbAI(AIteam) {
    var greatestFertility = -1;
    var bestCell = -1;

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].state != 'DEAD') {
            var tempc = cells[i].state;
            cells[i].state = 'DEAD';
            cells[i].ready2();

            if (AIteam == 'RED') {
                if (cells[i].blueneighbors > greatestFertility) {
                    greatestFertility = cells[i].blueneighbors;
                    bestCell = i;
                }
            } else if (AIteam == 'BLUE') {
                if (cells[i].redneighbors > greatestFertility) {
                    greatestFertility = cells[i].redneighbors;
                    bestCell = i;
                }
            }
            cells[i].state = tempc;
        }
    }
    countCells2();
    getReady();
    getReady2();
    return [bestCell, -1, -1, greatestFertility];
}


function okayAI(AIteam) {
    var bestRatio = -1;
    var bestCell = -1;
    var bestVentricle1 = -1;
    var bestVentricle2 = -1;
    var useVentricles = false;

    //Selecting the best ventricles
    for (var m = 0; m < cells.length - 1; m++) {

        if (cells[m].state == AIteam) {

            var tempventr1 = cells[m].state;
            cells[m].state = 'DEAD';

            for (var n = m + 1; n < cells.length; n++) {

                if (cells[n].state == AIteam) {

                    var tempventr2 = cells[n].state;
                    cells[n].state = 'DEAD';

                    getReady();
                    countCells();

                    if (redcells == 0 && bluecells == 0) {
                        if (bestRatio == -1 || bestRatio == 0) {
                            bestRatio = 0;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    } else if (AIteam == 'RED') {
                        if (redcells / bluecells > bestRatio) {
                            bestRatio = redcells / bluecells;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    } else if (AIteam == 'BLUE') {
                        if (bluecells / redcells > bestRatio) {
                            bestRatio = bluecells / redcells;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    }
                    cells[n].state = tempventr2;
                }
            }
            cells[m].state = tempventr1;
        }
    }

    bestRatio = -1;

    for (var i = 0; i < cells.length; i++) {

        if (cells[i].state == 'DEAD') {

            if (bestVentricle1 != -1 && bestVentricle2 != -1) {

                var tempc = cells[i].state;
                cells[i].state = AIteam;
                cells[bestVentricle1].state = 'DEAD';
                cells[bestVentricle2].state = 'DEAD';

                getReady();
                countCells();

                if (redcells == 0 && bluecells == 0) {
                    if (bestRatio == -1 || bestRatio == 0) {
                        bestRatio = 0;
                        bestCell = i;
                        useVentricles = true;
                    }
                } else if (AIteam == 'RED') {
                    if (redcells / bluecells > bestRatio) {
                        bestRatio = redcells / bluecells;
                        bestCell = i;
                        useVentricles = true;
                    }
                } else if (AIteam == 'BLUE') {
                    if (bluecells / redcells > bestRatio) {
                        bestRatio = bluecells / redcells;
                        bestCell = i;
                        useVentricles = true;
                    }
                }

                cells[i].state = tempc;
                cells[bestVentricle1].state = AIteam;
                cells[bestVentricle2].state = AIteam;
            }

        } else {

            var tempc = cells[i].state;
            cells[i].state = 'DEAD';

            getReady();
            countCells();

            if (redcells == 0 && bluecells == 0) {
                if (bestRatio == -1 || bestRatio == 0) {
                    bestRatio = 0;
                    bestCell = i;
                    useVentricles = false;
                }
            } else if (AIteam == 'RED') {
                if (redcells / bluecells > bestRatio) {
                    bestRatio = redcells / bluecells;
                    bestCell = i;
                    useVentricles = false;
                }
            } else if (AIteam == 'BLUE') {
                if (bluecells / redcells > bestRatio) {
                    bestRatio = bluecells / redcells;
                    bestCell = i;
                    useVentricles = false;
                }
            }
            cells[i].state = tempc;
        }
    }

    if (!useVentricles) {
        bestVentricle1 = -1;
        bestVentricle2 = -1;
    }

    countCells2();
    getReady();
    getReady2();
    return [bestCell, bestVentricle1, bestVentricle2, bestRatio];
}


function smartAI(AIteam) {
    var bestRatio = -1;
    var bestCell = -1;
    var bestVentricle1 = -1;
    var bestVentricle2 = -1;
    var useVentricles = false;

    //Selecting the best ventricles
    for (var m = 0; m < cells.length - 1; m++) {

        if (cells[m].state == AIteam) {

            var tempventr1 = cells[m].state;
            cells[m].state = 'DEAD';

            for (var n = m + 1; n < cells.length; n++) {

                if (cells[n].state == AIteam) {

                    var tempventr2 = cells[n].state;
                    cells[n].state = 'DEAD';

                    getReady();
                    getReady2();
                    countCells3();

                    if (redcells == 0 && bluecells == 0) {
                        if (bestRatio == -1 || bestRatio == 0) {
                            bestRatio = 0;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    } else if (AIteam == 'RED') {
                        if (redcells / bluecells > bestRatio) {
                            bestRatio = redcells / bluecells;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    } else if (AIteam == 'BLUE') {
                        if (bluecells / redcells > bestRatio) {
                            bestRatio = bluecells / redcells;
                            bestVentricle1 = m;
                            bestVentricle2 = n;
                        }
                    }
                    cells[n].state = tempventr2;
                }
            }
            cells[m].state = tempventr1;
        }
    }

    bestRatio = -1;

    for (var i = 0; i < cells.length; i++) {

        if (cells[i].state == 'DEAD') {

            if (bestVentricle1 != -1 && bestVentricle2 != -1) {

                var tempc = cells[i].state;
                cells[i].state = AIteam;
                cells[bestVentricle1].state = 'DEAD';
                cells[bestVentricle2].state = 'DEAD';

                getReady();
                getReady2();
                countCells3();

                if (redcells == 0 && bluecells == 0) {
                    if (bestRatio == -1 || bestRatio == 0) {
                        bestRatio = 0;
                        bestCell = i;
                        useVentricles = true;
                    }
                } else if (AIteam == 'RED') {
                    if (redcells / bluecells > bestRatio) {
                        bestRatio = redcells / bluecells;
                        bestCell = i;
                        useVentricles = true;
                    }
                } else if (AIteam == 'BLUE') {
                    if (bluecells / redcells > bestRatio) {
                        bestRatio = bluecells / redcells;
                        bestCell = i;
                        useVentricles = true;
                    }
                }

                cells[i].state = tempc;
                cells[bestVentricle1].state = AIteam;
                cells[bestVentricle2].state = AIteam;
            }

        } else {

            var tempc = cells[i].state;
            cells[i].state = 'DEAD';

            getReady();
            getReady2();
            countCells3();

            if (redcells == 0 && bluecells == 0) {
                if (bestRatio == -1 || bestRatio == 0) {
                    bestRatio = 0;
                    bestCell = i;
                    useVentricles = false;
                }
            } else if (AIteam == 'RED') {
                if (redcells / bluecells > bestRatio) {
                    bestRatio = redcells / bluecells;
                    bestCell = i;
                    useVentricles = false;
                }
            } else if (AIteam == 'BLUE') {
                if (bluecells / redcells > bestRatio) {
                    bestRatio = bluecells / redcells;
                    bestCell = i;
                    useVentricles = false;
                }
            }
            cells[i].state = tempc;
        }
    }

    if (!useVentricles) {
        bestVentricle1 = -1;
        bestVentricle2 = -1;
    }

    countCells2();
    getReady();
    getReady2();
    return [bestCell, bestVentricle1, bestVentricle2, bestRatio];
}


// function AIengine(deepness, AIteam) {
//
//     var bestRatio = -1;
//     var bestCell = -1;
//     var bestVentricle1 = -1;
//     var bestVentricle2 = -1;
//     var useVentricles = false;
//
//     //Selecting the best ventricles
//     for (var m = 0; m < cells.length - 1; m++) {
//
//         if (cells[m].state == AIteam) {
//
//             var tempventr1 = cells[m].state;
//             cells[m].state = 'DEAD';
//
//             for (var n = m + 1; n < cells.length; n++) {
//
//                 if (cells[n].state == AIteam) {
//
//                     var tempventr2 = cells[n].state;
//                     cells[n].state = 'DEAD';
//
//                     getReady();
//                     countCells();
//
//                     if (redcells == 0 && bluecells == 0) {
//                         if (bestRatio == -1 || bestRatio == 0) {
//                             bestRatio = 0;
//                             bestVentricle1 = m;
//                             bestVentricle2 = n;
//                         }
//                     } else if (AIteam == 'RED') {
//                         if (redcells / bluecells > bestRatio) {
//                             bestRatio = redcells / bluecells;
//                             bestVentricle1 = m;
//                             bestVentricle2 = n;
//                         }
//                     } else if (AIteam == 'BLUE') {
//                         if (bluecells / redcells > bestRatio) {
//                             bestRatio = bluecells / redcells;
//                             bestVentricle1 = m;
//                             bestVentricle2 = n;
//                         }
//                     }
//                     cells[n].state = tempventr2;
//                 }
//             }
//             cells[m].state = tempventr1;
//         }
//     }
//
//     bestRatio = -1;
//
//     for (var i = 0; i < cells.length; i++) {
//
//         if (cells[i].state == 'DEAD') {
//
//             if (bestVentricle1 != -1 && bestVentricle2 != -1) {
//
//                 var tempc = cells[i].state;
//                 cells[i].state = AIteam;
//                 cells[bestVentricle1].state = 'DEAD';
//                 cells[bestVentricle2].state = 'DEAD';
//
//                 getReady();
//
//                 if (deepness > 0) {
//
//                     var tempstate = [];
//
//                     for (var k = 0; k < cells.length; k++) {
//                         tempstate[k] = cells[k].state;
//                         cells[k].state = cells[k].nextstate;
//                     }
//
//                     var newRatio = AIengine(deepness - 1, AIteam)[3];
//
//                     if (newRatio == -1) {
//                         if (bestRatio == -1 || bestRatio == 0) {
//                             bestRatio = 0;
//                             bestCell = i;
//                             useVentricles = true;
//                         }
//                     } else if (newRatio > bestRatio) {
//                         bestRatio = newRatio;
//                         bestCell = i;
//                         useVentricles = true;
//                     }
//
//                     for (var k = 0; k < cells.length; k++) {
//                         cells[k].state = tempstate[k];
//                     }
//
//                 } else {
//
//                     countCells();
//
//                     if (redcells == 0 && bluecells == 0) {
//                         if (bestRatio == -1 || bestRatio == 0) {
//                             bestRatio = 0;
//                             bestCell = i;
//                             useVentricles = true;
//                         }
//                     } else if (AIteam == 'RED') {
//                         if (redcells / bluecells > bestRatio) {
//                             bestRatio = redcells / bluecells;
//                             bestCell = i;
//                             useVentricles = true;
//                         }
//                     } else if (AIteam == 'BLUE') {
//                         if (bluecells / redcells > bestRatio) {
//                             bestRatio = bluecells / redcells;
//                             bestCell = i;
//                             useVentricles = true;
//                         }
//                     }
//
//                 }
//                 cells[i].state = tempc;
//                 cells[bestVentricle1].state = AIteam;
//                 cells[bestVentricle2].state = AIteam;
//             }
//
//         } else {
//
//             var tempc = cells[i].state;
//             cells[i].state = 'DEAD';
//
//             getReady();
//
//             if (deepness > 0) {
//
//                 var tempstate = [];
//                 for (var k = 0; k < cells.length; k++) {
//                     tempstate[k] = cells[k].state;
//                     cells[k].state = cells[k].nextstate;
//                 }
//
//                 var newRatio = AIengine(deepness - 1, AIteam)[3];
//
//                 if (newRatio == -1) {
//                     if (bestRatio == -1 || bestRatio == 0) {
//                         bestRatio = 0;
//                         bestCell = i;
//                         useVentricles = false;
//                     }
//                 } else if (newRatio > bestRatio) {
//                     bestRatio = newRatio;
//                     bestCell = i;
//                     useVentricles = false;
//                 }
//
//                 for (var k = 0; k < cells.length; k++) {
//                     cells[k].state = tempstate[k];
//                 }
//
//             } else {
//
//                 countCells();
//
//                 if (redcells == 0 && bluecells == 0) {
//                     if (bestRatio == -1 || bestRatio == 0) {
//                         bestRatio = 0;
//                         bestCell = i;
//                         useVentricles = false;
//                     }
//                 } else if (AIteam == 'RED') {
//                     if (redcells / bluecells > bestRatio) {
//                         bestRatio = redcells / bluecells;
//                         bestCell = i;
//                         useVentricles = false;
//                     }
//                 } else if (AIteam == 'BLUE') {
//                     if (bluecells / redcells > bestRatio) {
//                         bestRatio = bluecells / redcells;
//                         bestCell = i;
//                         useVentricles = false;
//                     }
//                 }
//             }
//             cells[i].state = tempc;
//         }
//     }
//
//     if (!useVentricles) {
//         bestVentricle1 = -1;
//         bestVentricle2 = -1;
//     }
//
//     getReady();
//     getReady2();
//     countCells2();
//     return [bestCell, bestVentricle1, bestVentricle2, bestRatio];
// }


// function okayAI2(AIteam) {
//     var bestRatio = 0;
//     var bestCell = -1;
//     var bestVentricle1 = -1;
//     var bestVentricle2 = -1;
//
//     for (var i = 0; i < cells.length; i++) {
//         if (cells[i].state == 'DEAD') {
//             var tempc = cells[i].state;
//             cells[i].state = AIteam;
//
//             for (var m = 0; m < cells.length - 1; m++) {
//
//                 if (m != i && cells[m].state == AIteam) {
//
//                     var tempventr1 = cells[m].state;
//                     cells[m].state = 'DEAD';
//
//                     for (var n = m + 1; n < cells.length; n++) {
//
//                         if (n != i && cells[n].state == AIteam) {
//
//                             var tempventr2 = cells[n].state;
//                             cells[n].state = 'DEAD';
//
//                             for (var j = 0; j < cells.length; j++) {
//                                 cells[j].ready();
//                             }
//
//                             countCells();
//
//                             if (redcells == 0 && bluecells == 0) {
//                                 if (bestRatio == -1 || bestRatio == 0) {
//                                     bestRatio = 0;
//                                     bestCell = i;
//                                     bestVentricle1 = m;
//                                     bestVentricle2 = n;
//                                 }
//                             } else if (AIteam == 'RED') {
//                                 if (redcells / bluecells > bestRatio) {
//                                     bestRatio = redcells / bluecells;
//                                     bestCell = i;
//                                     bestVentricle1 = m;
//                                     bestVentricle2 = n;
//                                 }
//                             } else if (AIteam == 'BLUE') {
//                                 if (bluecells / redcells > bestRatio) {
//                                     bestRatio = bluecells / redcells;
//                                     bestCell = i;
//                                     bestVentricle1 = m;
//                                     bestVentricle2 = n;
//                                 }
//                             }
//
//                             cells[n].state = tempventr2;
//                         }
//                     }
//                     cells[m].state = tempventr1;
//                 }
//             }
//             cells[i].state = tempc;
//         } else {
//
//             var tempc = cells[i].state;
//             cells[i].state = 'DEAD';
//
//             for (var j = 0; j < cells.length; j++) {
//                 cells[j].ready();
//             }
//
//             countCells();
//
//             if (redcells == 0 && bluecells == 0) {
//                 if (bestRatio == -1 || bestRatio == 0) {
//                     bestRatio = 0;
//                     bestCell = i;
//                     bestVentricle1 = -1;
//                     bestVentricle2 = -1;
//                 }
//             } else if (AIteam == 'RED') {
//                 if (redcells / bluecells > bestRatio) {
//                     bestRatio = redcells / bluecells;
//                     bestCell = i;
//                     bestVentricle1 = -1;
//                     bestVentricle2 = -1;
//                 }
//             } else if (AIteam == 'BLUE') {
//                 if (bluecells / redcells > bestRatio) {
//                     bestRatio = bluecells / redcells;
//                     bestCell = i;
//                     bestVentricle1 = -1;
//                     bestVentricle2 = -1;
//                 }
//             }
//             cells[i].state = tempc;
//         }
//     }
//     countCells2();
//     console.log(bestCell + ' ' + bestVentricle1 + ' ' + bestVentricle2 + ' ' + bestRatio);
// }

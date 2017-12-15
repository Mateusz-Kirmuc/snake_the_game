var VisibleBoardCell = function(row, cell) {
  this.row = row;
  this.cell = cell;
  this.showOnBoard();
};
VisibleBoardCell.prototype.getBoardCellIdSelector = function() {
  return "#" + this.row + "_" + this.cell;
};
VisibleBoardCell.prototype.getBoardCellElementObject = function() {
  return $(this.getBoardCellIdSelector());
};

VisibleBoardCell.prototype.isOutsideTheBoard = function() {
  /* Method returns true when coordinates (row and cell number) of this VisibleBoardCell
  instance confirms that it is inside the board.
  Otherwise, method returns false. */
  if (this.row < 0 ||
    this.row > appViewModel.numberOfRows() - 1 ||
    this.cell < 0 ||
    this.cell > appViewModel.numberOfCellInRow() - 1) {
    console.log("new head is outside the board!");
    return true;
  }
  return false;
};
VisibleBoardCell.prototype.overlapsWith = function(board_cell) {
  /* Method returns true when this visible board cell overlaps with other visible
  board cell.*/
  if (this.row == board_cell.row && this.cell == board_cell.cell) {
    return true;
  }
  return false;
};

VisibleBoardCell.prototype.isInsideTheBodyOf = function(bodyList) {
  /* Method returns true, when object with indentical row/cell coordinates to new
  VisibleBoardCell instance already exists in snake bodyList. */
  for (var cell of bodyList) {
    if (this.row == cell.row && this.cell == cell.cell) {
      console.log("new head inside snake body!");
      return true;
    }
  }
  return false;
};

VisibleBoardCell.prototype.showOnBoard = function() {
  this.getBoardCellElementObject().addClass("visible-cell");
};

VisibleBoardCell.prototype.removeFromBoard = function() {
  this.getBoardCellElementObject().removeClass("visible-cell");
};

Array.prototype.removeTail = function() {
  var tail = this.shift();
  tail.removeFromBoard();
};

Array.prototype.replaceHeadWith = function(new_head) {
  this.push(new_head);
};

Array.prototype.removeSnake = function() {
  var snakeBody = this;
  for (cell of snakeBody) {
    cell.removeFromBoard();
  }
};

var AppViewModel = function() {
  var self = this;
  self.onPlay = ko.observable(false);
  self.message = ko.observable("Hit 'Start Game' button to start!");
  self.numberOfRows = ko.observable(30);
  self.numberOfCellInRow = ko.observable(30);
  self.cellSize = ko.observable("10px");
  self.boardSizes = ["small", "medium", "large"];
  self.selectedBoardSize = ko.observable();
  self.screenWidth = ko.observable($(window).width());
  self.direction = ko.observable("down");
  self.item = ko.observable(new VisibleBoardCell(10, 10));

  self.createSnake = function() {
    self.snake = [
      new VisibleBoardCell(0, 0),
      new VisibleBoardCell(0, 1),
      new VisibleBoardCell(0, 2),
      new VisibleBoardCell(0, 3),
      new VisibleBoardCell(0, 4),
      new VisibleBoardCell(0, 5)
    ];
  };

  self.changeBoardSize = function() {
    if (self.selectedBoardSize() == "small") {
      self.numberOfCellInRow(30);
    }
    if (self.selectedBoardSize() == "medium") {
      self.numberOfCellInRow(60);
    }
    if (self.selectedBoardSize() == "large") {
      self.numberOfCellInRow(90);
    }
  };

  self.moveSnake = function() {
    var old_head = _.last(self.snake);
    var new_head;
    if (self.direction() == "right") {
      new_head = new VisibleBoardCell(old_head.row, old_head.cell + 1);
    }
    if (self.direction() == "left") {
      new_head = new VisibleBoardCell(old_head.row, old_head.cell - 1);
    }
    if (self.direction() == "down") {
      new_head = new VisibleBoardCell(old_head.row + 1, old_head.cell);
    }
    if (self.direction() == "up") {
      new_head = new VisibleBoardCell(old_head.row - 1, old_head.cell);
    }
    if (new_head.isOutsideTheBoard() ||
      new_head.isInsideTheBodyOf(this.snake)) {
      self.handleGameOver();
      return;
    }
    if (!new_head.overlapsWith(self.item())) {
      self.snake.removeTail();
    }
    self.snake.replaceHeadWith(new_head);
  };

  self.handleArrowEvent = function(data, event) {
    // when game is over dont handle any arrow event
    if (!self.onPlay()) {
      return;
    }

    if (event.target.className == "right" || event.key == "ArrowRight") {
      self.direction("right");
    }
    if (event.target.className == "left" || event.key == "ArrowLeft") {
      self.direction("left");
    }
    if (event.target.className == "down" || event.key == "ArrowDown") {
      self.direction("down");
    }
    if (event.target.className == "up" || event.key == "ArrowUp") {
      self.direction("up");
    }
    self.moveSnake();
  };

  self.handleStartGame = function() {
    self.onPlay(true);
    self.createSnake();
    self.direction("right");
    self.interval = startSnakeMoveInterval(500);
  };
  self.handleGameOver = function() {
    self.onPlay(false);
    self.snake.removeSnake();
    self.message("Game Over! Hit 'Start Game' button to start again!");
    stopSnakeMoveInterval(self.interval);
  };
};

var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);

$(window).resize(function() {
  appViewModel.screenWidth($(window).width());
});

$(document).keydown(function(event) {
  appViewModel.handleArrowEvent(undefined, event);
});

/*
  Function implements independent snake movement, once every {milisec}
  miliseconds.
*/
var startSnakeMoveInterval = function(milisec) {
  return setInterval(function() {
    appViewModel.moveSnake();
  }, milisec);
};

var stopSnakeMoveInterval = function(intervalObject) {
  clearInterval(intervalObject);
};

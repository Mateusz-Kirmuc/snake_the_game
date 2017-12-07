
var SnakeCell = function(row, cell) {
  this.row = row;
  this.cell = cell;
};
SnakeCell.prototype.getBoardCellIdSelector = function(){
  return "#" + this.row + "_" + this.cell;
};
SnakeCell.prototype.getBoardCellElementObject = function() {
  return $(this.getBoardCellIdSelector());
};
/*
  Method returns true when coordinates (row and cell number) of this SnakeCell
  instance confirms that it is inside the board.
  Otherwise, method returns false.
*/
SnakeCell.prototype.isInsideTheBoard = function() {
  if (this.row < 0 ||
    this.row > appViewModel.numberOfRows() - 1 ||
    this.cell < 0 ||
    this.cell > appViewModel.numberOfCellInRow() - 1){
      return true;
  }
  return false;
};

var AppViewModel = function() {
  var self = this;
  self.numberOfRows = ko.observable(30);
  self.numberOfCellInRow = ko.observable(30);
  self.cellSize = ko.observable("10px");
  self.boardSizes = ["small", "medium", "large"];
  self.selectedBoardSize = ko.observable();
  self.screenWidth = ko.observable($(window).width());
  self.direction = ko.observable("down");
  self.snakeBody = ko.observableArray([
    new SnakeCell(0,0),
    new SnakeCell(0,1),
    new SnakeCell(0,2),
    new SnakeCell(0,3),
    new SnakeCell(0,4),
    new SnakeCell(0,5)
  ]);

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
  self.drawSnake = function() {
    for (const cell of self.snakeBody()) {
      cell.getBoardCellElementObject().toggleClass("snakeCell");
    }
  };
  self.moveSnake = function() {
    var old_tail = self.snakeBody.shift();
    var old_head = _.last(self.snakeBody());
    var new_head;
    if (self.direction() == "right") {
      new_head = new SnakeCell(old_head.row, old_head.cell + 1);
    }
    if (self.direction() == "left") {
      new_head = new SnakeCell(old_head.row, old_head.cell - 1);
    }
    if (self.direction() == "down") {
      new_head = new SnakeCell(old_head.row + 1, old_head.cell);
    }
    if (self.direction() == "up") {
      new_head = new SnakeCell(old_head.row - 1, old_head.cell);
    }
    new_head.isInsideTheBoard();
    self.snakeBody.push(new_head);
    new_head.getBoardCellElementObject().toggleClass("snakeCell");
    old_tail.getBoardCellElementObject().toggleClass("snakeCell");
  };
  self.handleArrowEvent = function(data, event){
    if (event.target.className == "right" || event.key == "ArrowRight"){
      self.direction("right");
    }
    if (event.target.className == "left" || event.key == "ArrowLeft"){
      self.direction("left");
    }
    if (event.target.className == "down" || event.key == "ArrowDown"){
      self.direction("down");
    }
    if (event.target.className == "up" || event.key == "ArrowUp"){
      self.direction("up");
    }
    self.moveSnake();
  };
};

var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);

$(window).resize(function() {
  appViewModel.screenWidth($(window).width());
});

$(document).keydown(function(event){
  appViewModel.handleArrowEvent(undefined, event);
});

appViewModel.drawSnake();

/*
  Method implements independent snake movement, once every {milisec}
  miliseconds.
*/
var startSnakeMoveInterval = function(milisec) {
  return setInterval(function(){
    appViewModel.moveSnake();
  }, milisec);
};

var stopSnakeMoveInterval = function(intervalObject) {
  clearInterval(intervalObject);
};

var interval = startSnakeMoveInterval(500);

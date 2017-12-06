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
    {row: 0, cell: 0},
    {row: 0, cell: 1},
    {row: 0, cell: 2},
    {row: 0, cell: 3},
    {row: 0, cell: 4},
    {row: 0, cell: 5}
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
  self.isInSnakeBody = function(row, cell) {
    for (var snakeCell of this.snakeBody()) {
      if (row == snakeCell.row && cell == snakeCell.cell){
        return true;
      }
    }
    return false;
  };
  self.moveSnake = function() {
    self.snakeBody.shift();
    var head = _.last(self.snakeBody());
    if (self.direction() == "right") {
      self.snakeBody().push(
        {row: head.row, cell: head.cell + 1}
      );
    }
    if (self.direction() == "left") {
      self.snakeBody().push(
        {row: head.row, cell: head.cell - 1}
      );
    }
    if (self.direction() == "down") {
      self.snakeBody().push(
        {row: head.row + 1, cell: head.cell}
      );
    }
    if (self.direction() == "up") {
      self.snakeBody().push(
        {row: head.row - 1, cell: head.cell}
      );
    }
  };
};
var appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);
$(window).resize(function() {
  appViewModel.screenWidth($(window).width());
});
appViewModel.moveSnake();
appViewModel.moveSnake();
appViewModel.moveSnake();

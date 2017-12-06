/*jshint esversion: 6 */
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
    {row: 0, cell: 0, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}},
    {row: 0, cell: 1, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}},
    {row: 0, cell: 2, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}},
    {row: 0, cell: 3, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}},
    {row: 0, cell: 4, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}},
    {row: 0, cell: 5, getCellIdSelector: function() {return `#${this.row}_${this.cell}`}}
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
      $(cell.getCellIdSelector()).toggleClass("snakeCell");
    }
  };
  self.moveSnake = function() {
    const old_tail = self.snakeBody.shift();
    const old_head = _.last(self.snakeBody());
    let new_head;
    if (self.direction() == "right") {
      new_head = {
        row: old_head.row,
        cell: old_head.cell + 1,
        getCellIdSelector: function() {return `#${this.row}_${this.cell}`}
      };
    }
    if (self.direction() == "left") {
      new_head = {
        row: old_head.row,
        cell: old_head.cell - 1,
        getCellIdSelector: function() {return `#${this.row}_${this.cell}`}
      };
    }
    if (self.direction() == "down") {
      new_head = {
        row: old_head.row + 1,
        cell: old_head.cell,
        getCellIdSelector: function() {return `#${this.row}_${this.cell}`}
      };
    }
    if (self.direction() == "up") {
      new_head = {
        row: old_head.row - 1,
        cell: old_head.cell,
        getCellIdSelector: function() {return `#${this.row}_${this.cell}`}
      };
    }
    self.snakeBody.push(new_head);
    $(new_head.getCellIdSelector()).toggleClass("snakeCell");
    $(old_tail.getCellIdSelector()).toggleClass("snakeCell");
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

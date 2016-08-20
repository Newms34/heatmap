var app = angular.module('heatApp', [])
app.controller('heat-con', function($scope, $http, $q) {
    $scope.ready = false;
    $scope.w = 0;
    $scope.h = 0;
    $scope.cells = [];
    var fld = $('#field')
    $scope.cell = function(y, x, col) {
        this.x = x;
        this.y = y;
        this.col = col;
    }
    bootbox.prompt('Size (width and height)?', function(e) {
        $scope.w = parseInt(e);
        $scope.h = parseInt(e);
        for (var i = 0; i < $scope.h; i++) {
            var newRow = [];
            for (var j = 0; j < $scope.w; j++) {
                newRow.push(new $scope.cell(i, j, 0))
            }
            $scope.cells.push(newRow);
        }
        console.log($scope.cells)
        $scope.$digest();
    });
    $scope.getCol = function(c, m) {
        if (m) {
            return 'hsl(' + (40 * 100 / 100) + ',100%,' + (70 * (100 - c) / 100) + '%)'
        }
        return 'hsl(' + (40 * c / 100) + ',100%,' + (70 * c / 100) + '%)';
    }
    $scope.heating = false;
    $scope.heatTarg = null;
    $scope.cellheats = function() {
        for (var y = 0; y < $scope.cells.length; y++) {
            for (var x = 0; x < $scope.cells.length; x++) {
                var highestTemp = $scope.cells[y][x].col; //hottest cell defaults to this cell
                var hotCell = [y, x];
                //now we find the hottest neighboring cell;
                for (var dy = -1; dy < 2; dy++) {
                    for (var dx = -1; dx < 2; dx++) {
                        if ($scope.cells[dy + y] && $scope.cells[dy + y][dx + x] && $scope.cells[dy + y][dx + x].col > highestTemp) {
                            //cell exists!
                            highestTemp = $scope.cells[dy + y][dx + x].col;
                            hotCell = [dy + y, dx + x];
                        }
                    }
                }
                if (hotCell[0] == y && hotCell[1] == x && $scope.cells[y][x].col > 0) {
                    //this is the hottest cell!
                    //no change
                    $scope.cells[y][x].col -= 0;
                } else if ($scope.cells[hotCell[0]][hotCell[1]].col > 0 && hotCell[0] != y && hotCell[1] != x) {
                    console.log("HEATING CELL", hotCell[0], y, hotCell[1], x)
                        //this is not the hottest cell
                    $scope.cells[y][x].col += .5;
                    $scope.cells[hotCell[0]][hotCell[1]].col -= .5;
                }
                if ($scope.cells[y][x].col < 0) {
                    $scope.cells[y][x].col == 0;
                }
            }
        }
    }
    $scope.t = setInterval(function() {
        if ($scope.heating) {
            var pos = $scope.heatTarg.id.split('-');
            console.log($scope.heatTarg, pos)
            console.log('Heating cell at', pos, $scope.cells[pos[1]][pos[0]].col)
            $scope.cells[pos[1]][pos[0]].col < 100 ? $scope.cells[pos[1]][pos[0]].col += 5 : $scope.cells[pos[1]][pos[0]].col = 100;
            for (var dy = -1; dy < 2; dy++) {
                for (var dx = -1; dx < 2; dx++) {
                    if ($scope.cells[pos[1]+dy] && $scope.cells[pos[1]+dy][pos[0]+dx]){
                        $scope.cells[pos[1]+dy][pos[0]+dx]+2;
                    }
                }
            }
        }
        $scope.cellheats();
        $scope.$digest();
    }, 50);
    fld.on('click', function(e) {
        if (!$scope.heating && e.button == 0 && document.elementFromPoint((e.x || e.clientX), (e.y || e.clientY)).className.indexOf('cell') != -1) {
            $scope.heating = true;
            $scope.heatTarg = document.elementFromPoint((e.x || e.clientX));
        } else {
            $scope.heating = false;
            $scope.heatTarg = null;
        }
    });
    fld.on('mousemove', function(e) {
        if (document.elementFromPoint((e.x || e.clientX), (e.y || e.clientY)).className.indexOf('cell') != -1) {
            $scope.heatTarg = document.elementFromPoint((e.x || e.clientX), (e.y || e.clientY));
        }
    });
    $scope.floor = function(n) {
        return Math.floor(n);
    }
    $scope.getRHeight = function(n) {
        return $('#row' + n).height();
    }
});

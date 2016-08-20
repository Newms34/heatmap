var app = angular.module('heatApp', [])
app.controller('heat-con', function($scope, $http, $q) {
    $scope.ready = false;
    $scope.w = 0;
    $scope.h = 0;
    $scope.cells = [];
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
    $scope.cellheats=function(){
        for (var y=0;y<$scope.cells.length;y++){
            for (var x=0;x<$scope.cells.length;x++){
                var highestTemp = $scope.cells[y][x].col;//hottest cell defaults to this cell
                var hotCell = [y,x];
                //now we find the hottest neighboring cell;
                for(var dy = -1;dy<2;dy++){
                    for(var dx = -1;dx<2;dx++){
                        if($scope.cells[dy+y] && $scope.cells[dy+y][dx+x] && $scope.cells[dy+y][dx+x].col>highestTemp){
                            //cell exists!
                            highestTemp = $scope.cells[dy+y][dx+x].col;
                            hotCell = [dy+y,dx+x];
                        }
                    }
                }
                if(hotCell[0]==y && hotCell[1]==x && highestTemp<=$scope.cells[y][x].col){
                    //this is the hottest cell!
                    $scope.cells[y][x].col-=.1;
                }
               else{
                    console.log("HEATING CELL",hotCell[0],y,hotCell[1],x)
                    //this is not the hottest cell
                    $scope.cells[y][x].col+=.1;
                    $scope.cells[hotCell[0]][hotCell[1]].col -=.1;
                }
            }
        }
    }
    $scope.t = setInterval(function() {
        if ($scope.heating) {
            var pos = $scope.heatTarg.id.split('-');
            console.log($scope.heatTarg,pos)
            console.log('Heating cell at', pos, $scope.cells[pos[1]][pos[0]].col)
            $scope.cells[pos[1]][pos[0]].col < 100 ? $scope.cells[pos[1]][pos[0]].col+=5 : $scope.cells[pos[1]][pos[0]].col = 100;
        }
        $scope.cellheats();
        $scope.$digest();
    }, 50);
    window.onmousedown = function(e) {
        if (e.button == 0 && document.elementFromPoint((e.x || e.clientX), (e.y || e.clientY)).className.indexOf('cell') != -1) {
            $scope.heating = true;
            $scope.heatTarg = document.elementFromPoint(e.x, e.y);
        }
    }
    window.onmouseup = function(e) {
        if (e.button == 0) {
            $scope.heating = false;
            $scope.heatTarg = null;
        }
    }
});

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
    $scope.getCol = function(c,m){
        if (m){
            return 'hsl('+(40*100/100)+',100%,'+(70*(100-c)/100)+'%)'
        }
        return 'hsl('+(40*c/100)+',100%,'+(70*c/100)+'%)';
    }
});

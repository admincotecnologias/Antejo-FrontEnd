antejo.controller('MainCtrl', ['$http', '$filter', '$scope', 'MainFact', '$location', 'AuthFact', '$timeout', 'DTOptionsBuilder', function($http, $filter, $scope, MainFact, $location, AuthFact, $timeout, DTOptionsBuilder) {
    var timer;
    $scope.CheckLocal = MainFact.CheckLocal;
    var local = localStorage.getItem("auth");
    if (local == null) {
        $scope.CheckLocal = false;
    } else {
        var today = new Date();
        var saveDate = new Date(angular.fromJson(local).date);
        $scope.username = angular.fromJson(local).nombre;
        $scope.occupation = angular.fromJson(local).puesto;
        $scope.CheckLocal = true;
        $location.path("/");
    }

    $scope.username = MainFact.username;
    $scope.occupation = MainFact.occupation;
    $scope.LogIn = AuthFact.LogIn;
    $scope.LogOut = AuthFact.LogOut;
    $scope.CheckRole = AuthFact.CheckRole;
    $scope.http = $http;
    $scope.scope = $scope;
    $scope.locationobj = $location;
    var local = localStorage.getItem("auth");
    if (local == null) {
        $location.path("Login");
        //location.reload();
    }
    $scope.CurrentLocation = function() {
        return $location.path().split('/')[1];
    }
    $scope.goTo = function(url, data) {
        if ($location.path().split('/')[1] != url || $location.path().split('/').length > 2) {
            $location.path(url);
            if (data) {
                window.setTimeout(function() {
                    $(document).ready(function() {
                        $("#" + data).click();
                    })
                }, 200);
            }
        } else {
            if (data) {
                $(document).ready(function() {
                    $("#" + data).click();
                });
            }
        }
    }
    $scope.showIt = function(nav) {
        timer = $timeout(function() {
            $(nav).click();
        }, 0);
    };
    $scope.location = $scope.CurrentLocation();
    $scope.$on('$locationChangeSuccess', function() {
        $scope.txt_filtro = "";
    });

    $scope.gotolocation = function(path) {
        console.log(path)
        $location.path(path);
    }
}]);
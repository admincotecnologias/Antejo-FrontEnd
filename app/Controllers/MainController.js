antejo.controller('MainCtrl', ['$http', '$scope', 'MainFact', '$location', 'AuthFact', '$timeout', function($http, $scope, MainFact, $location, AuthFact, $timeout) {
    var timer;
    $scope.CheckLocal = MainFact.CheckLocal;
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
        return $location.path().split('/').pop();
    }
    $scope.goTo = function(url, data) {
        if ($location.path().split('/')[1] != url) {
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

}]);
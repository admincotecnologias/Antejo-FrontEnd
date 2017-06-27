antejo.factory('MainFact', ['$route', '$routeParams', '$location',
    function($route, $routeParams, $location) {
        this.$route = $route;
        this.$routeParams = $routeParams;
        this.CheckLocal = null;
        this.username = null;
        this.occupation = null;
        var local = localStorage.getItem("auth");
        if (local == null) {
            this.CheckLocal = false;
        } else {
            var today = new Date();
            var saveDate = new Date(angular.fromJson(local).date);
            this.username = angular.fromJson(local).nombre;
            this.occupation = angular.fromJson(local).puesto;
            this.CheckLocal = true;
        }
        return {
            CheckLocal: this.CheckLocal,
            username: this.username,
            occupation: this.occupation
        };
    }
])
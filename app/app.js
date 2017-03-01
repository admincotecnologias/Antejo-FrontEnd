antejo = angular.module("Antejo", ['ngRoute', 'oitozero.ngSweetAlert', 'ngAnimate', 'base64', 'ngFileUpload','htmlToPdfSave','angularScreenfull']);
apiUrl = 'http://192.168.1.78:80/bantejo/public';
antejo.config(
    function($routeProvider, $httpProvider, $locationProvider, $provide, $filterProvider) {
        $routeProvider
            .when('/Login', {
                name: "Login",
                url: "Login",
                templateUrl: '/app/views/Login.html',
            })
            .when('/Empleados', {
                name: "Empleados",
                url: "Empleados",
                templateUrl: '/app/views/Empleados.html',
                controller: 'EmpleadosCtrl'
            })
            .when('/Clientes', {
                name: "Clientes",
                url: "Clientes",
                templateUrl: '/app/views/Clientes.html',
                controller: 'ClientesCtrl'
            })
            .when('/Solicitudes', {
                name: "Solicitudes",
                url: "Solicitudes",
                templateUrl: '/app/views/Solicitudes.html',
                controller: 'ApplicationCtrl'
            })
            .when('/', {
                name: "Index",
                url: "Index",
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        $provide.value('RFC', function(RFC) {
            return RFC;
        });
        $filterProvider.register('RFC', function(RFC) {
            return function(text) {
                return text;
            };
        });
        $provide.value('CURP', function(CURP) {
            return CURP;
        });
        $filterProvider.register('CURP', function(CURP) {
            return function(text) {
                return text;
            };
        });
        $provide.value('phone', function(phone) {
            return phone;
        });
        $filterProvider.register('phone', function(phone) {
            return function(text) {
                return text;
            };
        });
        $provide.value('float', function(float) {
            return float;
        });
        $filterProvider.register('float', function(float) {
            return function(text) {
                return text;
            };
        });


        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        //$httpProvider.defaults.headers.common['Access-Control-Expose-Headers'] = '*';
        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push("InterceptorFact");



        $locationProvider.html5Mode(true);
    }
);
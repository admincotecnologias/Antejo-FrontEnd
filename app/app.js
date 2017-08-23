antejo = angular.module("Antejo", ['ngRoute', 'oitozero.ngSweetAlert', 'ngAnimate', 'base64', 'ngFileUpload', 'htmlToPdfSave', 'angularScreenfull', '720kb.datepicker', 'ngLocale', 'datatables', 'chart.js']);
apiUrl = 'http://localhost/bantejo/public/Admin';
antejo.config(
    function($routeProvider, $httpProvider, $locationProvider, $provide, $filterProvider) {
        $routeProvider
            .when('/Login', {
                name: "Login",
                url: "Login",
                templateUrl: '/app/views/Login.html',
            })
            .when('/Usuarios', {
                name: "Usuarios",
                url: "Usuarios",
                templateUrl: '/app/views/Empleados.html',
                controller: 'EmpleadosCtrl'
            })
            .when('/Empleados/Perfil', {
                name: "Perfil",
                url: "Perfil",
                templateUrl: '/app/views/profile/main.html',
                controller: 'ProfileMainCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Clientes', {
                name: "Clientes",
                url: "Clientes",
                templateUrl: '/app/views/Clients/Main.html',
                controller: 'ClientMainCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Bancos', {
                name: "Bancos",
                url: "Bancos",
                templateUrl: '/app/views/Banks/Main.html',
                controller: 'BanksMainCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Clientes/:idClient', {
                name: "Clientes",
                url: "Clientes",
                templateUrl: '/app/views/Clients/Crear.html',
                controller: 'ClientEditCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Clientes/Cartera/:idClient', {
                name: "Clientes",
                url: "Clientes",
                templateUrl: '/app/views/Clients/Cartera.html',
                controller: 'ClientWalletCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Nuevo/Clientes', {
                name: "Clientes",
                url: "Clientes",
                templateUrl: '/app/views/Clients/Crear.html',
                controller: 'ClientCreateCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Solicitudes', {
                name: "Solicitudes",
                url: "Solicitudes",
                templateUrl: '/app/views/Solicitudes/Main.html',
                controller: 'ApplicationMainCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Solicitudes/Nuevo', {
                name: "Solicitudes",
                url: "Solicitudes",
                templateUrl: '/app/views/Solicitudes/Create.html',
                controller: 'ApplicationCreateCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Solicitudes/Autorizar/:idApp', {
                name: "Solicitudes",
                url: "Solicitudes",
                templateUrl: '/app/views/Solicitudes/Autorizar.html',
                controller: 'ApplicationApprovedCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Solicitudes/:idApp', {
                name: "Solicitudes",
                url: "Solicitudes",
                templateUrl: '/app/views/Solicitudes/Create.html',
                controller: 'ApplicationEditCtrl',
                controllerAs: 'ctrl'
            })
            .when('/Creditos', {
                name: "Creditos",
                url: "Creditos",
                templateUrl: '/app/views/creditos/main.html',
                controller: 'CreditMainCtrl'
            })
            .when('/Creditos/PagoFinal/:idCredito', {
                name: "Creditos",
                url: "Creditos",
                templateUrl: '/app/views/creditos/ShowCredit.html',
                controller: 'ShowCreditCtrl'
            }).when('/Creditos/Revolvente/:idCredito', {
            name: "Creditos",
            url: "Creditos",
            templateUrl: '/app/views/creditos/Revolvente.html',
            controller: 'RevolventeCtrl'

            }).when('/Creditos/AnalisisFinanciero/:idCredito', {
                name: "Creditos",
                url: "Creditos",
                templateUrl: '/app/views/creditos/AnalisisFinanciero.html',
                controller: 'AnalisisCtrl',
                controllerAs: "ctrl"

            }).when('/Fondeadores', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: '/app/views/Fondeadores/main.html',
                controller: 'StockholderCtrl',
                controllerAs: 'stock'
            }).when('/Fondeadores/Nuevo', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: 'app/views/Fondeadores/Create.html',
                controller: 'CreateStockCtrl',
                controllerAs: 'stock'
            }).when('/Fondeadores/:idStock', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: 'app/views/Fondeadores/Create.html',
                controller: 'UpdateStockCtrl',
                controllerAs: 'stock'
            }).when('/Fondeadores/:idStock/Creditos/', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: 'app/views/CreditosFondeadores/main.html',
                controller: 'FundsCtrl',
                controllerAs: 'ctrl'
            }).when('/Fondeadores/:idStock/Credito/Nuevo', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: 'app/views/CreditosFondeadores/Create.html',
                controller: 'FundsCreateCtrl',
                controllerAs: 'ctrl'
            }).when('/Fondeadores/:idStock/Creditos/:idcredito', {
                name: "Fondeadores",
                url: "Fondeadores",
                templateUrl: 'app/views/CreditosFondeadores/Revolvente.html',
                controller: 'ShowCreditFundsCtrl',
                controllerAs: 'ctrl'
            }).when('/', {
                name: "Index",
                url: "Index",
                templateUrl: 'app/views/Dashboard/Main.html',
                controller: 'DashboardCtrl',
                controllerAs: 'ctrl'
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
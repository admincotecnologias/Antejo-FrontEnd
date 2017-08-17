/**
 * Created by Enrique on 01/06/2017.
 */
antejo.factory('DashboardFact', ['$http', function($http) {

    var MorosidadTotal = function() {
        var json = {};
        return $http.get(apiUrl + "/Dashboard/show/Morosidad", json);
    }
    var InteresNeto = function() {
        var json = {};
        return $http.get(apiUrl + "/Dashboard/show/InteresNeto", json);
    }
    var DeudaPromedio = function() {
        var json = {};
        return $http.get(apiUrl + "/Dashboard/show/DeudaPromedio", json);
    }
    var CarteraPromedio = function() {
        var json = {};
        return $http.get(apiUrl + "/Dashboard/show/CarteraPromedio", json);
    }
    var MargenFinanciero = function() {
        var json = {};
        return $http.get(apiUrl + "/Dashboard/show/MargenFinanciero", json);
    }
    return {
        MorosidadTotal: MorosidadTotal,
        InteresNeto:InteresNeto,
        MargenFinanciero:MargenFinanciero,
        CarteraPromedio:CarteraPromedio,
        DeudaPromedio:DeudaPromedio
    };
}]);
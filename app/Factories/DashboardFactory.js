/**
 * Created by Enrique on 01/06/2017.
 */
antejo.factory('DashboardFact', ['$http', function($http) {

    var MorosidadTotal = function(dates) {
        var json = dates ? angular.copy(dates) : {} ;
        return dates ?  $http.post(apiUrl + "/Dashboard/show/MorosidadFechas", json):
                        $http.get(apiUrl + "/Dashboard/show/Morosidad", json)
    }
    var InteresNeto = function(dates) {
        var json = dates ? angular.copy(dates) : {} ;
        return dates ? $http.post(apiUrl + "/Dashboard/show/InteresNetoFechas", json):
                        $http.get(apiUrl + "/Dashboard/show/InteresNeto", json);
    }
    var DeudaPromedio = function(dates) {
        var json = dates ? angular.copy(dates) : {} ;
        return dates ? $http.post(apiUrl + "/Dashboard/show/DeudaPromedioFechas", json):
                       $http.get(apiUrl + "/Dashboard/show/DeudaPromedio", json);
    }
    var CarteraPromedio = function(dates) {
        var json = dates ? angular.copy(dates) : {} ;
        return dates ? $http.post(apiUrl + "/Dashboard/show/CarteraPromedioFechas", json):
                       $http.get(apiUrl + "/Dashboard/show/CarteraPromedio", json);
    }
    var MargenFinanciero = function(dates) {
        var json = dates ? angular.copy(dates) : {} ;

        return dates ? $http.post(apiUrl + "/Dashboard/show/MargenFinancieroFechas", json) :
                       $http.get(apiUrl + "/Dashboard/show/MargenFinanciero", json);
    }
    return {
        MorosidadTotal: MorosidadTotal,
        InteresNeto:InteresNeto,
        MargenFinanciero:MargenFinanciero,
        CarteraPromedio:CarteraPromedio,
        DeudaPromedio:DeudaPromedio
    };
}]);
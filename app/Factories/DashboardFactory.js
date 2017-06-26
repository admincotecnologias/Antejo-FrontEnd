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
    return {
        MorosidadTotal: MorosidadTotal,
        InteresNeto:InteresNeto
    };
}]);
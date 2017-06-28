antejo.factory("BancosFact", ["$http", function($http) {
    var AddBanco = function(descripcion) {
        var json = { name: descripcion }
        return $http.post(apiUrl + "/Clientes/add/Bancos", json);
    }
    var DeleteBanco = function(id) {
        var json = {}
        return $http.delete(apiUrl + "/Clientes/delete/" + id + "/Bancos", json);
    }
    var AllBanco = function() {
        var json = {}
        return $http.get(apiUrl + "/Clientes/all/Bancos", json);
    }
    return { AddBanco: AddBanco, DeleteBanco: DeleteBanco, AllBanco: AllBanco };
}]);
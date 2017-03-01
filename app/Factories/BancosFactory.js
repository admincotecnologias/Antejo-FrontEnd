antejo.factory("BancosFact", ["$http", function($http) {
    var AddBanco = function(descripcion) {
        var json = { name: descripcion }
        return $http.post(apiUrl + "/Bancos/add", json);
    }
    var DeleteBanco = function(id) {
        var json = {}
        return $http.delete(apiUrl + "/Bancos/delete/" + id, json);
    }
    var AllBanco = function(callbackFn) {
        var json = {}
        $http.get(apiUrl + "/Bancos/all", json).then((response) => {
            if (response.data.error == false) {
                callbackFn(response.data);
            } else {
                callbackFn(response.data);
            }
        }).catch(function(ex) {
            callbackFn({ error: true, message: "Error al conectar con el servidor." });
        });
    }
    return { AddBanco: AddBanco, DeleteBanco: DeleteBanco, AllBanco: AllBanco };
}]);
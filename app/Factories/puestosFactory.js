antejo.factory("PuestosFact", ["$http", function($http) {
    var AddPuesto = function(descripcion) {
        var json = { name: descripcion }
        return $http.post(apiUrl + "/Puestos/add", json);
    }
    var DeletePuesto = function(id) {
        var json = {}
        return $http.delete(apiUrl + "/Puestos/delete/" + id, json);
    }
    var AllPuesto = function(callbackFn) {
        var json = {}
        $http.get(apiUrl + "/Puestos/all", json).then((response) => {
            if (response.data.error == false) {
                callbackFn(response.data);
            } else {
                callbackFn(response.data);
            }
        }).catch(function(ex) {
            callbackFn({ error: true, message: "Error al conectar con el servidor." });
        });
    }
    return { addPuesto: AddPuesto, deletePuesto: DeletePuesto, allPuesto: AllPuesto };
}]);
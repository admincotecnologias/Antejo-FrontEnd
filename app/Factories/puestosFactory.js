antejo.factory("PuestosFact", ["$http", function($http) {
    var AddPuesto = function(descripcion) {
        var json = { name: descripcion }
        return $http.post(apiUrl + "/Usuarios/add/Puestos", json);
    }
    var DeletePuesto = function(id) {
        var json = {}
        return $http.delete(apiUrl + "/Usuarios/delete/"+id+"/Puestos", json);
    }
    var AllPuesto = function(callbackFn) {
        var json = {}
        $http.get(apiUrl + "/Usuarios/all/Puestos", json).then((response) => {
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
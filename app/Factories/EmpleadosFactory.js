antejo.factory('EmployeesFact', ['$http', function($http) {

    //CRUD
    var DeleteEmployees = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Empleados/delete/" + id, json);
    }

    var UpdateEmployees = function(id, obj) {
        var json = {};
        if ("name" in obj) {
            json.name = obj.name;
        }
        if ("lastname" in obj) {
            json.lastname = obj.lastname;
        }
        if ("puesto" in obj) {
            json.idoccupation = obj.puesto;
        }
        if (Object.getOwnPropertyNames(json).length > 0) {
            return $http.put(apiUrl + "/Empleados/update/" + id, json);
        }
        return null;
    }

    var AddEmployees = function(name, lastname, iduser, idoccupation) {
        var json = {
            name: name,
            lastname: lastname,
            iduser: iduser,
            idoccupation: idoccupation
        };
        return $http.post(apiUrl + "/Empleados/add", json);
    }

    var ShowEmployees = function(id) {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Empleados/show/" + id, jsonAuth);
    }

    var AllEmployees = function(callbackFn) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Empleados/all", jsonAuth).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.employees);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor" });
        });
    }
    return {
        allEmployees: AllEmployees,
        showEmployees: ShowEmployees,
        addEmployees: AddEmployees,
        deleteEmployees: DeleteEmployees,
        updateEmployees: UpdateEmployees
    };

}]);
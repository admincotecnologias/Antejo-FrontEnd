antejo.factory('UserFact', ['$http', function($http) {

    //CRUD
    var DeleteUsers = function(id, callbackFn) {
        var json = {};
        $http.delete(apiUrl + "/Usuarios/delete/" + id, json).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.id);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor" });
        });
        return jsonAuth;
    }

    var UpdateUsers = function(id, obj) {
        var json = {};
        if ("fullname" in obj) {
            json.name = obj.fullname;
        }
        if ("email" in obj) {
            json.email = obj.email;
        }
        if ("password" in obj) {
            json.password = obj.password;
        }
        if ("password2" in obj) {
            json.password_confirmation = obj.password2;
        }
        if (Object.getOwnPropertyNames(json).length > 0) {
            return $http.put(apiUrl + "/Usuarios/update/" + id, json);
        }
        return null;
    }

    var AddUsers = function(name, email, password, Password_confirmation) {
        var json = {
            name: name,
            email: email,
            password: password,
            password_confirmation: Password_confirmation
        };
        return $http.post(apiUrl + "/Usuarios/add", json);
    }

    var ShowUsers = function(id, callbackFn) {
        $http.get(apiUrl + "/Usuarios/show/" + id, {}).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.user);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor" });
        });
        return jsonAuth;
    }

    var AllUsers = function(callbackFn) {
        var json = {};
        $http.get(apiUrl + "/Usuarios/all", json).then((response) => {
            if (!response.data.error) {
                this.userArray = response.data.users;
                callbackFn(response.data.users);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor" });
        });
    }
    return {
        allUsers: AllUsers,
        showUser: ShowUsers,
        addUser: AddUsers,
        deleteUser: DeleteUsers,
        updateUser: UpdateUsers
    };

}]);
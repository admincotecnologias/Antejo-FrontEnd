antejo.factory("AuthFact", [function() {

    var LogIn = function(email, password, scope, api, location) {
        var logData = {
            email: email,
            password: password
        };
        api.post(apiUrl + "/Auth/LogIn", logData).then((response) => {
            if (!response.data.error) {
                localStorage.setItem("auth", JSON.stringify(response.data));
                scope.CheckLocal = true;
                scope.username = response.data.nombre;
                scope.occupation = response.data.puesto;
                location.path("/");
                window.location.reload();
            } else {
                alert(response.data.message);
            }
        }).catch(function(e) {
            // handle errors in processing or in error.
            alert("Error con el server" + e.message);
        });
    }

    var LogOut = function(scope, api, location) {
        var jsonauth = angular.fromJson(localStorage.getItem("auth"));
        api.get(apiUrl + "/Auth/LogOut", { headers: { token: jsonauth.token } }).then(function(response) {
            if (!response.data.error) {
                localStorage.removeItem("auth");
                scope.CheckLocal = false;
                location.path("Login");
            } else {
                alert(response.data.message);
            }
        });
    }
    var CheckRole = function(api, location) {
        try {
            var jsonauth = angular.fromJson(localStorage.getItem("auth"));
            api.get(apiUrl + "/Roles", { headers: { token: jsonauth.token } }).then(function(response) {
                if (!response.data.error) {
                    return response.data;
                }
            });
        } catch (e) {}
    }
    return { LogIn: LogIn, LogOut: LogOut, CheckRole: CheckRole };
}]);
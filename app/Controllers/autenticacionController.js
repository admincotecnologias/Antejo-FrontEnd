antejo.factory("AuthFact", [function() {
    var authUrl = 'api2.antejo.com/AdminAuth';
    var LogIn = function(email, password, scope, api, location,cb) {
        var logData = {
            email: email,
            password: password
        };
        api.post(authUrl + "/LogIn", logData).then((response) => {
            if (!response.data.error) {
                localStorage.setItem("auth", JSON.stringify(response.data));
                scope.CheckLocal = true;
                scope.username = response.data.nombre;
                scope.occupation = response.data.puesto;
                location.path("/");
                jQuery(document).ready(function() {
                    initializeJS();
                });
            var auxPermissions = response.data.permissions;
                var permissions = {};
                angular.forEach(auxPermissions,function(permission){
                    permissions[permission.url] = angular.copy(permission);
                    delete permissions[permission.url].url;
                });
                localStorage.setItem("permissions",JSON.stringify(permissions));
                cb(permissions);
            } else {
                alert(response.data.message);
            }
        }).catch(function(e) {
            // handle errors in processing or in error.a
            alert("Error con el server" + e.message);
        });
    }

    var LogOut = function(scope, api, location) {
        var jsonauth = angular.fromJson(localStorage.getItem("auth"));
        api.get(authUrl + "/LogOut", { headers: { token: jsonauth.token } }).then(function(response) {
            if (!response.data.error) {
                localStorage.removeItem("auth");
                localStorage.removeItem("permissions");
                scope.CheckLocal = false;
                location.path("Login");
                window.location.reload();

            } else {
                alert(response.data.message);
            }
        });
    }
    /**
     * @deprecated forever.
     */
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
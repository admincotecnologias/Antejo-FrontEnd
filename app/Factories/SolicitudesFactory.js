antejo.factory('ApplicationsFact', ['$http', function($http) {

    var DeleteApplication = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Solicitudes/delete/" + id, json);
    }

    var UpdateApplication = function(id, obj) {
        if (Object.keys(obj).length > 0) {
            return $http.put(apiUrl + "/Solicitudes/update/" + id, obj);
        }
        return null;
    }

    var AddApplication = function(obj) {
        var json = {
            amountrequest: parseFloat(obj.amountrequest),
            applicationdate: obj.applicationdate,
            place: obj.place,
            creditterm: obj.creditterm,
            projectname: obj.projectname,
            idclient: obj.idclient,
            status: obj.status,
        }
        return $http.post(apiUrl + "/Solicitudes/add", json);
    }

    var AddFile = function(obj, idapp) {
        var formdata = new FormData();
        formdata.append('file', obj);
        formdata.append('idapp', idapp);
        return $http.post(apiUrl + '/FilesApplication/add', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }

    var AddCreditAid = function(obj) {
        return $http.post(apiUrl + "/AvalCredito/add", obj);
    }
    var ShowApplication = function(id) {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Solicitudes/show/" + id, jsonAuth);
    }

    var AllApplication = function(callbackFn) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Solicitudes/all", jsonAuth).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.applications);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor", exc: param });
        });
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/FilesApplication/show/" + id).then(function(response) {
            var stringPath = apiUrl.replace('public', '') + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
    }
    return {
        deleteApplication: DeleteApplication,
        updateApplication: UpdateApplication,
        addApplication: AddApplication,
        addCreditAid: AddCreditAid,
        AddFile: AddFile,
        allApplication: AllApplication,
        showApplication: ShowApplication,
        DownloadFile: DownloadFile
    };
}]);
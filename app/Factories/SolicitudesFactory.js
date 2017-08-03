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
        var json = obj;
        return $http.post(apiUrl + "/Solicitudes/add", json);
    }
    var addCreditApproved = function(obj) {
        var json = obj;
        return $http.post(apiUrl + "/Creditos/add", json);
    }

    var AddFile = function(obj) {
        var formdata = obj;
        return $http.post(apiUrl + '/Solicitudes/add/FilesApplication', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }

    var AddCreditAid = function(obj) {
        return $http.post(apiUrl + "/Solicitudes/add/AvalCredito", obj);
    }
    var UpdateCreditAid = function(obj) {
        return $http.put(apiUrl + "/Solicitudes/update/" + obj.id + "/AvalCredito", obj);
    }
    var DeleteCreditAid = function(id) {
        return $http.delete(apiUrl + "/Solicitudes/delete/" + id + "/AvalCredito", {});
    }
    var ShowApplication = function(id) {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Solicitudes/show/" + id, jsonAuth);
    }

    var AllApplication = function() {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Solicitudes/all", jsonAuth);
    }
    var AllClients = function() {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Solicitudes/all/Clients", jsonAuth);
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Solicitudes/show/" + id + "/FilesApplication/" + id).then(function(response) {
            var stringPath = apiUrl + '/storage/' + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
    }
    return {
        deleteApplication: DeleteApplication,
        updateApplication: UpdateApplication,
        addApplication: AddApplication,
        addCreditAid: AddCreditAid,
        UpdateCreditAid: UpdateCreditAid,
        AddFile: AddFile,
        allApplication: AllApplication,
        AllClients: AllClients,
        showApplication: ShowApplication,
        DownloadFile: DownloadFile,
        addCreditApproved: addCreditApproved,
        DeleteCreditAid: DeleteCreditAid
    };
}]);
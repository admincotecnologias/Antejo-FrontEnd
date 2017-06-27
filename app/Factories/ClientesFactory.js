antejo.factory('ClientsFact', ['$http','$filter', function($http,$filter) {

    //CRUD
    var DeleteClients = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Clientes/delete/" + id, json);
    }

    var UpdateClients = function(id, obj) {
        return $http.put(apiUrl + "/Clientes/update/" + id, obj);
    }

    var AddClients = function(obj) {
        delete obj.id;
        if(obj.type=='Moral'){
            obj.name = null;
            obj.lastname = null;
        }else{
            obj.businessname = null;
        }
        var json = obj;
        return $http.post(apiUrl + "/Clientes/add", json);
    }

    var deleteShareholder = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/AccionistasClientes/delete/" + id, json);
    }
    var deleteManager = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Clientes/delete/" + id+"/manager", json);
    }

    var deleteClientBank = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/BancosClientes/delete/" + id, json);
    }

    var AddClientBank = function(obj) {
        return $http.post(apiUrl + "/BancosClientes/add", obj);
    }

    var AddClientShareholder = function(obj) {
        var json = obj;
        return $http.post(apiUrl + "/AccionistasClientes/add", json);
    }

    var ShowClients = function(id) {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Clientes/show/" + id, jsonAuth);
    }

    var AllClients = function() {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Clientes/all", jsonAuth);
    }
    var AddFile = function(obj) {
        var formdata = obj;
        return $http.post(apiUrl + '/FilesClient/add', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/FilesClient/show/" + id).then(function(response) {
            var stringPath = apiUrl + '/storage/' + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
    }
    var deleteFile = function (id) {
        return $http.delete(apiUrl+"/Clientes/delete/"+id+"/files",{});
    }
    var addManager = function(obj) {
        return $http.post(apiUrl + "/Managers/add", obj);
    }
    return {
        allClients: AllClients,
        showClients: ShowClients,
        addClients: AddClients,
        deleteClients: DeleteClients,
        updateClients: UpdateClients,
        addClientBank: AddClientBank,
        deleteClientBank: deleteClientBank,
        addClientShareholder: AddClientShareholder,
        AddFile: AddFile,
        DownloadFile: DownloadFile,
        addManager: addManager,
        deleteShareholder: deleteShareholder,
        deleteFile:deleteFile,
        deleteManager:deleteManager
    };

}]);
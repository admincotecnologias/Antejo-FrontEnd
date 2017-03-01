antejo.factory('ClientsFact', ['$http', function($http) {

    //CRUD
    var DeleteClients = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Clientes/delete/" + id, json);
    }

    var UpdateClients = function(id, obj) {
        if (Object.keys(obj).length > 0) {
            return $http.put(apiUrl + "/Clientes/update/" + id, obj);
        }
        return null;
    }

    var AddClients = function(obj) {
        var date = new Date(obj.constitutiondate);
        var stringdate = "" + date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear();
        var json = {
            businessname: obj.businessname,
            employeenumber: obj.employeenumber == '' ? null : parseInt(obj.employeenumber),
            rfc: obj.rfc,
            fiel: obj.fiel == '' ? null : obj.fiel,
            email: obj.email,
            businesscategory: obj.businesscategory,
            constitutiondate: stringdate,
            address: obj.address,
            colony: obj.colony,
            postalcode: parseInt(obj.postalcode),
            city: obj.city,
            state: obj.state,
            phone: parseInt(obj.phone)
        };
        return $http.post(apiUrl + "/Clientes/add", json);
    }

    var deleteShareholder = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/AccionistasClientes/delete/" + id, json);
    }

    var deleteClientBank = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/BancosClientes/delete/" + id, json);
    }

    var AddClientBank = function(obj) {
        var json = {
            accounttype: obj.accounttype,
            accountnumber: obj.accountnumber,
            clabe: obj.clabe,
            idclient: obj.idclient,
            idbank: obj.banco.id
        }
        return $http.post(apiUrl + "/BancosClientes/add", json);
    }

    var AddClientShareholder = function(obj, idclient) {
        var date = new Date(obj.oldwork);
        var json = {
            name: obj.name,
            lastname: obj.lastname,
            rfc: obj.rfc,
            idclient: idclient,
            participation: obj.participation,
            oldwork: date
        }
        return $http.post(apiUrl + "/AccionistasClientes/add", json);
    }

    var ShowClients = function(id) {
        var jsonAuth = {};
        return $http.get(apiUrl + "/Clientes/show/" + id, jsonAuth);
    }

    var AllClients = function(callbackFn) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Clientes/all", jsonAuth).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.clients);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn({ error: true, message: "Error al conectarse con el servidor" });
        });
    }
    var AddFile = function(obj, idclient) {
        var formdata = new FormData();
        formdata.append('file', obj);
        formdata.append('idclient', idclient);
        return $http.post(apiUrl + '/FilesClient/add', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/FilesClient/show/" + id).then(function(response) {
            var stringPath = apiUrl.replace('public', '') + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
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
        deleteShareholder: deleteShareholder
    };

}]);
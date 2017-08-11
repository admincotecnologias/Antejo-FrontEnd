/**
 * Created by Enrique on 17/03/2017.
 */
antejo.factory('CreditsFact', ['$http', function($http) {

    var getCreditsApproved = function(callback) {
        var json = {}
        $http.get(apiUrl + "/Creditos/all", json).then(function(response) {
            console.log(response)
            if (!response.data.error) {
                callback(response.data);
            } else {
                callback(response.data);
            }
        }).catch(function(param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param });
        });
    }
    var showCredit = function(id, callback) {
        var json = {}
        $http.get(apiUrl + "/Creditos/show/" + id, json).then(function(response) {
            callback(response.data)
        }).catch(function(param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param });
        });
    }

    var liquidateCredit = function(appId, callback) {
        var json = {}
        return $http.put(apiUrl + "/Creditos/update/" + appId+"/Liquidar", json);

    }

    var deleteLastMove = function(creditId, callback) {
        var json = {}
        return $http.delete(apiUrl + "/Creditos/delete/" + creditId+"/LastMove", json);

    }
    var addCreditApproved = function(obj, callback) {
        var json = obj;
        $http.post(apiUrl + "/Creditos/add", json).then(function(response) {
            callback(response.data)
        }).catch(function(param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param })
        });
    }
    var addCreditPay = function(obj, callback) {
        var json = obj;
        $http.post(apiUrl + "/Creditos/add/pay", json).then(function(response) {
            callback(response.data)
        }).catch(function(param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param })
        });
    }

    var AddFile = function(obj) {
        var formdata = obj;
        return $http.post(apiUrl + '/Creditos/add/FilesApplication', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Creditos/show/" + id + "/FilesApplication").then(function(response) {
            var stringPath = apiUrl + '/storage/' + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
    }


    var updateCreditFile = function(creditId,fileId){
        var json = {};
        return $http.put(apiUrl+ "/Creditos/update/"+creditId+"/ControlCredits/"+fileId,json);

    }
    return {
        GetAll: getCreditsApproved,
        showCredit: showCredit,
        addCondition: addCreditApproved,
        addCreditPay: addCreditPay,
        addFile: AddFile,
        downloadFile: DownloadFile,
        updateCreditFile : updateCreditFile,
        liquidateCredit : liquidateCredit,
        deleteLastMove : deleteLastMove
    }
}]);
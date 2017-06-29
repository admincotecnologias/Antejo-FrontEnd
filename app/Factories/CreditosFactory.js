/**
 * Created by Enrique on 17/03/2017.
 */
antejo.factory('CreditsFact', ['$http', function($http) {

    var getCreditsApproved = function (callback) {
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
    var showCredit = function (id,callback) {
        var json = {}
        $http.get(apiUrl + "/Creditos/show/"+id,json).then(function (response) {
            callback(response.data)
        }).catch(function(param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param });
        });
    }
    var addCreditApproved = function(obj,callback) {
        var json = obj;
        $http.post(apiUrl + "/Creditos/add", json).then(function (response) {
            callback(response.data)
        }).catch(function (param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param })
        });
    }
    var addCreditPay = function(obj,callback) {
        var json = obj;
        $http.post(apiUrl + "/Creditos/add/pay", json).then(function (response) {
            callback(response.data)
        }).catch(function (param) {
            callback({ error: true, message: "Error al conectarse con el servidor", exc: param })
        });
    }
    return{
        GetAll:getCreditsApproved,
        showCredit:showCredit,
        addCondition:addCreditApproved,
        addCreditPay:addCreditPay
    }
}]);
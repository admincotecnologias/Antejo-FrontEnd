/**
 * Created by Enrique on 09/05/2017.
 */
antejo.factory("FoundFact", ["$http", function($http) {
    var fileUrl = 'http://localhost/bantejo/public';
    var allStockholders = function() {
        var json = { }
        return $http.get(apiUrl + "/Fondeadores/all", json);
    }
    var byIDStockholders = function(id) {
        var json = {}
        return $http.get(apiUrl + "/Fondeadores/show/" + id, json);
    }
    var addStockholder = function(stockHolder) {
        var json = stockHolder; //businessname,name,lastname,type,rfc,email,legalrepresentative,address,colony,postalcode,city,state,phone,nationality,
        return $http.post(apiUrl + "/Fondeadores/add", json);
    }
    var updateStockholder = function(stockHolder) {
        var json = stockHolder;
        return $http.put(apiUrl + "/Fondeadores/update/"+stockHolder.id, json);
    }
    var allManager = function() {
        var json = { }
        return $http.get(apiUrl + "/Fondeadores/all/managers", json);
    }
    var byIDManager = function(id) {
        var json = {}
        return $http.get(apiUrl + "/Fondeadores/show/" + id+"/managers", json);
    }
    var addManager = function(stockHolder) {
        var json = stockHolder; // name,lastname,rfc,email,address,colony,postalcode,city,state,phone,idstockholder
        return $http.post(apiUrl + "/Fondeadores/add/managers", json);
    }
    var updateManager = function(stockHolder) {
        var json = stockHolder;
        return $http.put(apiUrl + "/Fondeadores/update/"+stockHolder.id+"/managers", json);
    }
    var deleteManager = function (id) {
        var json = {}
        return $http.delete(apiUrl + "/Fondeadores/delete/"+id+"/managers",json);
    }
    var allAccount = function() {
        var json = { }
        return $http.get(apiUrl + "/Fondeadores/all/account", json);
    }
    var byIDAccount = function(id) {
        var json = {}
        return $http.get(apiUrl + "/Fondeadores/show/" + id+"/account", json);
    }
    var addAccount = function(stockHolder) {
        var json = stockHolder; // accounttype,accountnumber,clabe,idstock,idbank,
        return $http.post(apiUrl + "/Fondeadores/add/account", json);
    }
    var updateAccount = function(stockHolder) {
        var json = stockHolder;
        return $http.put(apiUrl + "/Fondeadores/update/"+stockHolder.id+"/account", json);
    }
    var deleteAccount = function (id) {
        var json = {}
        return $http.delete(apiUrl + "/Fondeadores/delete/"+id+"/account",json);
    }
    var fundsByStock = function (id) {
        var json = {}
        return $http.get(apiUrl + "/Fondeadores/all/fund/"+id,json);
    }
    var DetailFundsByStock = function (idStock,id) {
        var json = {}
        return $http.get(apiUrl + "/Fondeadores/show/"+idStock+"/fund/"+id,json);
    }
    var addCtrl = function(Control) {
        var json = Control;
        return $http.post(apiUrl + "/Fondeadores/add/fundcntrl", json);
    }
    var addFund = function(Fund) {
        var json = Fund;
        return $http.post(apiUrl + "/Fondeadores/add/fund", json);
    }

    var AddFile = function(obj) {
        var formdata = obj;
        return $http.post(apiUrl + '/Fondeadores/add/Files_Stock', formdata, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    }
    var DownloadFile = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Fondeadores/show/" + id + "/Files_Stock").then(function(response) {
            var stringPath = fileUrl + '/storage/' + response.data.filepath;
            window.open(stringPath);
        }, function(error) {});
    }

    var updateControlFundFile = function(controlFundId,fileId){
        var json = {};
        return $http.put(apiUrl+ "/Fondeadores/update/"+controlFundId+"/Control_Fund/"+fileId,json);

    }

    var updateFundFile = function(fundId,fileId){
        var json = {};
        return $http.put(apiUrl+ "/Fondeadores/update/"+fundId+"/Fund/"+fileId,json);

    }
    var deleteFile = function (id) {
        return $http.delete(apiUrl+"/Fondeadores/delete/"+id+"/Files_Stock",{});
    }
    return {
        allStockholders: allStockholders,
        byIDStockholders: byIDStockholders,
        addStockholder: addStockholder,
        updateStockholder:updateStockholder,
        allManager:allManager,
        byIDManager:byIDManager,
        addManager:addManager,
        updateManager:updateManager,
        deleteManager:deleteManager,
        allAccount:allAccount,
        byIDAccount:byIDAccount,
        addAccount:addAccount,
        updateAccount:updateAccount,
        deleteAccount:deleteAccount,
        fundsByStock:fundsByStock,
        DetailFundsByStock:DetailFundsByStock,
        addCtrl:addCtrl,
        addFund:addFund,
        AddFile:AddFile,
        DownloadFile:DownloadFile,
        deleteFile:deleteFile,
        updateControlFundFile:updateControlFundFile,
        updateFundFile:updateFundFile
    }
}]);

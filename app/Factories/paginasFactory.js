antejo.factory("Pagefact", ['$http', function($http) {

    var ShowPage = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Paginas/show/" + id, jsonAuth).then((response) => {
            if (!response.data.error) {
                this.selectpage = response.data.page;
            } else {
                alert(response.data.message);
            }
        }).catch(function(param) {
            console.log(param);
        });
        return jsonAuth;
    }

    var AllPage = function(callbackFn) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Paginas/all", jsonAuth).then((response) => {
            if (!response.data.error) {
                callbackFn(response.data.pages);
            } else {
                callbackFn(response.data.message);
            }
        }).catch(function(param) {
            callbackFn(param);
        });
    }
    return { showPage: ShowPage, allPage: AllPage };
}]);
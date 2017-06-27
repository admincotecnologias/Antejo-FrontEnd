antejo.factory("PermisosFact", ['$http', function($http) {

    var DeletePermission = function(id) {
        var json = {};
        return $http.delete(apiUrl + "/Permisos/delete/" + id, json);
    }

    var UpdatePermission = function(id, show, insert, edit, deletes, report) {
        var json = {};
        if (show != null) {
            json.show = show;
        }
        if (insert != null) {
            json.insert = insert;
        }
        if (edit != null) {
            json.edit = edit;
        }
        if (deletes != null) {
            json.delete = deletes;
        }
        if (report != null) {
            json.report = report;
        }
        $http.put(apiUrl + "/Permisos/update/" + id, json).then((response) => {
            if (!response.data.error) {
                this.id = response.data.id;
            } else {
                alert(response.data.message);
            }
        }).catch(function(param) {});
        return jsonAuth;
    }

    var AddPermission = function(iduser, idpage, show, insert, edit, deletes, report) {
        var json = {
            iduser: iduser,
            idpage: idpage,
            show: show,
            insert: insert,
            edit: edit,
            delete: deletes,
            report: report
        };
        return $http.post(apiUrl + "/Permisos/add", json);
    }

    var ShowPermission = function(id) {
        var jsonAuth = {};
        $http.get(apiUrl + "/Permisos/show/" + id, jsonAuth).then((response) => {
            if (!response.data.error) {
                this.selectpage = response.data.page;
            } else {
                alert(response.data.message);
            }
        }).catch(function(param) {});
        return jsonAuth;
    }

    var AllPermission = function() {
        var jsonAuth = {};
        $http.get(apiUrl + "/Permisos/all", jsonAuth).then((response) => {
            if (!response.data.error) {
                this.PermissionsArray = response.data.Permissions;
            } else {
                alert(response.data.message);
            }
        }).catch(function(param) {});
        return jsonAuth;
    }
    return {
        allPermission: AllPermission,
        showPermission: ShowPermission,
        addPermission: AddPermission,
        deletePermission: DeletePermission,
        updatePermission: UpdatePermission
    };
}]);
/**
 * Created by Enrique on 24/05/2017.
 */
antejo.controller('ProfileMainCtrl', ['$filter', 'SweetAlert', 'EmployeesFact', 'UserFact', 'DTOptionsBuilder', function($filter, SweetAlert, EmployeesFact, UserFact, DTOptionsBuilder) {
    var ctrl = this;
    ctrl.profile = {
        id: null,
        name: null,
        lastname: null,
        email: null,
        telefono: null,
        puesto: null
    }

    ctrl.GetAll = function() {
        var json = JSON.parse(localStorage.getItem("auth"));
        EmployeesFact.showEmployees(json.id).then(function(response) {
            if (response.data.error === false) {
                ctrl.profile = response.data;
                ctrl.employee = angular.copy(response.data);
                console.log(response.data, ctrl.profile);
            } else {
                SweetAlert.swal("Error", "No se se encontro usuario", "error");

            }
        }).catch(function(error) {
            console.log(error)
        });

    }



    ctrl.editModePerfil = function() {
        var flag = true;
        var dataUpdate = {
            fullname: "",
            name: "",
            lastname: "",
            password: "",
            password2: "",
            email: ctrl.profile.email,
            puesto: ctrl.profile.puesto.id
        }
        if (ctrl.profile.password || ctrl.profile.password2) {
            if (ctrl.profile.password != ctrl.profile.password2) {
                flag = false;
                SweetAlert.swal("Error", "Contraseñas no son iguales.", "error");
            } else {
                dataUpdate.password = ctrl.profile.password;
                dataUpdate.password2 = ctrl.profile.password2;
            }
        } else {
            delete dataUpdate.password;
            delete dataUpdate.password2;
        }
        if (ctrl.employee.name != ctrl.profile.name) {
            dataUpdate.name = ctrl.profile.name;
        } else {
            delete dataUpdate.name;
        }
        if (ctrl.employee.lastname != ctrl.profile.lastname) {
            dataUpdate.lastname = ctrl.profile.lastname;
        } else {
            delete dataUpdate.lastname;
        }
        if (dataUpdate.name || dataUpdate.lastname) {
            dataUpdate.fullname = ctrl.profile.name.split(' ')[0] + " ";
            dataUpdate.fullname += ctrl.profile.lastname.split(' ')[0];
        } else {
            delete dataUpdate.fullname;
        }
        if (Object.getOwnPropertyNames(dataUpdate).length > 0) {
            if (("fullname" in dataUpdate) || ("password" in dataUpdate)) {
                var data = UserFact.updateUser(ctrl.employee.iduser, dataUpdate);
                if (data != null) {
                    data.then(function(response) {
                        if (response.data.error == true) {
                            SweetAlert.swal("Error", response.data.message, "error");
                        } else {

                        }
                    }, function(error) {
                        SweetAlert.swal("Error", "Error al conectar con el servidor", "error");
                    });
                }
            }

            if (("name" in dataUpdate) || ("lastname" in dataUpdate)) {
                var dataemployee = EmployeesFact.updateEmployees(ctrl.employee.id, dataUpdate);
                if (dataemployee != null) {
                    dataemployee.then(function(response) {
                        if (response.data.error == true) {
                            SweetAlert.swal("Error", response.data.message, "error");
                        } else {
                            ctrl.GetAll();
                            SweetAlert.swal("Actualizado", "Perfil actualizado", "success");
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        }
    }
    ctrl.GetAll();
    ctrl.dtOptions = DTOptionsBuilder.fromSource()
        .withLanguage({
            "sEmptyTable": "Vacio",
            "sInfo": "Viendo _START_ de _END_",
            "sInfoEmpty": "Viendo 0 de 0 de un total de 0",
            "sInfoFiltered": "(Filtrado de un total de _MAX_)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "Número Por Página _MENU_",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron coincidencias.",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Ultimo",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        });

    // Inicializacion
    ctrl.GetAll();
}]);
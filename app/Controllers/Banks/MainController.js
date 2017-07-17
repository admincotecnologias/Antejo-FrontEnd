/**
 * Created by Enrique on 24/05/2017.
 */
antejo.controller('BanksMainCtrl', ['$filter', 'SweetAlert', 'BancosFact', 'DTOptionsBuilder', function($filter, SweetAlert, BancosFact, DTOptionsBuilder) {
    var ctrl = this;
    ctrl.banks = [];
    ctrl.bank = {
        id: null,
        name: null
    }
    ctrl.GetAll = function() {
        BancosFact.AllBanco().then(response => {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay Clientes.", 'warning');
            } else {
                console.log(response.data)
                ctrl.banks = response.data.banks;
            }
        })
    }
    ctrl.Create = function() {
        BancosFact.AddBanco(ctrl.bank.name).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.bank = {
                    id: null,
                    name: null
                }
                SweetAlert.swal("Aviso:", response.data.message, "success");
                ctrl.GetAll();
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Aviso:", "No se pudo conectar con el servidor.", "error");
        })
    }

    /*
    ctrl.delete = function(bank) {
        BancosFact.DeleteBanco(bank.id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                SweetAlert.swal("Aviso:", response.data.message, "success");
                ctrl.GetAll();
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Aviso:", "No se pudo conectar con el servidor.", "error");
        })
    }*/

    ctrl.delete = function(bank) {
        SweetAlert.swal({
                title: "Aviso",
                text: "Seguro que desea eliminar este campo",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Si',
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {

                    BancosFact.DeleteBanco(bank.id).then(function(response) {
                        if (response.data.error) {
                            SweetAlert.swal("Aviso:", response.data.message, "warning");
                        } else {
                            SweetAlert.swal("Aviso", "Eliminado correctamente.", "success")
                            ctrl.GetAll();
                        }
                    }).catch(function(error) {
                        SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
                    });
                } else {
                    swal("Cancelado", "Dato no eliminado", "error");
                }
            });
    }

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
/**
 * Created by Enrique on 26/05/2017.
 */
antejo.controller('ApplicationMainCtrl', ['$filter', 'SweetAlert','ApplicationsFact','DTOptionsBuilder', function($filter, SweetAlert,ApplicationsFact,DTOptionsBuilder) {
    var ctrl = this;
    ctrl.applications = [];
    ctrl.GetAll = function () {
        ApplicationsFact.allApplication().then(function (response) {
            if(response.data.error){
                SweetAlert.swal('Mensaje',"No hay Solicitudes.",'warning');
            }else{
                ctrl.applications = response.data.applications;
            }
        }).catch(function (error) {
            SweetAlert.swal('Error','Error al comunicarse con el servidor.','error')
        })
    }
    ctrl.dtOptions = DTOptionsBuilder.fromSource()
        .withLanguage({
            "sEmptyTable":     "Vacio",
            "sInfo":           "Viendo _START_ de _END_",
            "sInfoEmpty":      "Viendo 0 de 0 de un total de 0",
            "sInfoFiltered":   "(Filtrado de un total de _MAX_)",
            "sInfoPostFix":    "",
            "sInfoThousands":  ",",
            "sLengthMenu":     "Número Por Página _MENU_",
            "sLoadingRecords": "Cargando...",
            "sProcessing":     "Procesando...",
            "sSearch":         "Buscar:",
            "sZeroRecords":    "No se encontraron coincidencias.",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Ultimo",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        });

    // Inicializacion
    ctrl.GetAll();
}]);
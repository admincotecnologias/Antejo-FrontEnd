
antejo.controller('AnalisisCtrl', ['$filter', 'SweetAlert', 'CreditsFact', 'ClientsFact', '$routeParams', 'DTOptionsBuilder', function($filter, SweetAlert, CreditsFact, ClientsFact, $routeParams, DTOptionsBuilder) {
    $ctrl.credits = [];
    $ctrl.GetAll = function () {
        CreditsFact.GetAll(function (callback) {
            console.log(callback)
            if(callback.error){
                SweetAlert.swal('Mensaje',"No hay Creditos","warning");
            }else {
                $scope.credits = callback.credits;
                setTimeout(function () {
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                },500);
            }
        })
    }

    $scope.dtOptions = DTOptionsBuilder.fromSource()
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
    $ctrl.GetAll();

}]);
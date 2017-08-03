/**
 * Created by Enrique on 09/05/2017.
 */
antejo.controller('StockholderCtrl', ['$filter', 'SweetAlert','FoundFact', 'DTOptionsBuilder',function($filter, SweetAlert,FoundFact,DTOptionsBuilder) {
    var ctrl = this;
    ctrl.stockholders = [];
    ctrl.GetAll = function () {
        FoundFact.allStockholders().then(function(response){
            if(response.data.stockholders.length==0){
                SweetAlert.swal('Mensaje',"No hay Fondeadores.",'warning');
            }else{
                ctrl.stockholders = response.data.stockholders;
            }
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
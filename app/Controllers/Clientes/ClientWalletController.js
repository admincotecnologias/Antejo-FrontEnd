/**
 * Created by cotech on 28/06/17.
 */
/**
 * Created by Enrique on 22/05/2017.
 */
antejo.controller('ClientWalletCtrl', ['$filter', 'SweetAlert', 'ClientsFact', '$routeParams', 'DTOptionsBuilder', function($filter, SweetAlert, ClientsFact, $routeParams, DTOptionsBuilder) {
    var ctrl = this;
    ctrl.menu = 'application';
    ctrl.applications = [];
    ctrl.credits = [];

    ctrl.prepareWallet = function(){
        var idClient = $routeParams.idClient;

        ClientsFact.getWallet(idClient).then(function(response) {
            if (response.data.error) {
                console.log(response.data);
                SweetAlert.swal('Aviso: ', response.data.error, 'warning');
            } else {
                ctrl.applications = response.data.applications;
                ctrl.client = response.data.client;
                ctrl.credits = response.data.credits;
            }
        });

    }

    //objeto JSON
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



    ctrl.prepareWallet();

}]);
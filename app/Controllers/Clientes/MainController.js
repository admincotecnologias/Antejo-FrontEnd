/**
 * Created by Enrique on 22/05/2017.
 */
antejo.controller('ClientMainCtrl', ['$filter', 'SweetAlert','ClientsFact', 'DTOptionsBuilder', function($filter, SweetAlert,ClientsFact,DTOptionsBuilder) {
    var ctrl = this;
    ctrl.clients = [];
    ctrl.GetAll = function () {
        ClientsFact.allClients().then(response=>{
            if(response.data.error){
                SweetAlert.swal('Mensaje',"No hay Clientes.",'warning');
            }else{
                console.log(response.data)
                ctrl.clients = response.data.clients;
            }
        }).catch(function (error) {
            SweetAlert.swal("Aviso:","Error al conectarse con el servidor.","error");
        })
    }
    ctrl.delete = function (client) {
        ClientsFact.deleteClients(client.id).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.GetAll();
                SweetAlert.swal("Aviso:",response.data.message,"success");
            }
        }).catch(function (error) {
            SweetAlert.swal("Aviso:","Error al conectarse con el servidor.","error");
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
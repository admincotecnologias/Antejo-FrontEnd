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
    ctrl.client = null;
    /*
    ctrl.getAllApplicationsByClient = function(id){
        ClientsFact.allApplications().then(response=> {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay aplicaciones", 'warning');
            } else {
                console.log(response.data);
                let allApplications = response.data.applications;
                for(i = 0 ;i < allApplications.length();i++){
                    if(allApplications[i].idclient == id){
                        ctrl.applications.push(allApplications[i]);
                    }
                }
            }
        }).catch(function (error){
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
        })
    }
    ctrl.getAllCreditsByClient = function(id){
        ClientsFact.allCredits().then(response=> {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay Creditos", 'warning');
            } else {

                console.log(response.data);
                let allCredits = response.data.credits;
                for(i = 0 ;i < allCredits.length;i++){
                    if(allCredits[i].application == id){
                        ctrl.credits.push(allCredits[i]);
                    }
                }
            }
        }).catch(function (error){
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
        })
    }

    ctrl.getAllCredits = function(){
        ClientsFact.allCredits().then(response=> {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay creditos", 'warning');
            } else {

                console.log(response.data);
                ctrl.credits = response.data.credits;
            }
        }).catch(function (error){
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
        })
    }

    ctrl.getClient = function() {
        ClientsFact.showClients($routeParams.idClient).then(function (response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "warning");
            } else {
                ctrl.client = response.data.client;
            }
        })
    }

    */
    ctrl.prepareWallet = function() {
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
    /*
    ctrl.getClient();
    ctrl.getAllApplicationsByClient(ctrl.client.id);
    ctrl.getAllCreditsByClient(ctrl.applications[0].id);

    */



    //ctrl.clients = [];
    /*
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
    // Inicializacion
    ctrl.GetAll();
    */
}]);
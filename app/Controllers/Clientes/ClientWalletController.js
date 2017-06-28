/**
 * Created by cotech on 28/06/17.
 */
/**
 * Created by Enrique on 22/05/2017.
 */
antejo.controller('ClientWalletCtrl', ['$filter', 'SweetAlert','ClientsFact', function($filter, SweetAlert,ClientsFact) {
    var ctrl = this;
    ctrl.applications = [];
    ctrl.credits = [];
    ctrl.client = null;
    ctrl.getAllApplicationsByClient = function(id){
        ClientsFact.showAplicationsByClient(id).then(response=> {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay aplicaciones", 'warning');
            } else {

                console.log(response.data);
                ctrl.applications = response.data.applications;
            }
        }).catch(function (error){
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
        })
    }
    ctrl.getAllCreditsByClient = function(id){
        ClientsFact.showCreditsByClient(id).then(response=> {
            if (response.data.error) {
                SweetAlert.swal('Mensaje', "No hay Creditos", 'warning');
            } else {

                console.log(response.data);
                ctrl.credits = response.data.credits;
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
    ctrl.getClient();
    ctrl.getAllApplicationsByClient(ctrl.client.id);
    ctrl.getAllCreditsByClient(ctrl.applications[0].id);
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
/**
 * Created by Enrique on 22/05/2017.
 */
antejo.controller('ClientMainCtrl', ['$filter', 'SweetAlert','ClientsFact', function($filter, SweetAlert,ClientsFact) {
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
    // Inicializacion
    ctrl.GetAll();
}]);
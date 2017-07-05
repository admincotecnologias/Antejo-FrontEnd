/**
 * Created by cotech on 28/06/17.
 */
/**
 * Created by Enrique on 22/05/2017.
 */
antejo.controller('ClientWalletCtrl', ['$filter', 'SweetAlert','ClientsFact','$routeParams', function($filter, SweetAlert,ClientsFact,$routeParams) {
    var ctrl = this;
    ctrl.menu = 'application';
    ctrl.applications = [];
    ctrl.credits = [];

    ctrl.prepareWallet = function(){
        var idClient = $routeParams.idClient;
        ClientsFact.showClients(idClient).then(function (response) {

            if (response.data.error) {
                SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "warning");
            } else {
                ctrl.client = response.data.client;
                ClientsFact.allApplications().then(response=> {
                    if (response.data.error) {
                        SweetAlert.swal('Mensaje', "No hay aplicaciones", 'warning');
                    } else {
                        console.log(response.data);
                        let allApplications = response.data.applications;
                        for(i = 0 ;i < allApplications.length;i++){
                            if(allApplications[i].idclient == idClient){
                                ctrl.applications.push(allApplications[i]);
                            }
                        }
                        console.log(ctrl.applications);
                        console.log(":(");
                        ClientsFact.allCredits().then(response=> {
                            if (response.data.error) {
                                SweetAlert.swal('Mensaje', "No hay Creditos", 'warning');
                            } else {
                                console.log("hola");
                                console.log(response.data);
                                let allCredits = response.data.credits;
                                for(i = 0 ;i < allCredits.length;i++){
                                    if(allApplications[allCredits[i].application-1].idclient == idClient){
                                        ctrl.credits.push(allCredits[i]);
                                    }
                                }
                                console.log(ctrl.credits);
                            }
                        }).catch(function (error){
                            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
                        })
                    }
                }).catch(function (error){
                    SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error" );
                })
            }
        })
    }
    ctrl.prepareWallet();

}]);
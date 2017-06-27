/**
 * Created by Enrique on 24/05/2017.
 */
antejo.controller('BanksMainCtrl', ['$filter', 'SweetAlert','BancosFact', function($filter, SweetAlert,BancosFact) {
    var ctrl = this;
    ctrl.banks = [];
    ctrl.bank = {
        id: null,
        name:null
    }
    ctrl.GetAll = function () {
        BancosFact.AllBanco().then(response=>{
            if(response.data.error){
                SweetAlert.swal('Mensaje',"No hay Clientes.",'warning');
            }else{
                console.log(response.data)
                ctrl.banks = response.data.banks;
            }
        })
    }
    ctrl.Create = function(){
        BancosFact.AddBanco(ctrl.bank.name).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                ctrl.bank = {
                    id: null,
                    name:null
                }
                SweetAlert.swal("Aviso:",response.data.message,"success");
                ctrl.GetAll();
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso:","No se pudo conectar con el servidor.","error");
        })
    }
    ctrl.delete = function(bank){
        BancosFact.DeleteBanco(bank.id).then(function (response) {
            if(response.data.error){
                SweetAlert.swal("Aviso:",response.data.message,"warning");
            }else{
                SweetAlert.swal("Aviso:",response.data.message,"success");
                ctrl.GetAll();
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso:","No se pudo conectar con el servidor.","error");
        })
    }
    // Inicializacion
    ctrl.GetAll();
}]);
/**
 * Created by Enrique on 09/05/2017.
 */
antejo.controller('StockholderCtrl', ['$filter', 'SweetAlert','FoundFact', function($filter, SweetAlert,FoundFact) {
    var ctrl = this;
    ctrl.stockholders = [];
    ctrl.GetAll = function () {
        FoundFact.allStockholders().then(response=>{
            if(response.data.stockholders.length==0){
                SweetAlert.swal('Mensaje',"No hay Fondeadores.",'warning');
            }else{
                console.log(response.data)
                ctrl.stockholders = response.data.stockholders;
            }
        })
    }

    // Inicializacion
    ctrl.GetAll();
}]);
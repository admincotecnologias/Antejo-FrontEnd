/**
 * Created by Enrique on 18/05/2017.
 */
antejo.controller('FundsCtrl', ['$filter', 'SweetAlert','FoundFact','$routeParams', 'DTOptionsBuilder',function($filter, SweetAlert,FoundFact,$routeParams,DTOptionsBuilder) {
    this.idStock = $routeParams.idStock;
    var ctrl = this;
    ctrl.fund = [];

    ctrl.AddFile = function ($file) {
        if($file){
            $scope.modalpay.file.push($file);
        }
        console.log($scope.modalpay.file)
    }
    ctrl.deleteFile = function (index) {
        $scope.modalpay.file.splice(index,1);
        if($scope.modalpay.file.length<1){
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        }else{
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
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

    console.log(ctrl.dtOptions)

    ctrl.GetAll = function () {
        FoundFact.fundsByStock(ctrl.idStock).then(response=>{
            if(response.data.error){
                ctrl.stock = response.data.stock;
                console.log(ctrl.stock.type)
                if(ctrl.stock.type=='Moral'){
                    ctrl.title = ctrl.stock.businessname;
                }else{
                    ctrl.title = ctrl.stock.name+' '+ctrl.stock.lastname;
                }
                SweetAlert.swal('Mensaje',"No hay Creditos para este Fondeador.",'warning');
            }else{
                console.log(response);
                for(var i = 0;i<response.data.fund.length;i++){
                    response.data.fund[i].statuscode = 0;
                    if(response.data.fund[i].status == 'Liquidado'){
                        response.data.fund[i].statuscode = 3;
                        continue;
                    }
                    if((Date.now()/1000)>response.data.fund[i].datelimit){
                        response.data.fund[i].statuscode = 1;
                        if(Date.now()/1000>response.data.fund[i].grace){
                            response.data.fund[i].statuscode = 2;
                        }
                    }
                    response.data.fund[i].datelimit = new Date((response.data.fund[i].datelimit*1000)+(1000*60*60*24));
                }
                ctrl.fund = response.data.fund;
                ctrl.stock = response.data.stock;
                console.log(ctrl.stock.type)
                if(ctrl.stock.type=='Moral'){
                    ctrl.title = ctrl.stock.businessname;
                }else{
                    ctrl.title = ctrl.stock.name+' '+ctrl.stock.lastname;
                }
            }
        }).catch(function (error) {
            console.log(error);
            if(error.status == 401){
                SweetAlert.swal({
                        title: "Aviso",
                        text: "Tu sesion ha expirado.",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Ok",
                        closeOnConfirm: false
                    },
                    function(){
                        localStorage.clear();
                        window.location.reload();
                    });
            }
            SweetAlert.swal('Error','Error al comunicarse con el servidor.','error')
        })
    }

    // Inicializacion
    ctrl.GetAll();
}]);
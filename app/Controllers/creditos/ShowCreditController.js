/**
 * Created by Enrique on 21/03/2017.
 */
antejo.controller('ShowCreditCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload","CreditsFact",'$routeParams', function($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload,CreditsFact,$routeParams) {


    const CondicionType = "CONDICION";
    const PagoType = "PAGO";
    $scope.DateNow = new Date().toDateString();
    $scope.credit = [];
    $scope.cliente = '';
    $scope.lastMove = {}
    $scope.proyecto = '';
    $scope.moves = '';
    $scope.idCredito = $routeParams.idCredito;
    $scope.selectedCondicion = '';
    $scope.CreditPadre = '';
    $scope.modalpay={
        pay:'',
        sel_moneda:'',
        currency:'',
        date: '',
        file:[]
    }
    $scope.fileData = {
        file : null,
        idapplication : null,
        type : null
    };
    $scope.selectPago = function(credito){
        $scope.modalDetallePago = credito
    }
    $scope.lastCredit = {}
    $scope.newMove = {}
    $scope.AddFilePago = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.credit[0].application;
            $scope.fileData.type = PagoType;
        }
        $scope.modalpay.file = $file;
        console.log($scope.fileData);
        console.log("PFSL");
    }
    $scope.AddFileDisposicion = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.credit[0].application;
            $scope.fileData.type = CondicionType;
        }
        console.log($scope.fileData);
        console.log("DFSL");
        return;
    }
    $scope.deleteFile = function (index) {
        $scope.modalpay.file.splice(index, 1);
        if ($scope.modalpay.file.length < 1) {
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        } else {
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    }
    $scope.deleteFile = function (index) {
        $scope.modalpay.file.splice(index,1);
        if($scope.modalpay.file.length<1){
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        }else{
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    }

    $scope.insertCondition = function () {
        console.log($scope.CreditPadre);
        $scope.CreditPadre.start_date = new Date(Date.parse($scope.CreditPadre.start_date));
        let lastcredit = new Date($scope.lastCredit.start_date);
        var auxDate = new Date(angular.copy($scope.CreditPadre.start_date));
        if(($scope.CreditPadre.start_date<auxDate.setMonth(auxDate.getMonth()+$scope.CreditPadre.term)) && ($scope.CreditPadre.start_date>lastcredit)){
            if($scope.CreditPadreUnedit!=$scope.CreditPadre && $scope.credit.length>0){


                $scope.CreditPadre.typemove = CondicionType;
                if($scope.fileData.file != null){
                    CreditsFact.addFile(Form).then(function(response){
                        if(response.data.error){
                            SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                        }else{
                            $scope.CreditPadre.idref = response.data.file.id;
                            $scope.addDisposition();
                        }

                    });
                }else{
                    $scope.addDisposition();
                }
            }else
                SweetAlert.swal("Mensaje","Condiciones Identicas","error");
        }
        else{
            SweetAlert.swal("Mensaje","Fecha fuera de plazo.","error");
        }
    };

    $scope.addDisposition = function() {
        CreditsFact.addCondition($scope.CreditPadre,function (response) {
            if(response.error){
                SweetAlert.swal("Error:","No se agrego disposición.","error");
            }else{
                $scope.getData();
                $("#modalCondicion").modal("hide");
                SweetAlert.swal("Mensaje","Condición agregada.","success")
            }
        });
    }

    $scope.addTerm= function(){
        var aux = new Date( angular.copy($scope.CreditPadre.start_date));
        aux.setMonth(aux.getMonth()+angular.copy($scope.CreditPadre.term));
        return new Date(aux.setHours(0,0,0,0));
    }
    $scope.CalcularPago = function(){
        console.log($scope.modalpay)
        var newMove = angular.copy($scope.lastMove);
        var dateFinal = $scope.addTerm()
        var pago = angular.copy(parseFloat($scope.modalpay.pay))
        var lastDate = new Date(Date.parse(angular.copy($scope.lastMove.period)))
        lastDate.setHours(0,0,0,0);
        var SelectDate = new Date($scope.modalpay.date);
        SelectDate.setHours(0,0,0,0);
        var diffDays = Math.floor((SelectDate.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha seleccionada y la del ultimo movimiento
        diffDays = diffDays<0?0:diffDays;
        var diffDays2 = Math.floor((dateFinal.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha final y la ultima
        diffDays2 = diffDays2<0?0:diffDays2;
        var diffDays3 = Math.floor((SelectDate.getTime()-new Date($scope.addTerm().setDate($scope.addTerm().getDate()+$scope.CreditPadre.grace_days)).getTime())/1000/60/60/24) //Diferecia si se pasa el
        diffDays3 = diffDays3<0?0:diffDays3;
        newMove.period = angular.copy(SelectDate)
        newMove.pay = angular.copy(pago)
        if(dateFinal.getTime()>=SelectDate.getTime()){
            var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays));
            var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            $scope.liquidarmodal = ((angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat($scope.lastMove.capital_balance))));
        }
        if((new Date(dateFinal.setDate(($scope.addTerm().getDate()+$scope.CreditPadre.grace_days))).getTime()>=SelectDate.getTime())&&(SelectDate.getTime()>=$scope.addTerm().getTime())){
            var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays2));
            var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            $scope.liquidarmodal =((angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat($scope.lastMove.capital_balance))));
        }
        if(new Date($scope.addTerm().setDate($scope.addTerm().getDate()+$scope.CreditPadre.grace_days)).getTime()<SelectDate.getTime()){
            if(diffDays==0){
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance));
                var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance));
                var ivaMoratorio = interesmoratorio*($scope.CreditPadre.iva/100);
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                newMove.interest_arrear = angular.copy(interesmoratorio)
                newMove.iva_arrear = angular.copy(ivaMoratorio)
                $scope.liquidarmodal = ((angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat($scope.lastMove.capital_balance))));
            }else{
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                    (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays2));
                var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance))+((angular.copy(parseFloat($scope.lastMove.capital_balance))+angular.copy(parseFloat(interes))+angular.copy(parseFloat($scope.lastMove.interest_arrear_balance)))*(angular.copy((parseFloat($scope.CreditPadre.interest_arrear))/100/365)*diffDays3));
                var ivaMoratorio = interesmoratorio*($scope.CreditPadre.iva/100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                newMove.interest_arrear = angular.copy(interesmoratorio)
                newMove.iva_arrear = angular.copy(ivaMoratorio)
                $scope.liquidarmodal = (angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat($scope.lastMove.capital_balance)));
            }
        }
        console.log(newMove);
        if(ivaMoratorio!=null){
            if(pago>=ivaMoratorio){
                pago-=ivaMoratorio
                newMove.pay_iva_arrear = angular.copy(ivaMoratorio)
                newMove.interest_arrear_iva_balance = 0
            } else{
                pagoIvaMoratorio=pago
                newMove.pay_iva_arrear = angular.copy(pago)
                newMove.interest_arrear_iva_balance -= angular.copy(pago)
                pago=0
            }
        }else {
            newMove.pay_iva_arrear = 0
            newMove.interest_arrear_iva_balance = 0
        }if(interesmoratorio != null){
            if(pago>=interesmoratorio){
                pago-=interesmoratorio
                newMove.pay_interest_arrear = angular.copy(interesmoratorio)
                newMove.interest_arrear_balance = 0
            }  else{
                pagoInteres=pago
                newMove.pay_interest_arrear = angular.copy(pago)
                newMove.interest_arrear_balance -= angular.copy(pago)
                pago=0
            }
        }else{
            newMove.pay_interest_arrear = 0
            newMove.interest_arrear_balance -= 0
        }
        if(pago>=iva){
            pago-=iva
            newMove.pay_iva = angular.copy(iva)
            newMove.iva_balance = 0
            pagoIva=iva
        } else{
            pagoIva=pago
            newMove.pay_iva = angular.copy(pago)
            newMove.iva_balance -= angular.copy(pago)
            pago=0
        }
        if(pago>=interes){
            pago-=interes
            newMove.pay_interest = angular.copy(interes)
            newMove.interest_balance = 0
            pagoInteres = interes
        }  else{
            pagoInteres=pago
            newMove.pay_interest = angular.copy(pago)
            newMove.interest_balance -= angular.copy(pago)
            pago=0
        }
        if(pago=>$scope.lastMove.capital_balance && pago>0){
            pagoCapital=pago
            newMove.capital_balance -= pago
            newMove.pay_capital = pagoCapital
        }else{
            if(pago==0){
                pagoCapital=0
            }else {
                pagoCapital=$scope.lastMove.capital_balance
            }
        }
        $scope.newMove = newMove;
        $scope.calcInterest = $filter('currency')(angular.copy(pagoInteres),'$',3)
        $scope.calcIva = $filter('currency')(angular.copy(pagoIva),'$',3)
        $scope.calcMonto = $filter('currency')(angular.copy(pagoCapital),'$',3)
        console.log($scope.modalpay.pay);
        console.log($scope.liquidarmodal);
    }
    $scope.savePago = function (){
        var Form = new FormData();
        Form.append('file',$scope.fileData.file);
        Form.append('idapplication',$scope.fileData.idapplication);
        Form.append('type',$scope.fileData.type);
        $scope.newMove.typemove = PagoType;
        if($scope.fileData.file != null){
            CreditsFact.addFile(Form).then(function(response){
                if(response.data.error){
                    SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                }else{
                    $scope.newMove.idref = response.data.file.id;
                    $scope.addPay();
                }

            });
        }else{
            $scope.addPay();
        }


    }
    $scope.addPay = function() {
        CreditsFact.addCreditPay($scope.newMove,function (response) {
            if(response.error){
                SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
            }else{
                SweetAlert.swal({
                        title: "Guardado",
                        text: "PAGO CREADO",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#4bdd86",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        $scope.modalpay.file = null;
                        if (isConfirm) {
                            location.reload();
                        }
                    }
                );
            }
        });
    }
    $scope.SelectCondition = function (credito) {
        $scope.ModalDetalleCondicion = credito
    }
    $scope.PagoLiquidacion = function () {
        try{
            var newMove = angular.copy($scope.lastMove);
            var dateFinal = $scope.addTerm()
            var pago = angular.copy(parseFloat($scope.modalpay.pay))
            var lastDate = new Date(Date.parse(angular.copy($scope.lastMove.period)))
            lastDate.setHours(0,0,0,0)
            var newDate = Date.now();
            var SelectDate = new Date((new Date(newDate)).setHours(0,0,0,0));//Fecha de hoy
            var diffDays = Math.floor((SelectDate.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha seleccionada y la del ultimo movimiento
            diffDays = diffDays<0?0:diffDays;
            var diffDays2 = Math.floor((dateFinal.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha final y la ultima
            diffDays2 = diffDays2<0?0:diffDays2;
            var diffDays3 = Math.floor((SelectDate.getTime()-new Date($scope.addTerm().setDate($scope.addTerm().getDate()+$scope.CreditPadre.grace_days)).getTime())/1000/60/60/24) //Diferecia si se pasa el
            diffDays3 = diffDays3<0?0:diffDays3;
            newMove.period = angular.copy(SelectDate)
            newMove.pay = angular.copy(pago)
            if(dateFinal.getTime()>=SelectDate.getTime()){
                console.log('fecha activa')
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                    (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays));
                var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                console.log(SelectDate,diffDays,lastDate)
                $scope.liquidacion = $filter("currency")((angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat($scope.lastMove.capital_balance))),'$',3);
            }
            if((new Date(dateFinal.setDate(($scope.addTerm().getDate()+$scope.CreditPadre.grace_days))).getTime()>=SelectDate.getTime())&&(SelectDate.getTime()>=$scope.addTerm().getTime())){
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                    (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays2));
                var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                $scope.liquidacion = $filter("currency")((angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat($scope.lastMove.capital_balance))),'$',3);

            }
            if(new Date($scope.addTerm().setDate($scope.addTerm().getDate()+$scope.CreditPadre.grace_days)).getTime()<SelectDate.getTime()){
                if(diffDays==0){
                    var interes = parseFloat(angular.copy($scope.lastMove.interest_balance));
                    var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                    var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance));
                    var ivaMoratorio = interesmoratorio*($scope.CreditPadre.iva/100);
                    newMove.interest = angular.copy(interes)
                    newMove.iva = angular.copy(iva)
                    newMove.interest_arrear = angular.copy(interesmoratorio)
                    newMove.iva_arrear = angular.copy(ivaMoratorio)
                    $scope.liquidacion = ($filter)((angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat($scope.lastMove.capital_balance))),'$',3);

                }else{
                    var interes = parseFloat(angular.copy($scope.lastMove.interest_balance))+
                        (angular.copy(parseFloat($scope.lastMove.capital_balance))*((parseFloat($scope.CreditPadre.interest)/100/365)*diffDays2));
                    var iva = interes*(parseFloat($scope.CreditPadre.iva)/100)
                    var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance))+((angular.copy(parseFloat($scope.lastMove.capital_balance))+angular.copy(parseFloat(interes))+angular.copy(parseFloat($scope.lastMove.interest_arrear_balance)))*(angular.copy((parseFloat($scope.CreditPadre.interest_arrear))/100/365)*diffDays3));
                    var ivaMoratorio = interesmoratorio*($scope.CreditPadre.iva/100)
                    newMove.interest = angular.copy(interes)
                    newMove.iva = angular.copy(iva)
                    newMove.interest_arrear = angular.copy(interesmoratorio)
                    newMove.iva_arrear = angular.copy(ivaMoratorio)
                    $scope.liquidacion = ($filter)((angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat($scope.lastMove.capital_balance))),'$',3);

                }
            }
        }catch(exp){
            console.log(exp)
        }
    }
    $scope.PagoLiquidacionModal = function (lastCredit,lastMove,CreditPadre) {
        try{
            var auxDate = Date.parse($scope.modalpay.date);
            var dateFinal = CreditPadre.start_date;
            dateFinal = new Date(dateFinal.setMonth(parseFloat(CreditPadre.term)));
            dateFinal = new Date(dateFinal.setDate(parseFloat(CreditPadre.grace_days)));
            var interes = 0
            var iva = 0
            var pago=0
            if(lastMove.hasOwnProperty("capital_balance")){
                if(auxDate.getTime()>dateFinal.getTime()){
                    var diffDays1 = Math.floor(dateFinal.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                    var diffDays2 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - dateFinal.getTime()/(1000 * 3600 * 24));
                    interes = angular.copy(lastMove.capital_balance)*(diffDays1*(parseFloat(angular.copy(lastCredit.interest)/100)/365));
                    interes += (angular.copy(lastMove.capital_balance)+angular.copy(interes))*(diffDays2*(parseFloat(angular.copy(lastCredit.interest_arrear)/100)/365));
                    iva = angular.copy(interes)*.16;
                    pago = lastMove == 0 ? 0 : interes+iva+angular.copy(parseFloat(lastMove.capital_balance));
                    $scope.liquidarmodal = pago
                }else{
                    var diffDays1 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                    interes = angular.copy(parseFloat(lastMove.capital_balance))*(diffDays1*(angular.copy(parseFloat(lastCredit.interest)/100)/365));
                    iva = angular.copy(interes)*.16;
                    pago = parseFloat(interes)+parseFloat(iva)+angular.copy(parseFloat(lastMove.capital_balance));
                    $scope.liquidarmodal = pago
                }
            }
        }catch (exp){
            console.log(exp)
        }
    }
    $scope.getData = function () {
        CreditsFact.showCredit($scope.idCredito,function (callback) {
            if(callback.error){
                SweetAlert.swal('Mensaje',"No hay Creditos","warning");
            }else {
                console.log( angular.copy(callback));
                $scope.credit = angular.copy(callback.credits);
                $scope.cliente = callback.client;
                $scope.proyecto = callback.project;
                $scope.moves = callback.moves;
                $scope.selectedCondicion = callback.moves[$scope.idCredito];
                $scope.CreditPadre = angular.copy(callback.lastCondition);
                delete $scope.CreditPadre.updated_at;
                delete $scope.CreditPadre.deleted_at;
                delete $scope.CreditPadre.created_at;
                $scope.lastCredit=angular.copy(callback.credits.pop());
                $scope.CreditPadreUnedit = angular.copy($scope.CreditPadre);
                delete $scope.CreditPadre.id;
                $scope.CreditPadre.start_date = new Date($scope.CreditPadre.start_date);
                $scope.DateMin = new Date(callback.lastmove.period).toDateString();
                $scope.lastMove = callback.lastmove;
                //console.log($scope.lastCredit);
                $(document).ready(function () {
                    $("#condicion_"+$scope.CreditPadre.extends).addClass("selectRow");
                });
                //console.log($scope.credit);
                setTimeout(function () {
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                },500);
            }
            $scope.PagoLiquidacion();
        })
    }
    // Inicializacion
    $scope.getData();
}]);
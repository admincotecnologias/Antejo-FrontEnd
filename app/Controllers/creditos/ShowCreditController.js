/**
 * Created by Enrique on 21/03/2017.
 */
antejo.controller('ShowCreditCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload","CreditsFact",'$routeParams','$filter', function($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload,CreditsFact,$routeParams,$filter) {

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
    $scope.selectPago = function(credito){
        $scope.modalDetallePago = credito
    }
    $scope.lastCredit = {}
    $scope.newMove = {}
    $scope.AddFile = function ($file) {
        if($file){
            $scope.modalpay.file.push($file);
        }
        console.log($scope.modalpay.file)
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
        console.log(Date.parse($scope.CreditPadre.start_date))
        $scope.CreditPadre.start_date = new Date(Date.parse($scope.CreditPadre.start_date))
        let lastcredit = new Date($scope.lastCredit.start_date)
        var auxDate = new Date(angular.copy($scope.credit[0].start_date));
        if(($scope.CreditPadre.start_date<auxDate.setMonth(auxDate.getMonth()+$scope.CreditPadre.term)) && ($scope.CreditPadre.start_date>lastcredit)){
            if($scope.CreditPadreUnedit!=$scope.CreditPadre && $scope.credit.length>0){
                CreditsFact.addCondition($scope.CreditPadre,function (callback) {
                    if(callback && callback.error==false){
                        $scope.getData();
                        $("#modalCondicion").modal("hide");
                        SweetAlert.swal("Mensaje","Condición agregada.","success")
                    }
                })
            }else
                SweetAlert.swal("Mensaje","Condiciones Identicas","error");
        }
        else{
            SweetAlert.swal("Mensaje","Fecha fuera de plazo.","error");
        }
    }
    $scope.CalcularPago = function(){
                delete $scope.newMove;
                $scope.newMove = angular.copy($scope.lastMove);
                var auxDate = new Date($scope.lastCredit.start_date);
                auxDate = auxDate.setMonth(auxDate.getMonth()+$scope.lastCredit.term);
                auxDate = new Date(Math.ceil(auxDate+($scope.lastCredit.grace_days*1000 * 3600 * 24)));
                var diffDays = Math.ceil(new Date(Date.parse($scope.modalpay.date)).getTime()/(1000 * 3600 * 24) - new Date($scope.lastMove.period).getTime()/(1000 * 3600 * 24))-1;
                var newDate = Date.parse($scope.modalpay.date);
                if(newDate < auxDate){
                    if(diffDays>=0){
                        $scope.newMove.credit = angular.copy($scope.CreditPadreUnedit.id);
                        $scope.newMove.period = angular.copy(new Date(Date.parse($scope.modalpay.date)));
                        $scope.newMove.pay = parseFloat(angular.copy($scope.modalpay.pay));
                        $scope.newMove.currency = angular.copy($scope.modalpay.sel_moneda);
                        $scope.newMove.type_currency = $scope.modalpay.sel_moneda=="MXN"? 1 : parseFloat(angular.copy($scope.modalpay.currency));
                        var capital = parseFloat(angular.copy($scope.newMove.capital_balance));
                        var interes = parseFloat(((angular.copy(capital)*((angular.copy($scope.lastCredit.interest))/100/365))*diffDays))+parseFloat((angular.copy($scope.newMove.interest_balance)));
                        var iva = parseFloat(angular.copy((angular.copy(interes)*(angular.copy($scope.lastCredit.iva)/100))));
                        var pay = parseFloat(angular.copy($scope.newMove.pay));
                        if(pay>(iva+interes)){
                            $scope.newMove.pay_interest = interes;
                            $scope.newMove.pay_iva = iva;
                            $scope.newMove.capital_balance = capital - (pay - (interes+iva));
                            $scope.newMove.pay_capital = (pay - (interes+iva));
                            $scope.newMove.capital += angular.copy($scope.newMove.pay_capital);
                            $scope.newMove.interest = interes;
                            $scope.newMove.iva = iva;
                            $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                            $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                            $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                        }else{
                            console.log("segundo if",$scope.newMove.period.toDateString())
                            $scope.newMove.pay_interest = pay/(1+($scope.lastCredit.iva/100));
                            $scope.newMove.pay_iva = pay - $scope.newMove.pay_interest;
                            $scope.newMove.capital_balance = capital;
                            $scope.newMove.pay_capital = 0;
                            $scope.newMove.interest_balance -= $scope.newMove.pay_interest;
                            $scope.newMove.iva_balance -= $scope.newMove.pay_iva;
                            $scope.newMove.interest = interes;
                            $scope.newMove.iva = iva;
                            $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                            $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                            $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                        }
                    }else{
                        SweetAlert.swal("Error","Fecha fuera de rango, ultimo movimiento: "+$filter("date")($scope.lastMove.period,'dd/MM/yyyy'),'error');
                    }
                }else{
                    var diffDays = Math.ceil(Date.parse($scope.modalpay.date).getTime()/(1000 * 3600 * 24) - auxDate.getTime()/(1000 * 3600 * 24));
                    var diffDays_2 = Math.ceil(auxDate.getTime()/(1000*3600*24) - new Date($scope.lastMove.period).getTime()/(1000*3600*24));
                    diffDays_2 = diffDays_2>0?diffDays_2:0;
                    $scope.newMove.credit = angular.copy($scope.lastCredit.id);
                    $scope.newMove.period = angular.copy($filter('date')(Date.parse($scope.modalpay.date),'dd/MM/yyyy'));
                    $scope.newMove.pay = parseFloat(angular.copy($scope.modalpay.pay));
                    $scope.newMove.type_currency = angular.copy($scope.modalpay.sel_moneda);
                    $scope.newMove.currency  = $scope.modalpay.sel_moneda=="MXN"? 1 : parseFloat(angular.copy($scope.modalpay.currency));
                    var capital = parseFloat(angular.copy($scope.newMove.capital_balance));
                    var interes = parseFloat((angular.copy(capital)*((angular.copy($scope.lastCredit.interest)/100/365)*diffDays_2)))+$scope.lastMove.interest_balance;
                    var iva = parseFloat(angular.copy($scope.newMove.iva_balance)+(angular.copy(interes))*(angular.copy($scope.lastCredit.iva)/100));
                    var pay = parseFloat(angular.copy($scope.newMove.pay));
                    var interestArrear = parseFloat((angular.copy(capital)+angular.copy(interes))*((angular.copy($scope.lastCredit.interest_arrear)/100/365)*diffDays))+parseFloat(angular.copy($scope.lastMove.interest_arrear_balance));
                    var ivaArrear = angular.copy(interestArrear)*(angular.copy($scope.lastCredit.iva)/100);
                    $scope.newMove.interest = interes;
                    $scope.newMove.iva = iva;
                    $scope.newMove.interest_arrear = interestArrear;
                    $scope.newMove.iva_arrear = ivaArrear;
                    if(pay>=(ivaArrear+interestArrear)){
                        $scope.newMove.interest_arrear = 0;
                        $scope.newMove.iva_arrear = 0;
                        $scope.newMove.pay_interest_arrear = interestArrear;
                        $scope.newMove.pay_iva_arrear = ivaArrear;
                        pay -= (ivaArrear+interestArrear);
                        if(pay>0){
                            if(pay>=(interes+iva)){
                                $scope.newMove.interest = 0;
                                $scope.newMove.iva = 0;
                                $scope.newMove.pay_capital = 0;
                                $scope.newMove.pay_interest = interes;
                                $scope.newMove.pay_iva = iva;
                                pay -= (interes+iva);
                                if(pay>0){
                                    $scope.newMove.capital_balance -= pay;
                                    $scope.newMove.capital += pay;
                                    $scope.newMove.pay_capital = pay;
                                }
                            }else{
                                $scope.newMove.interest = pay/(1+(angular.copy($scope.lastCredit.iva)/100));
                                $scope.newMove.iva = pay-angular.copy($scope.newMove.interest);
                                $scope.newMove.pay_capital = 0;
                                $scope.newMove.pay_interest = $scope.newMove.interest;
                                $scope.newMove.pay_iva = $scope.newMove.iva;
                            }
                        }else{
                            $scope.newMove.interest = interes;
                            $scope.newMove.iva = iva;
                            $scope.newMove.pay_capital = 0;
                            $scope.newMove.pay_interest = 0;
                            $scope.newMove.pay_iva = 0;
                        }
                    }else{
                        $scope.newMove.interest_arrear = pay/(1+(angular.copy($scope.lastCredit.iva)/100));
                        $scope.newMove.iva_arrear = pay-angular.copy($scope.newMove.interest_arrear);
                        $scope.newMove.pay_interest_arrear = angular.copy($scope.newMove.interest_arrear);
                        $scope.newMove.pay_iva_arrear = angular.copy($scope.newMove.iva_arrear);
                        pay -= (ivaArrear+interestArrear);
                    }
                    if($scope.newMove.capital_balance<=0){
                        $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                        $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                        $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                        var condition = $scope.lastCredit;
                        condition.status = "Liquidado";
                    }else{
                        $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                        $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                        $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                    }
                }
    }
    $scope.savePago = function (){
        CreditsFact.addCreditPay($scope.newMove,function (callback) {
            if(callback.error==false){
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
                        if (isConfirm) {
                            location.reload();
                        }
                    });
            }else if(callback.errors.length>0){
                var text = "";
                for(let i = 0;i<callback.errors.length;i++){
                    text+= '\n' + callback.errors[i];
                }
                SweetAlert.swal({
                        title: callback.message,
                        text: text,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#dd654f",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            //location.reload();
                        }
                    });
            }else{
                SweetAlert.swal({
                        title: "Error",
                        text: callback.message,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#dd654f",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            //location.reload();
                        }
                    });
            }
        })
    }
    $scope.SelectCondition = function (credito) {
        $scope.ModalDetalleCondicion = credito
    }
    $scope.PagoLiquidacion = function (lastCredit,lastMove,CreditPadre) {
        try{
            var auxDate = new Date(Date.now());
            var dateFinal = CreditPadre.start_date;
            dateFinal = new Date(dateFinal.setMonth(parseFloat(CreditPadre.term)));
            dateFinal = new Date(dateFinal.setDate(parseFloat(CreditPadre.grace_days)))
            var interes = 0
            var iva = 0
            var pago=0
            if(auxDate.getTime()>dateFinal.getTime()){
                var diffDays1 = Math.floor(dateFinal.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                var diffDays2 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - dateFinal.getTime()/(1000 * 3600 * 24));
                interes = angular.copy(lastMove.capital_balance)*(diffDays1*(parseFloat(angular.copy(lastCredit.interest)/100)/365));
                interes += (angular.copy(lastMove.capital_balance)+angular.copy(interes))*(diffDays2*(parseFloat(angular.copy(lastCredit.interest_arrear)/100)/365));
                iva = angular.copy(interes)*.16;
                pago = interes+iva+angular.copy(parseFloat(lastMove.capital_balance));
                $scope.liquidacion = pago
            }else{
                var diffDays1 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                interes = angular.copy(parseFloat(lastMove.capital_balance))*(diffDays1*(angular.copy(parseFloat(lastCredit.interest)/100)/365));
                iva = angular.copy(interes)*.16;
                pago = parseFloat(interes)+parseFloat(iva)+angular.copy(parseFloat(lastMove.capital_balance));
                $scope.liquidacion = pago
                console.log(interes,iva,pago,diffDays1,parseFloat(lastMove.capital_balance),auxDate.getTime(),dateFinal)
            }
        }catch (exp){
            console.log(exp)
        }
    }
    $scope.PagoLiquidacionModal = function (lastCredit,lastMove,CreditPadre) {
        try{
            var auxDate = Date.parse($scope.modalpay.date);
            var dateFinal = CreditPadre.start_date;
            dateFinal = new Date(dateFinal.setMonth(parseFloat(CreditPadre.term)));
            dateFinal = new Date(dateFinal.setDate(parseFloat(CreditPadre.grace_days)))
            var interes = 0
            var iva = 0
            var pago=0
            if(auxDate.getTime()>dateFinal.getTime()){
                var diffDays1 = Math.floor(dateFinal.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                var diffDays2 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - dateFinal.getTime()/(1000 * 3600 * 24));
                interes = angular.copy(lastMove.capital_balance)*(diffDays1*(parseFloat(angular.copy(lastCredit.interest)/100)/365));
                interes += (angular.copy(lastMove.capital_balance)+angular.copy(interes))*(diffDays2*(parseFloat(angular.copy(lastCredit.interest_arrear)/100)/365));
                iva = angular.copy(interes)*.16;
                pago = interes+iva+angular.copy(parseFloat(lastMove.capital_balance));
                $scope.liquidarmodal = pago
            }else{
                var diffDays1 = Math.floor(auxDate.getTime()/(1000 * 3600 * 24) - new Date(lastMove.period).getTime()/(1000 * 3600 * 24));
                interes = angular.copy(parseFloat(lastMove.capital_balance))*(diffDays1*(angular.copy(parseFloat(lastCredit.interest)/100)/365));
                iva = angular.copy(interes)*.16;
                pago = parseFloat(interes)+parseFloat(iva)+angular.copy(parseFloat(lastMove.capital_balance));
                $scope.liquidarmodal = pago
                console.log(interes,iva,pago,diffDays1,parseFloat(lastMove.capital_balance),auxDate.getTime(),dateFinal)
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
                $scope.credit = angular.copy(callback.credits);
                $scope.cliente = callback.client;
                $scope.proyecto = callback.project;
                $scope.moves = callback.moves;
                $scope.selectedCondicion = callback.moves[$scope.idCredito];
                $scope.CreditPadre = angular.copy($scope.credit[0]);
                delete $scope.CreditPadre.updated_at;
                delete $scope.CreditPadre.deleted_at;
                delete $scope.CreditPadre.created_at;
                $scope.CreditPadre.extends = $scope.CreditPadre.id;
                $scope.lastCredit=angular.copy(callback.credits.pop())
                $scope.CreditPadreUnedit = angular.copy($scope.CreditPadre);
                delete $scope.CreditPadre.id;
                $scope.CreditPadre.start_date = new Date($scope.CreditPadre.start_date)
                $scope.DateMin = new Date(callback.lastmove.period).toDateString()
                $scope.lastMove = callback.lastmove;
                console.log($scope.lastCredit)
                $(document).ready(function () {
                    $("#condicion_"+$scope.CreditPadre.extends).addClass("selectRow");
                });
                console.log($scope.credit)
                setTimeout(function () {
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                },500);
            }
            $scope.PagoLiquidacion($scope.lastCredit,$scope.lastMove,$scope.CreditPadre);
        })
    }
    // Inicializacion
    $scope.getData();
}]);
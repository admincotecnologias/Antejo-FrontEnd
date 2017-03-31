/**
 * Created by Enrique on 21/03/2017.
 */
antejo.controller('ShowCreditCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload","CreditsFact",'$routeParams','$filter', function($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload,CreditsFact,$routeParams,$filter) {

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
    $scope.lastCredit = {}
    $scope.newMove = {}
    $scope.selectCondicion = function (credito) {
        $("table tbody tr").removeClass("selectRow");
        $("#condicion_"+credito.id).addClass("selectRow");
        $scope.selectedCondicion = $scope.moves[credito.id];
    }
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
        var auxDate = new Date(angular.copy($scope.credit[0].start_date));
        if(($scope.CreditPadre.start_date<auxDate.setMonth(auxDate.getMonth()+$scope.CreditPadre.term)) && ($scope.CreditPadre.start_date>$scope.lastCredit.start_date)){
            if($scope.CreditPadreUnedit!=$scope.CreditPadre && $scope.credit.length>1){
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
        switch ($scope.CreditPadre.type){
            case 1:{
                delete $scope.newMove;
                $scope.newMove = angular.copy($scope.lastMove);
                var auxDate = new Date($scope.lastCredit.start_date);
                auxDate = auxDate.setMonth(auxDate.getMonth()+$scope.lastCredit.term);
                auxDate = new Date(Math.ceil(auxDate+($scope.lastCredit.grace_days*1000 * 3600 * 24)));
                var diffDays = Math.ceil($scope.modalpay.date.getTime()/(1000 * 3600 * 24) - new Date($scope.lastMove.period).getTime()/(1000 * 3600 * 24))-1;
                var newDate = new Date($scope.modalpay.date);
                if(newDate < auxDate){
                    if(diffDays>=0){
                        $scope.newMove.credit = angular.copy($scope.lastCredit.id);
                        $scope.newMove.period = angular.copy($scope.modalpay.date);
                        $scope.newMove.pay = parseFloat(angular.copy($scope.modalpay.pay));
                        $scope.newMove.currency = angular.copy($scope.modalpay.sel_moneda);
                        $scope.newMove.type_currency = $scope.modalpay.sel_moneda=="MXN"? 1 : parseFloat(angular.copy($scope.modalpay.currency));
                        var capital = parseFloat(angular.copy($scope.newMove.capital_balance));
                        var interes = parseFloat(((angular.copy(capital)*((angular.copy($scope.lastCredit.interest))/100/365))*diffDays))+parseFloat((angular.copy($scope.newMove.interest_balance)));
                        var iva = parseFloat(angular.copy((angular.copy(interes)*(angular.copy($scope.lastCredit.iva)/100))));
                        var pay = parseFloat(angular.copy($scope.newMove.pay));
                        if(pay>(iva+interes)){
                            console.log("segundo if")
                            $scope.newMove.pay_interest = interes;
                            $scope.newMove.pay_iva = iva;
                            $scope.newMove.capital_balance = capital - (pay - (interes+iva));
                            $scope.newMove.pay_capital = (pay - (interes+iva));
                            $scope.newMove.capital += angular.copy($scope.newMove.pay_capital);
                            $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                            $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                            $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                        }else{
                            console.log("segundo if")
                            $scope.newMove.pay_interest = pay/(1+($scope.lastCredit.iva/100));
                            $scope.newMove.pay_iva = pay - $scope.newMove.pay_interest;
                            $scope.newMove.capital_balance = capital;
                            $scope.newMove.pay_capital = 0;
                            $scope.newMove.interest_balance -= $scope.newMove.pay_interest;
                            $scope.newMove.iva_balance -= $scope.newMove.pay_iva;
                            $scope.calcMonto = $filter('currency')(angular.copy($scope.newMove.pay_capital));
                            $scope.calcInterest = $filter('currency')(angular.copy($scope.newMove.pay_interest));
                            $scope.calcIva = $filter('currency')(angular.copy($scope.newMove.pay_iva));
                        }
                    }else{
                        SweetAlert.swal("Error","Fecha fuera de rango, ultimo movimiento: "+$filter("date")($scope.lastMove.period,'dd/MM/yyyy'),'error');
                    }
                }else{
                    var diffDays = Math.ceil($scope.modalpay.date.getTime()/(1000 * 3600 * 24) - auxDate.getTime()/(1000 * 3600 * 24));
                    var diffDays_2 = Math.ceil(auxDate.getTime()/(1000*3600*24) - new Date($scope.lastMove.period).getTime()/(1000*3600*24));
                    diffDays_2 = diffDays_2>0?diffDays_2:0;
                    $scope.newMove.credit = angular.copy($scope.lastCredit.id);
                    $scope.newMove.period = angular.copy($scope.modalpay.date);
                    $scope.newMove.pay = parseFloat(angular.copy($scope.modalpay.pay));
                    $scope.newMove.currency = angular.copy($scope.modalpay.sel_moneda);
                    $scope.newMove.type_currency = $scope.modalpay.sel_moneda=="MXN"? 1 : parseFloat(angular.copy($scope.modalpay.currency));
                    var capital = parseFloat(angular.copy($scope.newMove.capital_balance));
                    var interes = parseFloat((angular.copy(capital)*((angular.copy($scope.lastCredit.interest)/100/365)*diffDays_2)))+$scope.lastMove.interest_balance;
                    var iva = parseFloat(angular.copy($scope.newMove.iva_balance)+(angular.copy(interes))*(angular.copy($scope.lastCredit.iva)/100));
                    var pay = parseFloat(angular.copy($scope.newMove.pay));
                    var interestArrear = parseFloat((angular.copy(capital)+angular.copy(interes))*((angular.copy($scope.lastCredit.interest_arrear)/100/365)*diffDays))+parseFloat(angular.copy($scope.lastMove.interest_arrear_balance));
                    var ivaArrear = angular.copy(interestArrear)*(angular.copy($scope.lastCredit.iva)/100);
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
                break;
            }
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
                delete $scope.CreditPadre.id;
                $scope.CreditPadre.start_date = new Date($scope.CreditPadre.start_date)
                $scope.CreditPadreUnedit = angular.copy($scope.CreditPadre);
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
        })
    }
    // Inicializacion
    $scope.getData();
}]);
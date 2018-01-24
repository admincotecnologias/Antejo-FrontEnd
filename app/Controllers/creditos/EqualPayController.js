/**
 * Created by Enrique on 11/04/2017.
 */

antejo.controller('EqualPayCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload", "CreditsFact", '$routeParams', '$filter', function ($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload, CreditsFact, $routeParams, $filter) {

    const DisposicionType = "DISPOSICION";
    const PagoType = "PAGO";
    const AbonoType = "ABONO";
    $scope.DateNow = new Date().toDateString();
    $scope.DateMin = null;
    $scope.credit = [];
    $scope.monthlyPay = null;
    $scope.cliente = '';
    $scope.lastMove = null;
    $scope.proyecto = '';
    $scope.moves = '';
    $scope.idCredito = $routeParams.idCredito;
    $scope.CreditPadre = null;
    $scope.addperiod = '';
    $scope.pays = [];
    $scope.disposition = [];
    $scope.modalpay = {
        deposit: 0,
        sel_moneda: '',
        currency: '',
        date: null,
        file: null
    }
    $scope.Disposicion = {};
    $scope.lastCredit = {};
    $scope.newMove = {};
    $scope.fileData = {
        file : null,
        idapplication : null,
        type : null
    };
    $scope.selectPago = function (credito) {
        $scope.modalDetallePago = credito
    };
    $scope.AddFilePago = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.appID;
            $scope.fileData.type = PagoType;
        }
        $scope.modalpay.file = $file;
        console.log($scope.fileData);
        console.log("PFSL");
    };
    $scope.AddFileDisposicion = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.appID;
            $scope.fileData.type = DisposicionType;
        }
        console.log($scope.fileData);
        console.log("DFSL");
        return;
    };
    $scope.deleteFile = function (index) {
        $scope.modalpay.file.splice(index, 1);
        if ($scope.modalpay.file.length < 1) {
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        } else {
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    };
    $scope.eliminarMovimiento = function(){
        var lastMoveDate = new Date(Date.parse($scope.lastMove.created_at));
        var now = Date.now();
        var hoursPassed = Math.abs(now - lastMoveDate) / 36e5;
        console.log(hoursPassed);
        if(hoursPassed < 24){
            SweetAlert.swal({
                    title: "Mensaje:",
                    text: "Deseas eliminar el ultimo movimiento realizado?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Aceptar.",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm){
                    if(isConfirm){
                        CreditsFact.deleteLastMove($scope.lastMove.credit).then(function(response){
                            SweetAlert.swal({
                                    title: "Mensaje:",
                                    text: "Ultimo movimiento eliminado.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Aceptar.",
                                    closeOnConfirm: false,
                                    closeOnCancel: false
                                },
                                function(isConfirm){
                                    location.reload(true);
                                });
                        }).catch(function(e) {
                            SweetAlert.swal({
                                    title: "Mensaje:",
                                    text: "No se puede eliminar este movimiento.",
                                    type: "error",
                                    showCancelButton: false,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Aceptar.",
                                    closeOnConfirm: false,
                                    closeOnCancel: false
                                },
                                function(isConfirm){
                                    location.reload(true);
                                });
                        });
                    }

                });
        }else{
            SweetAlert.swal("Mensaje","No puedes eliminar un movimiento efectuado hace mas de 24 horas.","error");
        }

    };
    $scope.liquidarCredito = function(){
        if($scope.lastMove == null && $scope.CreditPadre == null || $scope.lastMove.capital_balance <= 1){
            CreditsFact.liquidateCredit($scope.credit[0].application).then(function(response){
                if(response.data.error){
                    SweetAlert.swal({
                            title: "Mensaje:",
                            text: "Error al conectarse con el servidor.",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Aceptar.",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm){
                            $scope.modalpay.file = null;
                            location.reload(true);
                        });
                }else{
                    SweetAlert.swal({
                            title: "Mensaje:",
                            text: "Credito Liquidado.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Aceptar.",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm){
                            location.reload(true);
                        });
                }
            });
        }else{
            SweetAlert.swal({
                    title: "Mensaje:",
                    text: "El balance del credito debe ser menor a 1 peso ($1 MXN) para poder ser liquidado.",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Aceptar.",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm){
                    $scope.modalpay.file = null;
                    location.reload(true);
                });
        }

    };
    $scope.insertDisposicion = function () {
        console.log($scope.Disposicion);
        var Form = new FormData();
        Form.append('file',$scope.fileData.file);
        Form.append('idapplication',$scope.fileData.idapplication);
        Form.append('type',$scope.fileData.type);
        var auxDate = new Date((angular.copy($scope.Disposicion.start_date)));
        var beginningDate = new Date(angular.copy($scope.CreditPadre.start_date));
        beginningDate.setHours(0,0,0,0);
        var lastMoveDate;
        if($scope.lastMove != null) lastMoveDate = new Date($scope.lastMove.period);
        console.log(lastMoveDate);
        console.log("beginning date",beginningDate);
        console.log("auxDate",auxDate);
        $scope.Disposicion.start_date = angular.copy(auxDate);
        if((auxDate>=beginningDate &&
                ($scope.lastMove == null || auxDate > lastMoveDate))
        ){
            if($scope.diferencia>=($scope.Disposicion.amount)){
                //$scope.modalpay.file = response.data.file.id;
                $scope.Disposicion.extends = $scope.CreditPadreUnedit.id;
                $scope.Disposicion.typemove = DisposicionType;
                if($scope.fileData.file != null){
                    CreditsFact.addFile(Form).then(function(response){
                        if(response.data.error){
                            SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                        }else{
                            $scope.Disposicion.idref = response.data.file.id;
                            $scope.addDisposition();
                        }

                    });
                }else{
                    $scope.addDisposition();
                }

            }else{
                SweetAlert.swal("Mensaje","No puedes disponer mas del total del credito restante.","error");
            }
        }
        else{
            SweetAlert.swal("Mensaje","Fecha fuera de plazo.","error");
        }
    };
    $scope.addDisposition = function() {
        CreditsFact.addCondition($scope.Disposicion,function (response) {
            if(response.error){
                SweetAlert.swal("Error:","No se agrego disposición.","error");
            }else{
                SweetAlert.swal({
                        title: "Mensaje:",
                        text: "Dispocición Agregada.",
                        type: "success",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Aceptar.",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm){
                        $scope.modalpay.file = null;
                        location.reload(true);
                    });
            }
        });
    };
    $scope.savePago = function (payreal){
        var Form = new FormData();
        Form.append('file',$scope.fileData.file);
        Form.append('idapplication',$scope.fileData.idapplication);
        Form.append('type',$scope.fileData.type);
        if($scope.fileData.file != null){
            CreditsFact.addFile(Form).then(function(response){
                if(response.data.error){
                    SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                }else{
                    $scope.newMove.idref = response.data.file.id;
                    $scope.newMove.typemove = PagoType;
                    $scope.addPay(payreal);
                }
            });
        }else{
            $scope.addPay(payreal);
        }
    };
    $scope.addPay = function(payreal) {
        $scope.newMove ={
            credit: $scope.CreditPadre.id,
        	capital_balance:  $scope.capitalb - payreal /*$scope.newpayreal*/,
        	interest_balance: $scope.newinterest_balance,
            iva_balance: $scope.newiva_balance,
            interest_arrear_balance:0,
            interest_arrear_iva_balance:0,
            capital: 0,
            interest:0,
            interest_arrear:0,
            iva:0,
            iva_arrear:0,
            pay: payreal/*$scope.newpayreal*/,
            pay_capital:0,
            pay_interest:0,
            pay_iva:0,
            pay_interest_arrear:0,
            pay_iva_arrear:0,
            type_currency: $scope.lastMove.type_currency,
            currency:$scope.lastMove.currency,
            typemove: PagoType,
            period: $scope.modalpay.date
        };
        console.log($scope.newMove);

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
    };
    $scope.addDeposit = function () {
        var Form = new FormData();
        Form.append('file',$scope.fileData.file);
        Form.append('idapplication',$scope.fileData.idapplication);
        Form.append('type',$scope.fileData.type);
        if($scope.fileData.file != null){
            CreditsFact.addFile(Form).then(function(response){
                if(response.data.error){
                    SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
                }else{
                    $scope.newMove.idref = response.data.file.id;
                    $scope.newMove.typemove = PagoType;
                    $scope.addPayDep();
                }
            });
        }else{
            $scope.addPayDep();
        }
    };
    $scope.addPayDep = function() {
        $scope.newMove ={
            credit: $scope.CreditPadre.id,
            capital_balance:  $scope.capitalb,
            interest_balance: $scope.newinterest_balance,
            iva_balance: $scope.newiva_balance,
            interest_arrear_balance:0,
            interest_arrear_iva_balance:0,
            capital: 0,
            interest:0,
            interest_arrear:0,
            iva:0,
            iva_arrear:0,
            pay: $scope.modalpay.deposit,
            pay_capital:0,
            pay_interest:0,
            pay_iva:0,
            pay_interest_arrear:0,
            pay_iva_arrear:0,
            type_currency: $scope.lastMove.type_currency,
            currency:$scope.lastMove.currency,
            typemove: 'ABONO',
            period: $scope.modalpay.date
        };
        console.log($scope.newMove);

        CreditsFact.addCreditDeposit($scope.CreditPadre.id, $scope.newMove,function (response) {
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
    };
    $scope.addTerm = function () {
        var aux = new Date(angular.copy($scope.CreditPadre.start_date));
        aux.setMonth(aux.getMonth() + angular.copy($scope.CreditPadre.term));
        return aux;
    };
    $scope.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    };
    $scope.SelectCondition = function (credito) {
        $scope.ModalDetalleCondicion = credito
    };
    $scope.SelectPay = function (moves) {
        angular.forEach(moves[$scope.CreditPadre.id], function (value, key) {
            if (value.typemove == PagoType || value.typemove == AbonoType) {
                this.push(value);
            }
        }, $scope.pays);
    };
    $scope.SelectCond = function (moves) {
        angular.forEach(moves[$scope.CreditPadre.id],function (value, key ) {
            if(value.typemove == DisposicionType) {
                this.push(value);
            }
        }, $scope.disposition);
    };
    $scope.modalReady = function () {
        return (($scope.modalpay.deposit > $scope.capitalb) || !$scope.modalpay.date) || $scope.modalpay.deposit === 0;
    };

    $scope.CalcularPago = function () {
        try {
            var newMove = angular.copy($scope.lastMove);
            var dateFinal = $scope.addTerm()
            var pago = parseFloat($scope.modalpay.pay)
            var lastDate = new Date($scope.lastMove.period)
            var SelectDate = new Date($scope.modalpay.date)
            var diffDays = Math.floor((SelectDate.getTime() - lastDate.getTime()) / 1000 / 60 / 60 / 24) //Diferencia de dias con la fecha seleccionada y la del ultimo movimiento
            var diffDays2 = Math.floor((dateFinal.getTime() - lastDate.getTime()) / 1000 / 60 / 60 / 24) //Diferencia de dias con la fecha final y la ultima
            var diffDays3 = Math.floor((SelectDate.getTime() - new Date($scope.addTerm().setDate($scope.addTerm().getDate() + $scope.CreditPadre.grace_days)).getTime()) / 1000 / 60 / 60 / 24) //Diferecia si se pasa el
            newMove.period = angular.copy(SelectDate)
            newMove.pay = angular.copy(pago)
            var pagoInteres = 0;
            if (dateFinal.getTime() >= SelectDate.getTime()) {
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                    (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays));
                var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(iva) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
            }
            if ((new Date(dateFinal.setDate(($scope.addTerm().getDate() + $scope.CreditPadre.grace_days))).getTime() >= SelectDate.getTime()) && (SelectDate.getTime() >= $scope.addTerm().getTime())) {
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                    (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays2));
                var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(iva) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
            }
            if (new Date($scope.addTerm().setDate($scope.addTerm().getDate() + $scope.CreditPadre.grace_days)).getTime() < SelectDate.getTime()) {
                var interes = parseFloat(angular.copy($scope.lastMove.interest_balance)) +
                    (angular.copy(parseFloat($scope.lastMove.capital_balance)) * ((parseFloat($scope.CreditPadre.interest) / 100 / 365) * diffDays2));
                var iva = interes * (parseFloat($scope.CreditPadre.iva) / 100)
                var interesmoratorio = angular.copy(parseFloat($scope.lastMove.interest_arrear_balance)) + ((angular.copy(parseFloat($scope.lastMove.capital_balance)) + angular.copy(parseFloat(interes)) + angular.copy(parseFloat($scope.lastMove.interest_arrear_balance))) * (angular.copy((parseFloat($scope.CreditPadre.interest_arrear)) / 100 / 365) * diffDays3));
                var ivaMoratorio = interesmoratorio * ($scope.CreditPadre.iva / 100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                newMove.interest_arrear = angular.copy(interesmoratorio)
                newMove.iva_arrear = angular.copy(ivaMoratorio)
                $scope.liquidarmodal = Math.round((angular.copy(interes) + angular.copy(interesmoratorio) + angular.copy(iva) + angular.copy(ivaMoratorio) + angular.copy(parseFloat($scope.lastMove.capital_balance))));
            }
            if (ivaMoratorio != null) {
                if (pago >= ivaMoratorio) {
                    pago -= ivaMoratorio
                    newMove.pay_iva_arrear = angular.copy(ivaMoratorio)
                    newMove.interest_arrear_iva_balance = 0
                    pagoIvaMoratorio = ivaMoratorio
                } else {
                    pagoIvaMoratorio = pago
                    newMove.pay_iva_arrear = angular.copy(pago)
                    newMove.interest_arrear_iva_balance -= angular.copy(pago)
                    pago = 0
                }
            } else {
                newMove.pay_iva_arrear = 0
                newMove.interest_arrear_iva_balance = 0
            }
            if (interesmoratorio != null) {
                if (pago >= interesmoratorio) {
                    pago -= interesmoratorio
                    newMove.pay_interest_arrear = angular.copy(interesmoratorio)
                    newMove.interest_arrear_balance = 0
                    pagoInteres+=interesmoratorio
                } else {
                    pagoInteres = pago
                    newMove.pay_interest_arrear = angular.copy(pago)
                    newMove.interest_arrear_balance = angular.copy(interesmoratorio) - angular.copy(pago)
                    pago = 0
                }
            } else {
                newMove.pay_interest_arrear = 0
                newMove.interest_arrear_balance -= 0
            }
            if (pago >= iva) {
                pago -= iva
                newMove.pay_iva = angular.copy(iva)
                newMove.iva_balance = 0
                pagoIva = iva
            } else {
                pagoIva = pago
                newMove.pay_iva = angular.copy(pago)
                newMove.iva_balance -= angular.copy(pago)
                pago = 0
            }
            if (pago >= interes) {
                pago -= interes
                newMove.pay_interest = angular.copy(interes)
                newMove.interest_balance = 0
                pagoInteres += interes
            } else {
                pagoInteres = pago
                newMove.pay_interest = angular.copy(pago)
                newMove.interest_balance = angular.copy(interes) - angular.copy(pago)
                pago = 0
            }
            console.log(pago);
            console.log($scope.lastMove.capital_balance);
            if (pago >= $scope.lastMove.capital_balance && pago > 0) {
                pagoCapital = pago
                newMove.capital_balance -= pago
                newMove.pay_capital = pagoCapital
            } else {
                if (pago == 0) {
                    pagoCapital = 0
                } else {
                    pagoCapital = pago
                    newMove.capital_balance -= pagoCapital
                    newMove.pay_capital = pagoCapital
                }
            }
            $scope.newMove = newMove;
            $scope.newMove.idref = null;
            $scope.calcInterest = $filter('currency')(angular.copy(pagoInteres))
            $scope.calcIva = $filter('currency')(angular.copy(pagoIva))
            $scope.calcMonto = $filter('currency')(angular.copy(pagoCapital))
            console.log($scope.newMove);
        }catch(err){
            console.log("catch calcular pago",err);
        }
    }


    $scope.getData = function () {
        CreditsFact.showCredit($scope.idCredito, function (callback) {
            console.log("Callback ", callback)
            if (callback.error) {
                SweetAlert.swal('Mensaje', "No hay Creditos", "warning");
            } else {
                console.log(callback);
                $scope.credit = angular.copy(callback.credits);
                console.log("scope credit[0]",$scope.credit[0]);
                $scope.cliente = callback.client;
                $scope.proyecto = callback.project;
                $scope.moves = callback.moves;
                $scope.CreditPadre = angular.copy($scope.credit[0]);
                delete $scope.CreditPadre.updated_at;
                delete $scope.CreditPadre.deleted_at;
                delete $scope.CreditPadre.created_at;
                $scope.lastCredit = angular.copy(callback.credits.pop())
                $scope.CreditPadre.start_date = new Date($scope.CreditPadre.start_date);
                $scope.CreditPadre.start_date = $scope.CreditPadre.start_date.setDate($scope.CreditPadre.start_date.getDate() + 1);
                $scope.CreditPadreUnedit = angular.copy($scope.CreditPadre);
                $scope.DateMin = callback.lastMove != null ? new Date(callback.lastMove.period).toDateString() : new Date($scope.CreditPadre.start_date).toDateString()
                $scope.lastMove = callback.lastMove;
                $scope.monthlypay = angular.copy(callback.monthlyPay);
                $scope.credit.shift();
                $scope.Disposicion = angular.copy($scope.CreditPadre)
                $scope.Disposicion.amount = Math.round($scope.Disposicion.amount);
                $scope.appID = callback.applicationID;
                $scope.payreal = $scope.monthlypay - ($scope.lastMove.interest_balance + $scope.lastMove.iva_balance);
                $scope.capitalb = $scope.lastMove.capital_balance;
                $scope.TA = $scope.CreditPadre.interest/100;
                $scope.newinterest_balance = ($scope.capitalb*$scope.TA)/12;
                $scope.newiva_balance = $scope.newinterest_balance*($scope.CreditPadre.iva/100);
                $scope.newpayreal = $scope.monthlypay - ($scope.newinterest_balance + $scope.newiva_balance);
                $scope.payLiq = $scope.capitalb + ($scope.newinterest_balance + $scope.newiva_balance);
                $scope.SelectPay($scope.moves);
                $scope.SelectCond($scope.moves);
                console.log($scope.pays);
                console.log($scope.selectedCondicion);
                if($scope.lastMove == null || $scope.lastMove == undefined){
                    $scope.diferencia = Math.round($scope.CreditPadre.amount);
                }else{
                    $scope.diferencia = angular.copy(parseFloat($scope.CreditPadre.amount)) - angular.copy(parseFloat($scope.lastMove.capital_balance))
                }
                console.log($scope.lastMove)
            }
        })
    };

    // Inicializacion
    $scope.getData();

}]);
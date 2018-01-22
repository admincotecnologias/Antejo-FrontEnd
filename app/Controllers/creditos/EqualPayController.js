/**
 * Created by Enrique on 11/04/2017.
 */

antejo.controller('EqualPayCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload", "CreditsFact", '$routeParams', '$filter', function ($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload, CreditsFact, $routeParams, $filter) {

    const DisposicionType = "DISPOSICION";
    const PagoType = "PAGO";
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
    $scope.modalpay = {
        pay: '',
        sel_moneda: '',
        currency: '',
        date: '',
        file: null
    }
    $scope.fileData = {
        file : null,
        idapplication : null,
        type : null
    };
    $scope.selectPago = function (credito) {
        $scope.modalDetallePago = credito
    }
    $scope.Disposicion = {}
    $scope.lastCredit = {}
    $scope.newMove = {}

    $scope.AddFilePago = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.appID;
            $scope.fileData.type = PagoType;
        }
        $scope.modalpay.file = $file;
        console.log($scope.fileData);
        console.log("PFSL");
    }
    $scope.AddFileDisposicion = function ($file) {
        if($file){
            $scope.fileData.file = $file;
            $scope.fileData.idapplication = $scope.appID;
            $scope.fileData.type = DisposicionType;
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

    }
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

    }

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
    }
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
    }
    $scope.savePago = function (){
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
                    $scope.addPay();
                }

            });
        }else{
            $scope.addPay();
        }


    }

    $scope.addPay = function() {
        $scope.newMove ={
            credit: $scope.CreditPadre.id,
        	capital_balance: $scope.capitalb - $scope.payreal,
        	interest_balance: $scope.newinterest_balance,
            iva_balance: $scope.newiva_balance,
            interest_arrear_balance:0,
            interest_arrear_iva_balance:0,
            capital: 0,
            interest:0,
            interest_arrear:0,
            iva:0,
            iva_arrear:0,
            pay: $scope.payreal,
            pay_capital:0,
            pay_interest:0,
            pay_iva:0,
            pay_interest_arrear:0,
            pay_iva_arrear:0,
            type_currency: $scope.lastMove.type_currency,
            currency:$scope.lastMove.currency,
            typemove: PagoType,
            period: new Date()
        };
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

    $scope.addTerm = function () {
        var aux = new Date(angular.copy($scope.CreditPadre.start_date));
        aux.setMonth(aux.getMonth() + angular.copy($scope.CreditPadre.term));
        return aux;
    }
    $scope.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    }
    $scope.SelectCondition = function (credito) {
        $scope.ModalDetalleCondicion = credito
    }
    $scope.SelectPay = function () {
        CreditsFact.showCredit($scope.idCredito, function(callback){
           if (callback.error){
               SweetAlert.swal('Mensaje', "No hay Creditos", "warning");
           } else {
               $scope.moves = callback.moves[$scope.idCredito];
               angular.forEach($scope.moves,function (value, key ) {
                   if(value.typemove == PagoType) {
                       this.push(value);
                   }
               }, $scope.pays);
           }
        });
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
                $scope.selectedCondicion = callback.moves[$scope.idCredito];
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
                $scope.payLiq = $scope.capitalb + ($scope.lastMove.interest_balance + $scope.lastMove.iva_balance);
                $scope.TA = $scope.CreditPadre.interest/100;
                $scope.newinterest_balance = ($scope.payreal*$scope.TA)/12;
                $scope.newiva_balance = $scope.newinterest_balance*($scope.CreditPadre.iva/100);
                $scope.SelectPay();
                if($scope.lastMove == null || $scope.lastMove == undefined){
                    $scope.diferencia = Math.round($scope.CreditPadre.amount);
                }else{
                    $scope.diferencia = angular.copy(parseFloat($scope.CreditPadre.amount)) - angular.copy(parseFloat($scope.lastMove.capital_balance))
                }
                console.log($scope.lastMove)
            }
        })
    }

    // Inicializacion
    $scope.getData();

}]);
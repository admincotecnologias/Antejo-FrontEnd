/**
 * Created by Enrique on 05/06/2017.
 */
antejo.controller('FundsCreateCtrl', ['$filter', 'SweetAlert','FoundFact','$routeParams', function($filter, SweetAlert,FoundFact,$routeParams) {
    this.idStock = $routeParams.idStock;
    var ctrl = this;
    ctrl.fund = [];
    ctrl.menu='info';

    const DisposicionType = "Disposicion";
    ctrl.Credit = {
        id: null,
        idstock: ctrl.idStock,
        amount: null,
        start_date: null,
        term: null,
        interest: null,
        iva: null,
        interest_arrear: null,
        grace_days: null,
        currency: null,
        todo: null,
        status: 'Activo',
        extends: null
    }
    ctrl.modalpay = {
        file : []
    }
    ctrl.dateNow = new Date();
    ctrl.Amortizacion = []
    ctrl.file = null;



    ctrl.AddFileDisposicion = function ($file) {
        if($file){
            ctrl.filedata.file = $file;
            ctrl.filedata.idstock = $routeParams.idStock;
            ctrl.filedata.type = DisposicionType;
        }
        ctrl.modalpay.file.push($file);
        console.log(ctrl.filedata);
        SweetAlert.swal("Aviso:","Archivo anexado.","success");
        console.log("DFSL");
    

    }
    ctrl.Calcular = function () {
        var dateFinal = new Date(angular.copy(ctrl.Credit.start_date));
        console.log(dateFinal)
        dateFinal = new Date(angular.copy(ctrl.Credit.start_date).setMonth(dateFinal.getMonth() + ctrl.Credit.term));
        var dias = Math.ceil((dateFinal.getTime() - angular.copy(ctrl.Credit.start_date).getTime()) / 1000 / 60 / 60 / 24);
        var totalInteres = angular.copy(ctrl.Credit.amount) * (angular.copy(ctrl.Credit.interest) / 100);
        var totalIva = angular.copy(totalInteres) * (angular.copy(ctrl.Credit.iva) / 100);
        var i = 1;
        var objAmortizacion = {
            ciclo: 1,
            fecha: angular.copy(ctrl.Credit.start_date),
            capital: angular.copy(ctrl.Credit.amount),
            interes: (angular.copy(totalInteres) / 365) * (angular.copy(dias) / angular.copy(ctrl.Credit.term)),
            iva: ((angular.copy(totalInteres) / 365) * (angular.copy(dias) / angular.copy(ctrl.Credit.term)))* (angular.copy(ctrl.Credit.iva) / 100),
            total:((angular.copy(totalInteres) / 365) * (angular.copy(dias) / angular.copy(ctrl.Credit.term)))+((angular.copy(totalInteres) / 365) * (angular.copy(dias) / angular.copy(ctrl.Credit.term)))* (angular.copy(ctrl.Credit.iva) / 100)
        }
        ctrl.Amortizacion.push(angular.copy(objAmortizacion))
        var total = {
            total: 0,
            interes: 0,
            iva: 0
        }
        total.total += angular.copy(objAmortizacion.total);
        total.interes += angular.copy(objAmortizacion.interes);
        total.iva += angular.copy(objAmortizacion.iva);
        for (i; i < ctrl.Credit.term; i++) {
            objAmortizacion.ciclo += 1;
            objAmortizacion.fecha = new Date(angular.copy(objAmortizacion.fecha).setMonth(objAmortizacion.fecha.getMonth() + 1));
            objAmortizacion.capital = angular.copy(ctrl.Credit.amount);
            objAmortizacion.interes = (angular.copy(totalInteres) / 365) * (angular.copy(dias) / angular.copy(ctrl.Credit.term));
            objAmortizacion.iva = angular.copy(objAmortizacion.interes) * (angular.copy(ctrl.Credit.iva) / 100);
            objAmortizacion.total = angular.copy(objAmortizacion.iva) + angular.copy(objAmortizacion.interes);
            ctrl.Amortizacion.push(angular.copy(objAmortizacion))
            total.total += angular.copy(objAmortizacion.total);
            total.interes += angular.copy(objAmortizacion.interes);
            total.iva += angular.copy(objAmortizacion.iva);
        }
        objAmortizacion.ciclo = "Total";
        objAmortizacion.capital = angular.copy(ctrl.Credit.amount);
        objAmortizacion.interes = angular.copy(total.interes);
        objAmortizacion.iva = angular.copy(total.iva);
        objAmortizacion.total = angular.copy(total.total);
        ctrl.Amortizacion.push(objAmortizacion)
    }
    ctrl.Aprobar = function () {
        var Form = new FormData();
        Form.append('file',ctrl.filedata.file);
        Form.append('idstock',ctrl.filedata.idstock);
        Form.append('type',ctrl.filedata.type);

        FoundFact.AddFile(Form).then(function(response){
            if(response.data.error){
                SweetAlert.swal("Error:","No se pudo establecer conexion al servidor.","error");
            }else{
                ctrl.file = response.data.file.id;
                FoundFact.addFund(ctrl.Credit).then(function (response) {
                    if(response.data.error){
                        SweetAlert.swal("Error:","El credito no pudo ser aprobado.","error");
                    }else{
                        FoundFact.updateFundFile(response.data.fund,ctrl.file).then(function(response){
                            if(response.data.error){
                                SweetAlert.swal("Error2:","No se pudo establecer conexion al servidor.","error");
                            }else{
                                SweetAlert.swal({
                                        title: "Mensaje:",
                                        text: "Credito Aprobado.",
                                        type: "success",
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "Aceptar.",
                                        closeOnConfirm: false,
                                        closeOnCancel: false
                                    },
                                    function(isConfirm){
                                        if (isConfirm) {
                                            location.reload(true);
                                        } else {
                                            location.reload(true);
                                        }
                                    });
                            }
                        });

                    }
                })
            }

        });
    }
    ctrl.filedata={
        file: '',
    }

    ctrl.Imprimir = function () {
        $(document).ready(function () {
            $("#tablaAmortizacion").print({
                globalStyles: true,
                mediaPrint: false,
                stylesheet: "/styles/printer.css",
                noPrintSelector: ".no-print",
                iframe: true,
                append: null,
                prepend: null,
                manuallyCopyFormValues: true,
                deferred: $.Deferred(),
                timeout: 750,
                title: null,
                doctype: '<!doctype html>'
            });

        })
    }
    ctrl.getStockholder = function () {
        FoundFact.byIDStockholders(ctrl.idStock).then(function (response) {
            response.data.stockholders.postalcode = parseFloat(response.data.stockholders.postalcode)
            ctrl.stockholders = response.data.stockholders;
            ctrl.managers = response.data.managers;
            ctrl.accounts = response.data.accounts;
            if(ctrl.stockholders.type == 'Moral'){
                ctrl.clientname = ctrl.stockholders.businessname;
            }else{
                ctrl.clientname = ctrl.stockholders.name + ' ' + ctrl.stockholders.lastname;
            }
        }).catch(function (err) {
            console.log(err)
            SweetAlert.swal("Error:","Ocurrio un ploblema con la conexión.","error");
        })
    }
    ctrl.getStockholder();
}]);
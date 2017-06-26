/**
 * Created by Enrique on 30/05/2017.
 */
antejo.controller('ApplicationApprovedCtrl', ['$filter', 'SweetAlert', 'ApplicationsFact', '$routeParams', function ($filter, SweetAlert, ApplicationsFact, $routeParams) {
    var ctrl = this;
    ctrl.menu = 'info';
    ctrl.Credit = {
        id: null,
        application: $routeParams.idApp,
        type: null,
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
    ctrl.dateNow = new Date();
    ctrl.Amortizacion = []
    ctrl.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    }
    ctrl.GetApplication = function () {
        ApplicationsFact.showApplication($routeParams.idApp).then(function (response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "warning");
            } else {
                ctrl.avales = response.data.creditaids;
                ctrl.files = response.data.files;
                response.data.application.applicationdate = new Date(Date.parse(response.data.application.applicationdate));
                ctrl.Application = response.data.application;
                ctrl.ListCredits = response.data.credit;
                if (response.data.creditapproved != null) {
                    response.data.creditapproved.start_date = new Date(Date.parse(response.data.creditapproved.start_date));
                    ctrl.Credit = response.data.creditapproved;
                }
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Aviso", "No se pudo conectar con el servidor.", "error");
        })
    }
    ctrl.PreAprobar = function () {
        ctrl.Application.status = "Pre-Aprobado";
        ApplicationsFact.updateApplication(ctrl.Application.id, ctrl.Application).then(function (response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                SweetAlert.swal("Aviso:", "Guardado.", "success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:", "Error al conectarse con servidor.", "error");
        })
    }
    ctrl.Aprobar = function () {
        ctrl.Credit.type = parseInt(ctrl.Credit.type);
        ApplicationsFact.addCreditApproved(ctrl.Credit).then(function (response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                SweetAlert.swal("Aviso:", "Guardado.", "success");
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:", "Error al conectarse con servidor.", "error");
        })
    }
    ctrl.Calcular = function () {
        var dateFinal = angular.copy(ctrl.Credit.start_date);
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
    // Inicializacion
    ctrl.GetApplication();
}]);
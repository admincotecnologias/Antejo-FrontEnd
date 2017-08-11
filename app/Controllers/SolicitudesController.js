antejo.controller('ApplicationCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload",
function ($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload) {
    //TABS MODAL
    $scope.tabs = [{
        title: 'Informacion Basica',
        url: 'solicitud.tpl.html'
    },
        {
            title: 'Archivos',
            url: 'archivos.tpl.html'
        },
        {
            title: 'Informacion de Aval',
            url: 'aval.tpl.html'
        },
        {
            title: 'Autorizar',
            url: 'autorizar.tpl.html'
        }
    ];
    $scope.currentTab = 'personalinfo.tpl.html';
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    $scope.viewObject = function () {
        console.log($scope.ModalNuevoSolicitud);
    }
    //Objetos
    $scope.month_up = null;
    $scope.days_up = null;
    $scope.capital_balance_up = null;
    $scope.interest_up = null;
    $scope.interest_arrear_up = null;
    $scope.iva_up = null;
    $scope.sel_currency_up = null;
    $scope.date_app_up = null;
    $scope.TablaAmortizacion_up = [];
    $scope.filesApp = [];
    $scope.ModalNuevoSolicitud = {
        Clients: [],
        selectClient: '',
        amountrequest: '',
        applicationdate: '',
        place: '',
        creditterm: '',
        projectname: '',
        idclient: '',
        status: 'Pendiente',
        avales: [],
        aval: {
            idapplication: '',
            selectClient_aval: '',
            idguarantee: '',
            typeguarantee: null,
            statusmarital: [{id: 1, name: 'Mancomunado'}, {id: 2, name: 'Bienes separados'}],
            name: '',
            lastname: '',
            rfc: '',
            curp: '',
            birthday: '',
            country: '',
            nacionality: '',
            email: '',
            fiel: '',
            address: '',
            phone: '',
            maritalstatus: '',
            regimen: '',
            relationship: '',
            companyjob: '',
            phonejob: '',
            occupation: '',
            oldwork: ''
        }
    }
    $scope.ModalUpdateSolicitud = {
        application: {
            id: null,
            idclient: null,
            client: null,
            amountrequest: null,
            applicationdate: null,
            place: null,
            creditterm: null,
            projectname: null,
            status: null,
            created_at: null,
            updated_at: null,
            deleted_at: null
        },
        creditaids: [],
        files: []
    }
    //Subir filesApp
    $scope.deleteFiles = function ($index) {
        $scope.filesApp.splice($index, 1);
        if ($scope.filesApp.length < 1) {
            $('#dropzone img').remove();
            $('#dropzone').removeClass('dropped');
            $('#dropzone div').html("Arrastra tus archivos o haz click.");
        }
    }
    $scope.AddFile = function ($files) {
        var i, flag = false;
        if (angular.equals(null, $files)) {
            flag = true;
        } else {
            for (i = 0; i < $scope.filesApp.length; i++) {
                if (angular.equals($scope.filesApp[i], $files)) {
                    flag = true;
                    SweetAlert.swal("Aviso", "Archivo repetido", "error");
                }
            }
        }

        if (flag == false) {
            $scope.filesApp.push($files);
        }
    }
    //Show name
    $scope.showNameAval = function (aval, type) {
        return aval.typeguarantee == type;
    }
    //QUIT Aval
    $scope.DeleteAval = function (index) {
        $scope.ModalNuevoSolicitud.avales.splice(index, 1);
    }

    //Add Aval
    $scope.addAval = function () {
        var clear = false;
        if ($scope.ModalNuevoSolicitud.aval.typeguarantee == "Fisica") {
            if ($scope.validPersonaFisica_add() == true) {
                $scope.ModalNuevoSolicitud.aval.regimen = $scope.ModalNuevoSolicitud.aval.regimen.name;
                var data = angular.copy($scope.ModalNuevoSolicitud.aval);
                data.idguarantee = null;
                $scope.ModalNuevoSolicitud.avales.push(data);
                clear = true;
            } else {
                SweetAlert.swal("Error", "Completa los campos correctamente.", "error");
            }
        }
        if ($scope.ModalNuevoSolicitud.aval.typeguarantee == "Moral") {
            if ($scope.ModalNuevoSolicitud.aval.selectClient_aval) {
                $scope.ModalNuevoSolicitud.aval.idguarantee = $scope.ModalNuevoSolicitud.aval.selectClient_aval.id;
                var data = angular.copy($scope.ModalNuevoSolicitud.aval);
                $scope.ModalNuevoSolicitud.avales.push(data);
                clear = true;
            } else {
                SweetAlert.swal("Error", "Selecciona aval del listado, en caso de no existir agreguelo como cliente.", "error");
            }
        }
        if ($scope.ModalNuevoSolicitud.aval.typeguarantee == "" || $scope.ModalNuevoSolicitud.aval.typeguarantee == null) {
            SweetAlert.swal("Error", "Selecciona un tipo de aval.", "error");
        }
        if (clear == true) {
            $scope.clearAval();
        }
    }
    $scope.clearAval = function () {
        $scope.ModalNuevoSolicitud.aval.idapplication = '';
        $scope.ModalNuevoSolicitud.aval.selectClient_aval = '';
        $scope.ModalNuevoSolicitud.aval.idguarantee = '';
        $scope.ModalNuevoSolicitud.aval.typeguarantee = null;
        $scope.ModalNuevoSolicitud.aval.statusmarital = [{id: 1, name: 'Mancomunado'}, {
            id: 2,
            name: 'Bienes separados'
        }];
        $scope.ModalNuevoSolicitud.aval.name = '';
        $scope.ModalNuevoSolicitud.aval.lastname = '';
        $scope.ModalNuevoSolicitud.aval.rfc = '';
        $scope.ModalNuevoSolicitud.aval.curp = '';
        $scope.ModalNuevoSolicitud.aval.birthday = '';
        $scope.ModalNuevoSolicitud.aval.country = '';
        $scope.ModalNuevoSolicitud.aval.nacionality = '';
        $scope.ModalNuevoSolicitud.aval.email = '';
        $scope.ModalNuevoSolicitud.aval.fiel = '';
        $scope.ModalNuevoSolicitud.aval.address = '';
        $scope.ModalNuevoSolicitud.aval.phone = '';
        $scope.ModalNuevoSolicitud.aval.maritalstatus = '';
        $scope.ModalNuevoSolicitud.aval.regimen = '';
        $scope.ModalNuevoSolicitud.aval.relationship = '';
        $scope.ModalNuevoSolicitud.aval.companyjob = '';
        $scope.ModalNuevoSolicitud.aval.phonejob = '';
        $scope.ModalNuevoSolicitud.aval.occupation = '';
        $scope.ModalNuevoSolicitud.aval.oldwork = '';
    }

    //Validaciones
    $scope.validPersonaFisica_add = function () {
        var obj = $scope.ModalNuevoSolicitud.aval;
        return ((obj.name != "") && (obj.lastname != "") && (obj.rfc != "") && (obj.curp != "") && (obj.birthday != "") && (obj.country != "") && (obj.nacionality != "") && (obj.email != "") && (obj.address != '') && (obj.phone != '') && (obj.maritalstatus != '') && (obj.regimen != '') && (obj.relationship != '') && (obj.companyjob != '') && (obj.phonejob != '') && (obj.occupation != '') && (obj.oldwork != ''));
    }

    //Init Values
    $scope.allClientes = function () {
        ClientsFact.allClients(function (clientes) {
            $scope.ModalNuevoSolicitud.Clients = clientes;
            //$scope.ModalNuevoCliente.banks = bancos.banks;
            //$scope.modalpuesto.bancos = bancos.banks;
        });
    }
    $scope.allSolicitudes = function () {
        ApplicationsFact.allApplication(function (solicitudes) {
            if (Array.isArray(solicitudes)) {
                $scope.applications = solicitudes;
                setTimeout(function () {
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                }, 500);
            } else {
                $scope.applications = null;
            }
        });
    }
    //Show Application
    $scope.showApplication = function (id) {
        ApplicationsFact.showApplication(id).then(function (response) {
            if (response.data.error) {
                SweetAlert.swal("Error", response.data.message, "error");
            } else {
                response.data.application.applicationdate = new Date(parseInt(response.data.application.applicationdate.split('-')[0]), parseInt(response.data.application.applicationdate.split('-')[1]) - 1, parseInt(response.data.application.applicationdate.split('-')[2]));
                $scope.ModalUpdateSolicitud.application = response.data.application;
                $scope.ModalUpdateSolicitud.creditaids = response.data.creditaids;
                $scope.ModalUpdateSolicitud.files = response.data.files;
                var result = $filter('filter')($scope.ModalNuevoSolicitud.Clients, {id: response.data.application.idclient})[0];
                $scope.ModalUpdateSolicitud.application.client = result.businessname;
                $scope.onClickTab($scope.tabs[0]);
            }
        }, function (error) {
            SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
        });
    }

    //Download files
    $scope.DownloadFile = function (id) {
        ApplicationsFact.DownloadFile(id);
    }

    //Add Application~solicitud

    $scope.AddSolicitud = function () {
        $scope.ModalNuevoSolicitud.idclient = $scope.ModalNuevoSolicitud.selectClient.id;
        ApplicationsFact.addApplication($scope.ModalNuevoSolicitud).then(
            function (response) {
                if (response.data.error) {
                    SweetAlert.swal("Error", response.data.message, "error");
                } else {
                    var idapp = response.data.id;
                    var boolerror = true;
                    angular.forEach($scope.filesApp, function (item, index) {
                        ApplicationsFact.AddFile(item, idapp).then(function (response) {
                            if (response.data.error == true) {
                                boolerror = false;
                                SweetAlert.swal("Error", response.data.message, "error");
                            }
                        }, function (error) {
                            boolerror = false;
                            SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
                        });
                    });
                    if (boolerror) {
                        angular.forEach($scope.ModalNuevoSolicitud.avales, function (item, index) {
                            item.idapplication = idapp;
                            ApplicationsFact.addCreditAid(item).then(
                                function (response) {
                                    if (response.data.error) {
                                        boolerror = false;
                                        SweetAlert.swal("Error", response.data.message, "error");
                                    }
                                },
                                function (error) {
                                    boolerror = false;
                                    SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
                                });
                        });
                    }
                    if (boolerror) {
                        $scope.allSolicitudes();
                        SweetAlert.swal("Mensaje", "Guardado correctamente", "success");
                    }
                }
            },
            function (error) {
                SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
            });

    }
    $scope.autorizarSolicitud = function () {
        $scope.ModalUpdateSolicitud.application.status = 'Pre-Autorización'
    }
    $scope.CalcularCredito = function (type) {
        console.log(type)
        switch (type) {
            case 1: {
                $scope.TablaAmortizacion_up = []
                var aux;
                for (i = 0; i < parseInt($scope.month_up); i++) {
                    if (i == 0) {
                        aux = {
                            capital_balance: $scope.capital_balance_up,
                            interest: $scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12),
                            interest_arrear: $scope.interest_arrear_up,
                            iva: ($scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)) * (parseFloat($scope.iva_up) / 100),
                            month: i + 1,
                            days: $scope.days_up,
                            date_app: new Date($scope.date_app_up),
                            sel_currency: $scope.sel_currency_up,
                            interest_balance: $scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12),
                            iva_balance: ($scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)) * (parseFloat($scope.iva_up) / 100),
                            total: ($scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)) + (($scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)) * (parseFloat($scope.iva_up) / 100))
                        }
                        $scope.TablaAmortizacion_up.push(angular.copy(aux));
                    } else {
                        var dateAux = aux.date_app
                        aux.month = i + 1
                        aux.date_app.setMonth(dateAux.getMonth() + 1)
                        aux.interest_balance = aux.interest_balance + $scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)
                        aux.iva_balance = aux.iva_balance + ($scope.capital_balance_up * ((parseFloat($scope.interest_up) / 100) / 12)) * (parseFloat($scope.iva_up) / 100)
                        aux.total = aux.interest + aux.iva
                        $scope.TablaAmortizacion_up.push(angular.copy(aux));
                    }
                }
                break;
            }
        }
    }
    $scope.AutorizarCredito = function () {
        console.log($scope.sel_type_up)
        var json = {
            application: $scope.ModalUpdateSolicitud.application.id,
            type: parseInt($scope.sel_type_up),
            amount: parseFloat($scope.capital_balance_up),
            start_date: $scope.date_app_up,
            term: parseInt($scope.month_up),
            interest: parseFloat($scope.interest_up),
            iva: parseFloat($scope.iva_up),
            interest_arrear: parseFloat($scope.interest_arrear_up),
            grace_days: parseInt($scope.days_up),
            currency: $scope.sel_currency_up,
            todo: $scope.todo_up,
            extends: null,
            status: 'ACTIVO'
        }
        ApplicationsFact.addCreditApproved(json).then(function (response) {
            if (response.error == true) {
                SweetAlert.swal("Error", response.message, "error");
            } else {
                SweetAlert.swal("Guardado", "Credito guardado.", "success");
                $scope.allSolicitudes();
            }
        }, function (error) {
            SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
        })
    }


    //Inicializacion
    $scope.allClientes();
    $scope.allSolicitudes();
}]);
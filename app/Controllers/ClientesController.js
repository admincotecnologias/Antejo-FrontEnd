antejo.controller('ClientesCtrl', ['$scope', '$http', 'SweetAlert', 'BancosFact', 'ClientsFact', function($scope, $http, SweetAlert, BancosFact, ClientsFact) {

    //TABS MODAL
    $scope.tabs = [{
            title: 'Informacion Basica',
            url: 'personalinfo.tpl.html'
        },
        {
            title: 'Informacion de Contacto',
            url: 'personalinfo2.tpl.html'
        },
        {
            title: 'Accionistas',
            url: 'accionista.tpl.html'
        },
        {
            title: 'Archivos',
            url: 'archivos.tpl.html'
        },
        {
            title: 'Bancos',
            url: 'bancos.tpl.html'
        },
        {
            title: 'Representantes',
            url: 'representantes.tpl.html'
        }
    ];
    $scope.currentTab = 'personalinfo.tpl.html';
    $scope.onClickTab = function(tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    //Objetos
    $scope.filesApp = [];
    $scope.clients = [];
    $scope.ModalNuevoCliente = {
        businessname: '',
        employeenumber: '',
        rfc: '',
        fiel: '',
        email: '',
        businesscategory: '',
        constitutiondate: '',
        legalrepresentativename: '',
        legalrepresentativelastname: '',
        managerrfc: '',
        managerphone: '',
        address: '',
        colony: '',
        postalcode: '',
        city: '',
        state: '',
        phone: '',
        banks: [],
        selectBank: '',
        shareholder: [],
        managers: []
    }
    $scope.Cliente = {
        businessname: '',
        employeenumber: 0,
        rfc: '',
        fiel: '',
        email: '',
        businesscategory: '',
        constitutiondate: new Date(),
        legalrepresentativename: '',
        legalrepresentativelastname: '',
        address: '',
        colony: '',
        postalcode: '',
        city: '',
        state: '',
        phone: '',
        banks: [],
        selectBank: '',
        shareholder: [],
        files: [],
        managers: []
    }
    $scope.modalbanco = {
        bancos: [],
        descripcion: ""
    }
    $scope.shareholder = {
        name: '',
        lastname: '',
        rfc: '',
        participation: '',
        oldwork: ''
    }
    $scope.shareholder_up = {
        name: '',
        lastname: '',
        rfc: '',
        participation: '',
        oldwork: ''
    }
    $scope.manager_up = {
        name: '',
        lastname: '',
        rfc: '',
        phone: ''
    }
    $scope.bank = {
        banco: '',
        accountnumber: '',
        accounttype: '',
        clabe: '',
        idclient: ''
    }
    $scope.bank_up = {
            banco: '',
            accountnumber: '',
            accounttype: '',
            clabe: ''
        }
        //LegalManager
    $scope.addManager = function() {
        var manager = {
            name: $scope.ModalNuevoCliente.legalrepresentativename,
            lastname: $scope.ModalNuevoCliente.legalrepresentativelastname,
            rfc: $scope.ModalNuevoCliente.managerrfc,
            phone: $scope.ModalNuevoCliente.managerphone,
            idclient: 0
        }
        $scope.ModalNuevoCliente.managers.push(manager);
        $scope.ModalNuevoCliente.legalrepresentativename = '';
        $scope.ModalNuevoCliente.legalrepresentativelastname = '';
        $scope.ModalNuevoCliente.managerrfc = '';
        $scope.ModalNuevoCliente.managerphone = '';
    }
    $scope.deleteManager = function(index) {
            $scope.ModalNuevoCliente.managers.splice(index, 1);
        }
        //Subir filesApp
    $scope.deleteFiles = function($index) {
        $scope.filesApp.splice($index, 1);
        if ($scope.filesApp.length < 1) {
            $('#dropzone img').remove();
            $('#dropzone').removeClass('dropped');
            $('#dropzone div').html("Arrastra tus archivos o haz click.");
        }
    }
    $scope.AddFile = function($files) {
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
        //Download files
    $scope.DownloadFile = function(id) {
        ClientsFact.DownloadFile(id);
    }

    //validaciones
    $scope.validAddShareholder = function() {
        return !($scope.shareholder.name != '' && $scope.shareholder.lastname != '' && $scope.shareholder.rfc != '' && $scope.shareholder.participation > 0);
    }
    $scope.validAddShareholder_up = function() {
        return !($scope.shareholder_up.name != '' && $scope.shareholder_up.lastname != '' && $scope.shareholder_up.rfc != '' && $scope.shareholder_up.participation > 0);
    }
    $scope.returnNameBank = function(list, id) {
            var elem = list.filter(function(element) {
                if (element.id == id) {
                    return element;
                }
            });
            return elem;
        }
        //addManager
    $scope.AddManager = function() {
        $scope.manager_up.idclient = $scope.DataClient.id;
        ClientsFact.addManager($scope.manager_up).then((response) => {
            if (response.data.error != true) {
                SweetAlert.swal("Agregado", "Representante agregado.", "success");
                $scope.showclient($scope.DataClient.id);
            }
        });
    }

    //AddParticipsation

    $scope.AddParticipation = function() {
        $scope.ModalNuevoCliente.shareholder.push($scope.shareholder);
        $scope.shareholder = {
            name: '',
            lastname: '',
            rfc: '',
            participation: '',
            oldwork: ''
        }
    }

    //AddBank
    $scope.AddBank = function() {
        $scope.bank.banco = $scope.ModalNuevoCliente.selectBank;
        $scope.ModalNuevoCliente.banks.push($scope.bank);
        $scope.bank = {
            banco: '',
            accountnumber: '',
            accounttype: '',
            clabe: ''
        }
    }

    //DeleteParticipation

    $scope.DeleteParticipation = function(index) {
        $scope.ModalNuevoCliente.shareholder.splice(index, 1);
    }

    //SHOW BY id

    $scope.showclient = function(id, flag) {
        ClientsFact.showClients(id).then(
            function(response) {
                response.data.client.constitutiondate = new Date(response.data.client.constitutiondate.split('-')[0], parseFloat(response.data.client.constitutiondate.split('-')[1]) - 1, response.data.client.constitutiondate.split('-')[2]);
                response.data.client.employeenumber = parseInt(response.data.client.employeenumber);
                $scope.Cliente = response.data.client;
                $scope.Cliente.banks = response.data.banks;
                $scope.Cliente.shareholders = response.data.shareholders;
                $scope.Cliente.files = response.data.files;
                $scope.Cliente.managers = response.data.managers;
                $scope.DataClient = angular.copy($scope.Cliente);
            },
            function(error) {
                SweetAlert.swal("Error", "no se pudo alcanzar el servidor", "error");
            }
        );
    }

    //ADD UPDATE SHAREHOLDER

    $scope.AddShareholder = function() {
        ClientsFact.addClientShareholder($scope.shareholder_up, $scope.Cliente.id).then(
            function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Error", response.data.message, "error");
                } else {
                    $scope.showclient($scope.Cliente.id);
                    SweetAlert.swal("Mensaje", response, data.message, "success");
                }
            },
            function(error) {}
        );
    }

    //DELETE CLIENT 

    $scope.DeleteClient = function(id, name) {
        SweetAlert.swal({
            title: "¿Desea Eliminar Cliente?",
            text: "se eliminara cliente: " + name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirmar",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                ClientsFact.deleteClients(id).then(
                    function(response) {
                        if (response.data.error) {
                            SweetAlert.swal("Error", response.data.message, "error");
                        } else {
                            $scope.allClientes();
                            SweetAlert.swal("Mensaje", response.data.message, "success");
                        }
                    },
                    function(error) {
                        SweetAlert.swal("Error", "no se alcanzo conexion con el servidor remoto.", "error");
                    }
                );
            }
        });
    }

    //DELETE SHAREHOLDER

    $scope.deleteShareholder = function(id) {
            if ($scope.Cliente.shareholders.length > 1) {
                SweetAlert.swal({
                    title: "¿Desea Eliminar accionista?",
                    text: "se eliminara un accionista a este cliente.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Confirmar",
                    closeOnConfirm: false
                }, function(isConfirm) {
                    if (isConfirm) {
                        ClientsFact.deleteShareholder(id).then(
                            function(response) {
                                if (response.data.error) {
                                    SweetAlert.swal("Error", response.data.message, "error");
                                } else {
                                    $scope.showclient($scope.Cliente.id, null);
                                    SweetAlert.swal("Mensaje", response.data.message, "success");
                                }
                            },
                            function(error) {
                                SweetAlert.swal("Error", "no se alcanzo conexion con el servidor remoto.", "error");
                            }
                        );
                    }
                });
            } else {
                SweetAlert.swal("Mensaje", "Debe de agregar otro accionista antes de eliminar.", "warning");
            }
        }
        //ADD BANK CLIENT

    $scope.addClientBank = function() {
        $scope.bank_up.banco = $scope.Cliente.selectBank;
        $scope.bank_up.idclient = $scope.Cliente.id;
        ClientsFact.addClientBank($scope.bank_up).then(
            function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Error", response.data.message, "error");
                } else {
                    $scope.showclient($scope.Cliente.id);
                }
            },
            function(error) {

            }
        );
    }

    //DELETE BANK CLIENT

    $scope.deleteClientBank = function(id) {
            if ($scope.Cliente.banks.length > 1) {
                SweetAlert.swal({
                    title: "¿Desea Eliminar Banco?",
                    text: "se eliminara un Banco a este cliente.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Confirmar",
                    closeOnConfirm: false
                }, function(isConfirm) {
                    if (isConfirm) {
                        ClientsFact.deleteClientBank(id).then(
                            function(response) {
                                if (response.data.error) {
                                    SweetAlert.swal("Error", response.data.message, "error");
                                } else {
                                    $scope.showclient($scope.Cliente.id, null);
                                    SweetAlert.swal("Mensaje", response.data.message, "success");
                                }
                            },
                            function(error) {
                                SweetAlert.swal("Error", "no se alcanzo conexion con el servidor remoto.", "error");
                            }
                        );
                    }
                });
            } else {
                SweetAlert.swal("Mensaje", "Debe de agregar otro accionista antes de eliminar.", "warning");
            }
        }
        //EDIT CLIENT

    $scope.updateClient = function() {
            var json = {}
            if ($scope.DataClient.businessname != $scope.Cliente.businessname) {
                json.businessname = $scope.Cliente.businessname;
            }
            if ($scope.DataClient.employeenumber != $scope.Cliente.employeenumber) {
                json.employeenumber = $scope.Cliente.employeenumber;
            }
            if ($scope.DataClient.rfc != $scope.Cliente.rfc) {
                json.rfc = $scope.Cliente.rfc;
            }
            if ($scope.DataClient.fiel != $scope.Cliente.fiel) {
                json.fiel = $scope.Cliente.fiel;
            }
            if ($scope.DataClient.email != $scope.Cliente.email) {
                json.email = $scope.Cliente.email;
            }
            if ($scope.DataClient.businesscategory != $scope.Cliente.businesscategory) {
                json.businesscategory = $scope.Cliente.businesscategory;
            }
            if ($scope.DataClient.constitutiondate.getTime() != $scope.Cliente.constitutiondate.getTime()) {
                json.constitutiondate = $scope.Cliente.constitutiondate;
            }
            if ($scope.DataClient.address != $scope.Cliente.address) {
                json.address = $scope.Cliente.address;
            }
            if ($scope.DataClient.colony != $scope.Cliente.colony) {
                json.colony = $scope.Cliente.colony;
            }
            if ($scope.DataClient.postalcode != $scope.Cliente.postalcode) {
                json.postalcode = $scope.Cliente.postalcode;
            }
            if ($scope.DataClient.city != $scope.Cliente.city) {
                json.city = $scope.Cliente.city;
            }
            if ($scope.DataClient.state != $scope.Cliente.state) {
                json.state = $scope.Cliente.state;
            }
            if ($scope.DataClient.phone != $scope.Cliente.phone) {
                json.phone = $scope.Cliente.phone;
            }
            ClientsFact.updateClients($scope.DataClient.id, json).then(
                function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", "errors" in response.data ? response.data.message + "\n" + response.data.errors.toString() : response.data.message, "error");
                    } else {
                        SweetAlert.swal("Mensaje", "Cliente editado Correctamente", "success");
                        $scope.allClientes();
                    }
                },
                function(error) {}
            );
        }
        //CREATE CLIENT

    $scope.CreateClient = function() {
        ClientsFact.addClients($scope.ModalNuevoCliente).then(function(response) {
            var boolClient = true,
                boolShareholder = true,
                boolBanks = true,
                boolManager = true;
            if (response.data.error) {
                boolClient = false;
                SweetAlert.swal("Error", response.data.message, "error");
            } else {
                $scope.ModalNuevoCliente.shareholder.forEach(function(item, index) {
                    ClientsFact.addClientShareholder(item, response.data.id).then(
                        function(response) {
                            if (response.data.error) {
                                boolShareholder = false;
                                SweetAlert.swal("Error", response.data.message, "error");
                            }
                        },
                        function(error) {
                            boolShareholder = false;
                            SweetAlert.swal("Error", response.data.message, "error");
                        }
                    )
                });
                if (boolShareholder && boolClient) {
                    $scope.ModalNuevoCliente.banks.forEach(function(item, index) {
                        item.idclient = response.data.id;
                        ClientsFact.addClientBank(item).then(
                            function(response) {
                                if (response.data.error) {
                                    SweetAlert.swal("Error", response.data.message, "error");
                                    boolBanks = false;
                                }
                            },
                            function(error) {
                                boolBanks = false;
                                SweetAlert.swal("Error", response.data.message, "error");
                            }
                        );
                    });
                }
                angular.forEach($scope.ModalNuevoCliente.managers, function(item, index) {
                    item.idclient = response.data.id;
                    ClientsFact.addManager(item).then(function(resp) {
                        resp.data.error == true ? boolManager = false : boolManager = true;
                    }, function(error) {
                        boolManager = false;
                        SweetAlert.swal("Error", "Error con el servidor", "error");
                    });
                })
                if (boolClient && boolBanks && boolShareholder && boolManager) {
                    var boolfiles = true;
                    angular.forEach($scope.filesApp, function(item, index) {
                        ClientsFact.AddFile(item, response.data.id).then(function(resp) {
                            if (resp.data.error == true) {
                                boolfiles = false;
                            }
                        }, function(error) {
                            boolfiles = false;
                        });
                    });
                    if (boolfiles == true) {
                        SweetAlert.swal("Mensaje", "cliente Agregado Correctamente", "success");
                    } else {
                        SweetAlert.swal("Mensaje", "cliente Agregado Correctamente, pero ocurrio un error al subir archivo.", "warning");
                    }
                }
            }
        }, function(error) {
            SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
        });
    }
    $scope.CreateShareholder = function() {
        ClientsFact.addClients($scope.ModalNuevoCliente).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error", response.data.message, "error");
            } else {

            }
        }, function(error) {
            SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
        });
    }

    // TABLA PRINCIPAL
    $scope.allBanco = function() {
        BancosFact.AllBanco(function(bancos) {
            $scope.modalbanco.bancos = bancos.banks;
            //$scope.ModalNuevoCliente.banks = bancos.banks;
            //$scope.modalpuesto.bancos = bancos.banks;
        });
    }

    $scope.allClientes = function() {
        ClientsFact.allClients(function(clientes) {
            $scope.clients = clientes;
            //$scope.ModalNuevoCliente.banks = bancos.banks;
            //$scope.modalpuesto.bancos = bancos.banks;
        });
    }

    //DELETE BANCO
    $scope.deleteBanco = function(id) {
            BancosFact.DeleteBanco(id).then(function(response) {
                if (response.data.error == true) {
                    SweetAlert.swal("Error", response.data.message, "error");
                } else {
                    SweetAlert.swal("Mensaje", "Eliminado Correctamente", "success");
                    $scope.allBanco();
                }
            }, function(error) {});
        }
        //ADD Banco
    $scope.AddBanco = function() {
            if ($scope.modalbanco.descripcion != "") {
                var name = $scope.modalbanco.descripcion.trim();
                BancosFact.AddBanco(name).then(function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", response.data.message, "error");
                    } else {
                        $scope.allBanco();
                        $scope.modalbanco.descripcion = "";
                        SweetAlert.swal("Guardado", response.data.message, "success");
                    }
                }, function(error) {
                    SweetAlert.swal("Error", "Error al comuncarse con el servidor.", "error");
                }).catch(function(e) {});

            } else {
                SweetAlert.swal("Error", "Agrega una descripción.", "error");
            }
        }
        //inicializacion de valores
    $scope.allClientes();
    $scope.allBanco();
}]);
/**
 * Created by Enrique on 10/05/2017.
 */
antejo.controller('CreateStockCtrl', ['$filter', 'SweetAlert', 'FoundFact', 'BancosFact', function($filter, SweetAlert, FoundFact, BancosFact) {
    var ctrl = this;
    ctrl.menu = 'info'
    ctrl.stockholders = {
        id: null,
        businessname: '',
        name: '',
        lastname: '',
        type: '',
        rfc: '',
        email: '',
        address: '',
        colony: '',
        postalcode: '',
        city: '',
        state: '',
        phone: '',
        nationality: ''
    };
    ctrl.managerSelect = {
        id: null,
        name: '',
        lastname: '',
        rfc: '',
        email: '',
        address: '',
        colony: '',
        postalcode: '',
        city: '',
        state: '',
        phone: '',
        idstockholder: null
    }
    ctrl.AccountSelect = {
        id: null,
        accounttype: '',
        accountnumber: '',
        clabe: '',
        idstock: null,
        idbank: null
    }
    ctrl.managers = []
    ctrl.accounts = []
    ctrl.selectManager = function(manager) {
        manager.postalcode = parseFloat(manager.postalcode)
        ctrl.managerSelect = angular.copy(manager);
    }
    ctrl.selectAccount = function(bank) {
        bank.accountnumber = parseFloat(bank.accountnumber)
        bank.clabe = parseFloat(bank.clabe)
        ctrl.AccountSelect = angular.copy(bank);
    }
    ctrl.clearManager = function() {
        ctrl.managerSelect = {
            id: null,
            name: '',
            lastname: '',
            rfc: '',
            email: '',
            address: '',
            colony: '',
            postalcode: '',
            city: '',
            state: '',
            phone: '',
            idstockholder: null
        }
    }
    ctrl.clearAccount = function() {
        ctrl.AccountSelect = {
            id: null,
            accounttype: '',
            accountnumber: '',
            clabe: '',
            idstock: null,
            idbank: null
        }
    }
    ctrl.deleteManager = function(manager) {
        FoundFact.deleteManager(manager.id).then(function(response) {
            FoundFact.byIDManager(ctrl.stockholders.id).then(function(responses) {
                ctrl.managers = responses.data.stockholders;
            }).catch(function(err) {
                console.log(err)
                SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
            })
            SweetAlert.swal("Mensaje:", "Eliminado.", "warning");
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })

    }
    ctrl.updateStock = function() {
        if (ctrl.stockholders.type == 'Moral') {
            ctrl.stockholders.name = null;
            ctrl.stockholders.lastname = null;
        } else {
            ctrl.stockholders.businessname = null;
        }
        FoundFact.updateStockholder(ctrl.stockholders).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error:", response.data.message, "error");
            } else {
                console.log(response)
                ctrl.stockholders = response.data.stockholders;
                SweetAlert.swal("Mensaje:", "Guardado.", "success");
            }
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.updateManager = function() {
        FoundFact.updateManager(ctrl.managerSelect).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error:", response.data.message, "error");
            } else {
                ctrl.AccountSelect = {
                    id: null,
                    accounttype: '',
                    accountnumber: '',
                    clabe: '',
                    idstock: null,
                    idbank: null
                }
                FoundFact.byIDManager(ctrl.stockholders.id).then(function(responses) {
                    ctrl.managers = responses.data.stockholders;
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
                SweetAlert.swal("Mensaje:", "Guardado.", "success");
            }
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.createManager = function() {
        ctrl.managerSelect.idstockholder = ctrl.stockholders.id;
        FoundFact.addManager(ctrl.managerSelect).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error", "No se pudo guardar: \n" + response.data.message, "error");
            } else {
                FoundFact.byIDManager(ctrl.stockholders.id).then(function(response) {
                    ctrl.managers = response.data.stockholders;
                    SweetAlert.swal("Mensaje:", "Guardado.", "success");
                    ctrl.managerSelect = {
                        id: null,
                        name: '',
                        lastname: '',
                        rfc: '',
                        email: '',
                        address: '',
                        colony: '',
                        postalcode: '',
                        city: '',
                        state: '',
                        phone: '',
                        idstockholder: null
                    }
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
            }
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.viewNameBank = function(id) {
        for (var i = 0; i < ctrl.ListBanks.length; i++) {
            console.log(id, ctrl.ListBanks[i].id)
            if (ctrl.ListBanks[i].id == id) {
                return ctrl.ListBanks[i].name;
                break;
            }
        }
    }
    ctrl.deleteBank = function(bank) {
        FoundFact.deleteAccount(bank.id).then(function(response) {
            FoundFact.byIDAccount(ctrl.stockholders.id).then(function(responses) {
                ctrl.accounts = responses.data.stockholders
            }).catch(function(err) {
                console.log(err)
                SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
            })
            SweetAlert.swal("Mensaje", "Eliminado", "success");
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.createBank = function() {
        ctrl.AccountSelect.idstock = ctrl.stockholders.id;
        ctrl.AccountSelect.clabe = ctrl.AccountSelect.clabe.toString();
        ctrl.AccountSelect.accountnumber = ctrl.AccountSelect.accountnumber.toString();
        FoundFact.addAccount(ctrl.AccountSelect).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error", "No se pudo guardar", "error");
            } else {
                FoundFact.byIDAccount(ctrl.stockholders.id).then(function(responses) {
                    if (responses.data.error) {
                        SweetAlert.swal("Error", "No se pudo guardar", "error");
                    } else {
                        ctrl.accounts = responses.data.stockholders;
                        ctrl.AccountSelect = {
                            id: null,
                            accounttype: '',
                            accountnumber: '',
                            clabe: '',
                            idstock: null,
                            idbank: null
                        }
                        SweetAlert.swal("Mensaje", "Creado.", "error");
                    }
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
            }
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.createStock = function() {
        if (ctrl.stockholders.type == 'Fisica') {
            ctrl.stockholders.businessname = null;
            if (ctrl.stockholders.name != '' && ctrl.stockholders.lastname != '') {
                FoundFact.addStockholder(ctrl.stockholders).then(function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", "No se pudo guardar: \n" + response.data.message, "error");
                    } else {
                        ctrl.stockholders.id = response.data.stockholder;
                        SweetAlert.swal("Mensaje:", "Guardado.", "success");
                    }
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
            } else {
                SweetAlert.swal("Error", "Falta campo nombre o apellido", "error");
            }
        }
        if (ctrl.stockholders.type == 'Moral') {
            ctrl.stockholders.name = null;
            ctrl.stockholders.lastname = null;
            if (ctrl.stockholders.businessname != '') {
                FoundFact.addStockholder(ctrl.stockholders).then(function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", "No se pudo guardar: \n" + response.data.message, "error");
                    } else {
                        ctrl.stockholders.id = response.data.stockholder;
                        SweetAlert.swal("Mensaje:", "Guardado.", "success");
                    }
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
            } else {
                SweetAlert.swal("Error", "Falta campo razón social.", "error");
            }
        }
    }
    ctrl.updateBank = function() {
        ctrl.AccountSelect.clabe = ctrl.AccountSelect.clabe.toString()
        ctrl.AccountSelect.accountnumber = ctrl.AccountSelect.accountnumber.toString()
        FoundFact.updateAccount(ctrl.AccountSelect).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error", "No se pudo guardar: \n" + response.data.message, "error");
            } else {
                FoundFact.byIDAccount(ctrl.stockholders.id).then(function(responses) {
                    if (responses.data.error) {
                        SweetAlert.swal("Error", "No se pudo guardar", "error");
                    } else {
                        ctrl.accounts = responses.data.stockholders;
                        ctrl.AccountSelect = {
                            id: null,
                            accounttype: '',
                            accountnumber: '',
                            clabe: '',
                            idstock: null,
                            idbank: null
                        }
                        SweetAlert.swal("Mensaje", "Guardado.", "error");
                    }
                }).catch(function(err) {
                    console.log(err)
                    SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
                })
            }
        }).catch(function(err) {
            console.log(err)
            SweetAlert.swal("Error:", "Ocurrio un ploblema con la conexión.", "error");
        })
    }
    ctrl.getBanks = function () {
        BancosFact.AllBanco().then(function (response) {
            ctrl.ListBanks = response.data.banks;
            console.log(ctrl.ListBanks);
        })
    }
    ctrl.getBanks();
}]);
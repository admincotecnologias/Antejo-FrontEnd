/**
 * Created by Enrique on 24/05/2017.
 */
antejo.controller("ClientEditCtrl", ["$filter", "SweetAlert", "ClientsFact", "BancosFact", '$routeParams', function($filter, SweetAlert, ClientsFact, BancosFact, $routeParams) {
    ctrl = this;
    ctrl.menu = 'info';
    ctrl.Client = {
        id: $routeParams.idClient,
        name: null,
        lastname: null,
        type: null,
        businessname: null,
        employeenumber: null,
        rfc: null,
        fiel: null,
        email: null,
        businesscategory: null,
        constitutiondate: null,
        address: null,
        colony: null,
        postalcode: null,
        city: null,
        state: null,
        phone: null
    }
    ctrl.Manager = {
        id: null,
        name: null,
        lastname: null,
        rfc: null,
        idclient: null,
        phone: null,
        idfile: null
    }
    ctrl.ShareHolder = {
        id: null,
        name: null,
        lastname: null,
        rfc: null,
        participation: null,
        oldwork: null,
        idclient: null,
        businessname: null,
        type: null
    }
    ctrl.Account = {
        id: null,
        accounttype: null,
        accountnumber: null,
        idclient: null,
        idbank: null,
        clabe: null
    }
    ctrl.banks = {}
    ctrl.getBanks = function() {
        BancosFact.AllBanco().then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.banks = response.data.banks;
            }
        }).catch(function(error) {
            console.log(error)
            SweetAlert.swal("Error:", "No se pudieron obtener bancos del servidor.", "error");
        })
    }
    ctrl.getData = function() {
        ClientsFact.showClients(ctrl.Client.id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.accounts = response.data.banks;
                ctrl.Shareholders = response.data.shareholders;
                ctrl.Managers = response.data.managers;
                ctrl.filesClient = response.data.files;
                response.data.client.constitutiondate = new Date(Date.parse(response.data.client.constitutiondate));
                response.data.client.postalcode = parseFloat(response.data.client.postalcode);
                response.data.client.employeenumber = parseFloat(response.data.client.employeenumber);
                response.data.client.employeenumber = parseFloat(response.data.client.employeenumber);
                ctrl.Client = response.data.client;
            }
        }).catch(function(error) {
            console.log(error)
            SweetAlert.swal("Error:", "No se pudieron obtener bancos del servidor.", "error");
        })
    }
    ctrl.AddAccount = function() {
        ctrl.Account.idclient = ctrl.Client.id;
        ClientsFact.addClientBank(ctrl.Account).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.accounts = response.data.accounts;
                SweetAlert.swal("Aviso:", response.data.message, "success");
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Error:", "No se pudieron obtener bancos del servidor.", "error");
        })
    }
    ctrl.DeleteAccount = function(account) {
        ClientsFact.deleteClientBank(account.id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.accounts = response.data.accounts;
                ctrl.getData();
                SweetAlert.swal("Aviso:", response.data.message, "success");
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Error:", "No se pudieron obtener bancos del servidor.", "error");
        })
    }
    ctrl.view = function() {
        console.log(ctrl.Client)
    }
    ctrl.SubirID = function($files) {
        if (!angular.equals(null, $files)) {
            var Form = new FormData();
            Form.append('file', $files);
            Form.append('idclient', ctrl.Client.id);
            Form.append('type', 'Identificacion');
            ClientsFact.AddFile(Form).then(function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "error");
                } else {
                    ctrl.Manager.idfile = response.data.file.id;
                    SweetAlert.swal("Aviso", response.data.message, "success");
                }
            }).catch(function(error) {
                console.log(error);
                SweetAlert.swal("Aviso", "No se pudo conectar con el servidor.", "warning");
            })
        } else {
            SweetAlert.swal("Aviso", "Archivo invalido.", "warning");
        }
    }
    ctrl.SubirExtras = function($files) {
        if (!angular.equals(null, $files)) {
            var Form = new FormData();
            Form.append('file', $files);
            Form.append('idclient', ctrl.Client.id);
            Form.append('type', 'Extras');
            ClientsFact.AddFile(Form).then(function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "error");
                } else {
                    console.log(response.data)
                    ctrl.filesClient = response.data.files;
                    SweetAlert.swal("Aviso", response.data.message, "success");
                }
            }).catch(function(error) {
                console.log(error);
                SweetAlert.swal("Aviso", "No se pudo conectar con el servidor.", "warning");
            })
        } else {
            SweetAlert.swal("Aviso", "Archivo invalido.", "warning");
        }
    }
    ctrl.SubirAsamblea = function($files) {
        if (!angular.equals(null, $files)) {
            var Form = new FormData();
            Form.append('file', $files);
            Form.append('idclient', ctrl.Client.id);
            Form.append('type', 'Asamblea');
            ClientsFact.AddFile(Form).then(function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "error");
                } else {
                    console.log(response.data)
                    ctrl.filesClient = response.data.files;
                    SweetAlert.swal("Aviso", response.data.message, "success");
                }
            }).catch(function(error) {
                console.log(error);
                SweetAlert.swal("Aviso", "No se pudo conectar con el servidor.", "warning");
            })
        } else {
            SweetAlert.swal("Aviso", "Archivo invalido.", "warning");
        }
    }
    ctrl.SubirCons = function($files) {
        if (!angular.equals(null, $files)) {
            var Form = new FormData();
            Form.append('file', $files);
            Form.append('idclient', ctrl.Client.id);
            Form.append('type', 'Constitutiva');
            ClientsFact.AddFile(Form).then(function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Aviso", "Error: \n" + response.data.message, "error");
                } else {
                    console.log(response.data)
                    ctrl.filesClient = response.data.files;
                    SweetAlert.swal("Aviso", response.data.message, "success");
                }
            }).catch(function(error) {
                console.log(error);
                SweetAlert.swal("Aviso", "No se pudo conectar con el servidor.", "warning");
            })
        } else {
            SweetAlert.swal("Aviso", "Archivo invalido.", "warning");
        }
    }
    ctrl.downloadID = function(id) {
        ClientsFact.DownloadFile(id);
    }
    ctrl.DeleteFile = function(id) {
        ClientsFact.deleteFile(id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                SweetAlert.swal("Aviso:", response.data.message, "success");
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Aviso:", "No se alcanzo servidor.", "error");
        })
    }
    ctrl.CreateClient = function() {
        console.log(ctrl.Client)
        ClientsFact.addClients(ctrl.Client).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error:", response.data.message, "error");
            } else {
                ctrl.Client = response.data.client;
                SweetAlert.swal("Guardado:", response.data.message, "success");
            }
        })
    }
    ctrl.EditClient = function() {
        var aux = angular.copy(ctrl.Client);
        aux.phone = parseInt(ctrl.Client.phone);
        ClientsFact.updateClients(ctrl.Client.id, aux).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso", response.data.message, "warning");
            } else {
                swal({
                        title: "Aviso:",
                        text: "Guardado.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#66dd55",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            location.reload();
                        } else {
                            location.reload();
                        }
                    });
            }
        })
    }
    ctrl.CreateManager = function() {
        ctrl.Manager.idclient = ctrl.Client.id;
        if (ctrl.Manager.idfile != null) {
            ClientsFact.addManager(ctrl.Manager).then(function(response) {
                if (response.data.error) {
                    SweetAlert.swal("Error:", response.data.message, "error");
                } else {
                    ctrl.Managers = response.data.managers;
                    ctrl.Manager = {
                        id: null,
                        name: null,
                        lastname: null,
                        rfc: null,
                        idclient: null,
                        phone: null,
                        idfile: null
                    }
                    ctrl.getData();
                    SweetAlert.swal("Guardado:", response.data.message, "success");
                }
            })
        } else {
            SweetAlert.swal("Aviso", "No se puede guardar sin subir identificación.", "warning");
        }
    }
    ctrl.deleteManager = function(mana) {
        ClientsFact.deleteManager(mana.id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.getData();
                SweetAlert.swal("Eliminado:", response.data.message, "success");
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
        })
    }
    ctrl.CreateShareHolder = function() {
        ctrl.ShareHolder.idclient = ctrl.Client.id;
        ClientsFact.addClientShareholder(ctrl.ShareHolder).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error:", response.data.message, "error");
            } else {
                ctrl.Shareholders = response.data.shareholders;
                ctrl.ShareHolder = {
                    id: null,
                    name: null,
                    lastname: null,
                    rfc: null,
                    participation: null,
                    oldwork: null,
                    idclient: null
                }
                ctrl.getData();
                SweetAlert.swal("Guardado:", response.data.message, "success");
            }
        })
    }
    ctrl.deleteShareholder = function(share) {
        ClientsFact.deleteShareholder(share.id).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Aviso:", response.data.message, "warning");
            } else {
                ctrl.getData();
                SweetAlert.swal("Eliminado:", response.data.message, "success");
            }
        }).catch(function(error) {
            console.log(error);
            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
        })
    }
    ctrl.CreateAccountBank = function() {
        ctrl.Account.idclient = ctrl.Client.id;
        ctrl.Account.clabe = ctrl.Account.clabe.toString()
        ClientsFact.addClientBank(ctrl.Account).then(function(response) {
            if (response.data.error) {
                SweetAlert.swal("Error:", response.data.message, "error");
            } else {
                ctrl.Account = {
                    id: null,
                    accounttype: null,
                    accountnumber: null,
                    idclient: null,
                    idbank: null,
                    clabe: null
                }
                ctrl.getData();
                SweetAlert.swal("Guardado:", response.data.message, "success");
            }
        })
    }


    //Inicializacion
    ctrl.getData();
    ctrl.getBanks();
}]);
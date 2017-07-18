antejo.controller("EmpleadosCtrl", ['$scope', '$location', '$http', 'UserFact', 'EmployeesFact', 'PuestosFact', 'Pagefact', 'SweetAlert', 'UserFact', 'PermisosFact',
    function($scope, $location, $http, UserFact, EmployeesFact, PuestosFact, Pagefact, SweetAlert, UserFact, PermisosFact) {
        //OBJECTS MODALS
        $scope.modalupuser = {
            id: 0,
            puestos: [],
            selected: "",
            name: "",
            lastname: "",
            email: "",
            permisos: [],
            password: "",
            password2: "",
            pages: [],
            selectPage: ""
        }
        $scope.modaladduser = {
            puestos: [],
            selected: "",
            name: "",
            lastname: "",
            email: "",
            permisos: [],
            password: "",
            password2: "",
            pages: [],
            selectPage: "",
            create_user: false,
            create_employee: false,
            create_permission: false
        }
        $scope.modalpuesto = {
            puestos: [],
            descripcion: ""
        }
        $scope.regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        $scope.validateModalAddUser = function() {
            if ($scope.modaladduser.password != $scope.modaladduser.password2) {
                $scope.bool_messageadduser = true;
                SweetAlert.swal("Error", "Las contraseñas no son iguales.", "error");
                $("#message_addusermodal").text("Contraseñas no son iguales.");
                return false;

            }
            if ($scope.modaladduser.password.length < 6) {
                $scope.bool_messageadduser = true;
                SweetAlert.swal("Error", "La contraseña debe contener al menos 6 caracteres.", "error");
                $("#message_addusermodal").text("La contraseña debe contener minimo 6 caracteres");
                return false;
            }
            $scope.onClickTab($scope.tabs[1]);
            return false;
        }

        //TABS MODAL
        $scope.tabs = [{
                title: 'Informacion Personal',
                url: 'personalinfo.tpl.html'
            }, {
                title: 'Permisos',
                url: 'permisos.tpl.html'
            },
            {
                title: '',
                url: 'carga.tpl.html'
            }
        ];
        $scope.currentTab = 'personalinfo.tpl.html';
        $scope.onClickTab = function(tab) {
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.currentTab;
            }
            //CREATE USER 
        $scope.Create_Employee = function() {
            $scope.onClickTab($scope.tabs[2]);
            var fullname = $scope.modaladduser.name.split(' ')[0] + " " + $scope.modaladduser.lastname.split(' ')[0];
            UserFact.addUser(fullname, $scope.modaladduser.email, $scope.modaladduser.password, $scope.modaladduser.password2).then(
                function(response) {
                    if (response.data.error == true) {
                        SweetAlert.swal("Error", response.data.message + "\n" + response.data.errors, "error");
                    } else {
                        var iduser = response.data.id;
                        $scope.modaladduser.create_user = true;
                        EmployeesFact.addEmployees($scope.modaladduser.name, $scope.modaladduser.lastname, iduser, $scope.modaladduser.selected.id).then(
                            function(response2) {
                                if (response2.data.error == true) {
                                    SweetAlert.swal("Error", response2.data.message, "error");
                                } else {
                                    var idemployee = response2.data.id;
                                    $scope.modaladduser.create_employee = true;
                                    $scope.modaladduser.permisos.forEach(function(item, index) {
                                        PermisosFact.addPermission(iduser, item.page.id, item.ver, item.insert, item.update, item.deletes, item.report).then(
                                            function(response) {},
                                            function(error) {
                                                SweetAlert.swal("Error", "No se pudo conectar con el servidor", "error");
                                            });
                                    });
                                    $scope.allEmployees();
                                    $scope.modaladduser.create_permission = true;
                                }
                            },
                            function(error) {
                                console.log(error)
                                SweetAlert.swal("Error", "No se pudo conectar con el servidor", "error");
                            }
                        );
                    }
                },
                function(error) {
                    SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
                }
            );
        }

        //SHOW BY ID        
        $scope.employee = null;
        $scope.showEmployees = function(id, type) {
            EmployeesFact.showEmployees(id).then(function(response) {
                if (response.data.error === false) {
                    $scope.employee = response.data;
                    if (type == true) {
                        SweetAlert.swal("Empleado:", "Nombre: \n" + $scope.employee.name +
                            " " + $scope.employee.lastname + "\n\n" +
                            "Email: \n" + $scope.employee.email + "\n\n" +
                            "Puesto: \n" + $scope.employee.puesto.name
                        );
                    } else {
                        $scope.modalupuser.id = response.data.id;
                        $scope.modalupuser.name = response.data.name;
                        $scope.modalupuser.lastname = response.data.lastname;
                        $scope.modalupuser.email = response.data.email;
                        $scope.modalupuser.selected = response.data.puesto;
                        $scope.modalupuser.permisos = response.data.permisos;
                    }
                } else {
                    SweetAlert.swal("Error", response.data.message);
                }
            }, function(error) {});
        }

        //DELETE EMPLEADO
        $scope.deleteEmployee = function(id) {
            SweetAlert.swal({
                    title: "Aviso",
                    text: "Seguro que desea eliminar este campo",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Si',
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        EmployeesFact.deleteEmployees(id).then(function(response) {
                            if (response.data.error) {
                                SweetAlert.swal("Aviso:", response.data.message, "warning");
                            } else {
                                SweetAlert.swal("Aviso", "Eliminado correctamente.", "success")
                                $scope.allEmployees();
                            }
                        }).catch(function(error) {
                            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
                        });
                    } else {
                        swal("Cancelado", "Dato no eliminado", "error");
                    }
                });
        }

        /*  $scope.deleteEmployee = function(id) {
                  EmployeesFact.deleteEmployees(id).then(function(response) {
                      if (response.data.error == true) {
                          SweetAlert.swal("Error", response.data.message, "error");
                      } else {
                          $("#modal_up_user_cerrar").click();
                          SweetAlert.swal("Mensaje", response.data.message, "success");
                          $scope.allEmployees();
                      }
                  }, function(error) {
                      SweetAlert.swal("Error", "No se pudo conectar con el servidor.", "error");
                  });
              }*/
        //AddPermission
        $scope.AddPermission = function() {
            var permisos = {
                page: $scope.modaladduser.selectPage,
                ver: ($scope.checkadd_ver == true ? $scope.checkadd_ver : false),
                insert: ($scope.checkadd_insert == true ? $scope.checkadd_insert : false),
                update: ($scope.checkadd_update == true ? $scope.checkadd_update : false),
                deletes: ($scope.checkadd_delete == true ? $scope.checkadd_delete : false),
                report: ($scope.checkadd_report == true ? $scope.checkadd_report : false)
            }
            $scope.modaladduser.permisos.push(permisos);
        }
        $scope.deletePermiso = function(index) {
            $scope.modaladduser.permisos.splice(index, 1);
        }


        //ADD PUESTO
        $scope.addPuesto = function() {
            if ($scope.modalpuesto.descripcion != "") {
                var name = $scope.modalpuesto.descripcion.trim();
                PuestosFact.addPuesto(name).then(function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", response.data.message, "error");
                    } else {
                        $scope.allPuesto();
                        $scope.modalpuesto.descripcion = "";
                        SweetAlert.swal("Guardado", response.data.message, "success");
                    }
                }, function(error) {
                    SweetAlert.swal("Error", "Error al comuncarse con el servidor.", "error");
                }).catch(function(e) {});

            } else {
                SweetAlert.swal("Error", "Agrega una descripción.", "error");
            }
        }
        $scope.searchList = function(list, id) {
            var elem = list.filter(function(element) {
                if (element.id == id) {
                    return element;
                }
            });
            return elem;
        }
        $scope.editModeUser = function() {
                var flag = true;
                var dataUpdate = {
                    fullname: "",
                    name: "",
                    lastname: "",
                    password: "",
                    password2: "",
                    email: "",
                    puesto: ""
                }
                if ($scope.modalupuser.password || $scope.modalupuser.password2) {
                    if ($scope.modalupuser.password != $scope.modalupuser.password2) {
                        flag = false;
                        SweetAlert.swal("Error", "Contraseñas no son iguales.", "error");
                    } else {
                        dataUpdate.password = $scope.modalupuser.password;
                        dataUpdate.password2 = $scope.modalupuser.password2;
                    }
                } else {
                    delete dataUpdate.password;
                    delete dataUpdate.password2;
                }
                if ($scope.employee.name != $scope.modalupuser.name) {
                    dataUpdate.name = $scope.modalupuser.name;
                } else {
                    delete dataUpdate.name;
                }
                if ($scope.employee.lastname != $scope.modalupuser.lastname) {
                    dataUpdate.lastname = $scope.modalupuser.lastname;
                } else {
                    delete dataUpdate.lastname;
                }
                if ($scope.employee.email != $scope.modalupuser.email) {
                    dataUpdate.email = $scope.modalupuser.email;
                } else {
                    delete dataUpdate.email;
                }
                if ($scope.modalupuser.selected.id != $scope.employee.puesto.id) {
                    dataUpdate.puesto = $scope.modalupuser.selected.id;
                } else {
                    delete dataUpdate.puesto;
                }
                if (dataUpdate.name || dataUpdate.lastname) {
                    dataUpdate.fullname = $scope.modalupuser.name.split(' ')[0] + " ";
                    dataUpdate.fullname += $scope.modalupuser.lastname.split(' ')[0];
                } else {
                    delete dataUpdate.fullname;
                }
                if (Object.getOwnPropertyNames(dataUpdate).length > 0) {
                    if (("fullname" in dataUpdate) || ("email" in dataUpdate) || ("password" in dataUpdate)) {
                        var data = UserFact.updateUser($scope.employee.iduser, dataUpdate);
                        if (data != null) {
                            data.then(function(response) {
                                if (response.data.error == true) {
                                    SweetAlert.swal("Error", response.data.message, "error");
                                } else {
                                    $scope.allEmployees();
                                    SweetAlert.swal("Mensaje", "Usuario Editado", "success");
                                }
                            }, function(error) {
                                SweetAlert.swal("Error", "Error al conectar con el servidor", "error");
                            });
                        }
                    }
                    if (("name" in dataUpdate) || ("lastname" in dataUpdate) || ("puesto" in dataUpdate)) {
                        var dataemployee = EmployeesFact.updateEmployees($scope.employee.id, dataUpdate);
                        if (dataemployee != null) {
                            dataemployee.then(function(response) {
                                if (response.data.error == true) {
                                    SweetAlert.swal("Error", response.data.message, "error");
                                } else {
                                    $scope.allEmployees();
                                    SweetAlert.swal("Mensaje", "Empleado Editado", "success");
                                }
                            }, function(error) {
                                SweetAlert.swal("Error", "Error al conectar con el servidor", "error");
                            });
                        }
                    }
                }
            }
            //PERMISO MODAL UPDATE USER
        $scope.addPermissionUpdate = function() {
            var permisos = {
                page: $scope.modalupuser.selectPage,
                ver: ($scope.checkup_ver == true ? $scope.checkup_ver : false),
                insert: ($scope.checkup_insert == true ? $scope.checkup_insert : false),
                update: ($scope.checkup_update == true ? $scope.checkup_update : false),
                deletes: ($scope.checkup_delete == true ? $scope.checkup_delete : false),
                report: ($scope.checkup_report == true ? $scope.checkup_report : false)
            }
            PermisosFact.addPermission($scope.employee.iduser, permisos.page.id, permisos.ver, permisos.insert, permisos.update, permisos.deletes, permisos.report).then(
                function(response) {
                    if (response.data.error) {
                        SweetAlert.swal("Error", response.data.message, "error");
                    } else {
                        $scope.showEmployees($scope.employee.id, false);
                        SweetAlert.swal("Mensaje", "Permiso Agregado.", "success");
                    }
                },
                function(error) {
                    SweetAlert.swal("Error", "No se pudo conectar con el servidor", "error");
                });
        }

        $scope.deletePermisoUpdate = function(id, index) {
            SweetAlert.swal({
                    title: "Aviso",
                    text: "Seguro que desea eliminar este campo",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Si',
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {

                        PermisosFact.deletePermission(id).then(function(response) {
                            if (response.data.error) {
                                SweetAlert.swal("Aviso:", response.data.message, "warning");
                            } else {
                                $scope.modalupuser.permisos.splice(index, 1);
                                SweetAlert.swal("Aviso:", "Eliminado correctamente.", "success");
                            }
                        }).catch(function(error) {
                            SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
                        });
                    } else {
                        $scope.showEmployees($scope.employee.id, false);
                        swal("Cancelado", "Dato no eliminado", "error");
                    }
                });
        }



        //DELETE PUESTO
        $scope.deletePuesto = function(id) {
                SweetAlert.swal({
                        title: "Aviso",
                        text: "Seguro que desea eliminar este campo",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Si',
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {

                            PuestosFact.deletePuesto(id).then(function(response) {
                                if (response.data.error) {
                                    SweetAlert.swal("Aviso:", response.data.message, "warning");
                                } else {
                                    SweetAlert.swal("Aviso", "Eliminado correctamente.", "success")
                                    $scope.allPuesto();
                                }
                            }).catch(function(error) {
                                SweetAlert.swal("Aviso:", "Error al conectarse con el servidor.", "error");
                            });
                        } else {
                            swal("Cancelado", "Dato no eliminado", "error");
                        }
                    });
            }
            // TABLA PRINCIPAL
        $scope.allPuesto = function() {
            PuestosFact.allPuesto(function(puestos) {
                $scope.modalupuser.puestos = puestos.occupations;
                $scope.modaladduser.puestos = puestos.occupations;
                $scope.modalpuesto.puestos = puestos.occupations;
            });
        }
        $scope.allEmployees = function() {
            EmployeesFact.allEmployees(function(employees) {
                $scope.employees = employees;
            });
        }
        $scope.allPages = function() {
            Pagefact.allPage(function(pages) {
                $scope.modaladduser.pages = pages;
                $scope.modalupuser.pages = pages;
            });
        }
        $scope.allPages();
        $scope.allPuesto();
        $scope.allEmployees();
    }
]);
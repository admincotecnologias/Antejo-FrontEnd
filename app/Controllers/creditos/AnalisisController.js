antejo.controller('AnalisisCtrl', ['$filter', '$scope', 'SweetAlert', 'CreditsFact', '$routeParams', function($filter, $scope, SweetAlert, CreditsFact, $routeParams) {
    $scope.credits = [];
    $scope.menu = 'show';
    $scope.AnalisisType = "ANALISIS";
    $scope.files;
    $scope.applicationid = null;
    $scope.observacion = '';
    $scope.numFiles = 0;

    $scope.response = {
        error: 'false',
        analisis: [
            observacion = {
                id: '1',
                idappi: '1',
                obs: 'observacion 1'
            }, {
                id: '2',
                idappi: '1',
                obs: 'observacion 2'
            }, {
                id: '3',
                idappi: '1',
                obs: 'observacion 3'
            },
            //Se repiten en el ng-repeat
            files = {
                idfile: '1',
                desc: 'archivo1'
            }, {
                idfile: '2',
                desc: 'archivo2'
            }
        ]
    }

    $scope.getCredit = function() {
        CreditsFact.showCredit($routeParams.idCredito, function(callback) {
            console.log(callback)
            if (callback.error) {
                SweetAlert.swal('Mensaje', "Credito no existe", "warning");
            } else {
                console.log(callback);
                $scope.applicationid = callback.applicationID;
                setTimeout(function() {
                    $(function() {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                }, 500);
            }
        })
    }
    $scope.addFile = function($file) {
        if ($file) {

            if ($scope.numFiles == 0)
                $scope.files = new Array();
            $scope.files.push({
                file: $file,
                idapplication: $scope.analisis.applicationid,
                type: $scope.AnalisisType
            })

            SweetAlert.swal("Aviso", "Archivo numero " + ++$scope.numFiles + " agregado.", "success");
            console.log($scope.files);
        }

    }

    $scope.deleteFile = function(index) {
        $scope.files.splice(index, 1);
        if ($scope.files.length < 1) {
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        } else {
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    }
    $scope.agregarAnalisis = function() {
        if ($scope.observacion == null || $scope.observacion == '') {
            SweetAlert.swal('Aviso', 'Tiene que agregar una observacion', 'warning');
            return;
        }
        var body = {
            analisis: {
                observacion: $scope.observacion,
                applicationid: $scope.applicationid,
            }
        }
        if ($scope.files.length > 0) {
            body.files = $scope.files;
        }

        CreditsFact.agregarAnalisis(body, function(callback) {
            if (callback.error) {
                SweetAlert.swal('Error', 'No se hizo carnal', 'error');
                console.log(callback.error);
            } else {
                SweetAlert.swal('Aviso', 'Si se hizo carnal', 'success');
                window.location.reload();
            }
        })

    }


    // Inicializacion
    $scope.getCredit();

}]);
antejo.controller('AnalisisCtrl', ['$filter', '$scope', 'SweetAlert', 'CreditsFact', '$routeParams', function($filter, $scope, SweetAlert, CreditsFact, $routeParams) {
    $scope.credits = [];
    $scope.menu = 'show';
    $scope.AnalisisType = "ANALISIS";
    $scope.files;
    $scope.applicationid = null;
    $scope.analisisid = null;
    $scope.observacion = '';
    $scope.numFiles = 0;


    $scope.response = {
        error: 'false',
        analisis: [{
            files: {
                id: {
                    filepath: [],
                    name: '',
                    'content-type': ''
                }
            },
            observacion: '',
            analysisid: ''
        }]
    }



    $scope.getCredit = function() {
        CreditsFact.showCredit($routeParams.idCredito, function(callback) {
            if (callback.error) {
                SweetAlert.swal('Mensaje', "Credito no existe", "warning");
            } else {
                $scope.applicationid = callback.applicationID;


                CreditsFact.mostrarAnalisis($scope.applicationid, function(callback) {
                    if (callback.error) {
                        SweetAlert.swal('Mensaje', "Analisis no encontrados", "warning");
                    } else {
                        $scope.response = callback.analisis;
                        console.log($scope.response);
                        setTimeout(function() {
                            $(function() {
                                $('[data-toggle="tooltip"]').tooltip()
                            })
                        }, 500);
                    }
                })
            }
        })
    };
    $scope.addFile = function($file) {
        if ($file) {

            var Form = new FormData();
            Form.append('file', $file);
            console.log($file);
            Form.append('idapplication', $scope.applicationid);
            Form.append('type', $scope.AnalisisType);
            CreditsFact.agregarArchivoAnalisis(Form, $scope.analisisid, function(callback) {
                if (callback.error) {
                    SweetAlert.swal('Mensaje', "Archivo no pudo ser agregado", "warning");
                } else {
                    if ($scope.numFiles == 0) {
                        $scope.files = new Array();
                    }

                    $scope.files.push({
                        'file': $file,
                        'idapplication': $scope.applicationid,
                        'type': $scope.AnalisisType
                    });
                    console.log($scope.files);
                    SweetAlert.swal("Aviso", "Archivo numero " + ++$scope.numFiles + " agregado.", "success");
                }
            })


        }

    }

    $scope.deleteFile = function(index) {
        CreditsFact.eliminarArchivoAnalisis($scope.analisisid, function(callback) {
            if (callback.error) {
                SweetAlert.swal('Mensaje', "Archivo no pudo ser agregado", "warning");
            } else {
                $scope.numFiles--;
                $scope.files.splice(index, 1);
                if ($scope.files.length < 1) {
                    $("#dropzone").removeClass("dropped");
                    $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
                } else {
                    $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
                    $('#dropzone img').remove();
                }
                SweetAlert.swal("Aviso", "Archivo eliminado correctamente", "success");
            }
        })

    }
    $scope.prepararAnalisis = function(){
        $scope.files = null;
        $scope.analisisid = null;
        $scope.observacion = '';
        $scope.numFiles = 0;
        $scope.menu = "create";

    }
    $scope.cargarAnalisis = function(analysisid){
        $('#createtab').click();
        //$('document').
        $scope.prepararAnalisis();
        analisis = $scope.response[analysisid];
        $scope.menu = "create";
        $scope.analisisid = analysisid;
        files = analisis.files;
        $scope.observacion = analisis.observacion;
        $scope.files = Array();
        $scope.numFiles=0;
        for(fileid in files){
            $scope.numFiles++;
            $scope.files.push({
                'file': files[fileid],
                'idapplication': $scope.applicationid,
                'type': $scope.AnalisisType
            });
        }
        console.log($scope.files);



    }
    $scope.actualizarAnalisis = function() {
        if(!$scope.analisisid){
            SweetAlert.swal('Aviso','Tiene que agregar un analisis','warning');
        }
        if ($scope.observacion == null || $scope.observacion == '') {
            SweetAlert.swal('Aviso', 'Tiene que agregar una observacion', 'warning');
            return;
        }
        var body = {
            observation : $scope.observacion
        }
        CreditsFact.actualizarAnalisis(body,$scope.analisisid, function(callback) {
            if (callback.error) {
                SweetAlert.swal('Error', 'Error al establecer conexion con el servidor.', 'error');
            } else {
                SweetAlert.swal('Aviso', 'Analisis actualizado', 'success');

            }
        })

    }
    $scope.agregarAnalisis = function() {
        if ($scope.observacion == null || $scope.observacion == '') {
            SweetAlert.swal('Aviso', 'Tiene que agregar una observacion', 'warning');
            return;
        }
        var body = {
            analisis: {
                observation: $scope.observacion,
                applicationid: $scope.applicationid,
            }
        }
        CreditsFact.agregarAnalisis(body, function(callback) {
            if (callback.error) {
                SweetAlert.swal('Error', 'Error al establecer conexion con el servidor', 'error');
            } else {
                $scope.analisisid = callback.analisisid;
                SweetAlert.swal('Aviso', 'Analisis agregado', 'success');

            }
        })

    }


    // Inicializacion
    $scope.getCredit();

}]);

/*
*
*
* if($scope.files.length>0){
 formData = new FormData();
 formData.
 formData.append('file',files[0].file);
 formData.append('idapplication',files[0].idapplication);
 formData.append('type',files[0].type);
 CreditsFact.agregarArchivoAnalisis(formData,callback.analisis.id,function(callback){
 if(callback.error){
 SweetAlert.swal('Error','Error al establecer conexion con el servidor','error');
 console.log(callback.error);
 }else {
 SweetAlert.swal({
 title: "Mensaje:",
 text: "Analisis agregado",
 type: "success",
 confirmButtonColor: "#DD6B55",
 confirmButtonText: "OK.",
 closeOnConfirm: true
 },
 function(isConfirm){
 window.location.reload();
 });
 }
 })
 }else{
* */
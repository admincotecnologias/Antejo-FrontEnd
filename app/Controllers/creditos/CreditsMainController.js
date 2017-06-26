/**
 * Created by Enrique on 16/03/2017.
 */
antejo.controller('CreditMainCtrl', ['$scope', '$http', '$filter', 'SweetAlert', 'ClientsFact', 'ApplicationsFact', "Upload","CreditsFact", function($scope, $http, $filter, SweetAlert, ClientsFact, ApplicationsFact, Upload,CreditsFact) {
    $scope.credits = [];
    $scope.GetAll = function () {
        CreditsFact.GetAll(function (callback) {
            console.log(callback)
            if(callback.error){
                SweetAlert.swal('Mensaje',"No hay Creditos","warning");
            }else {
                $scope.credits = callback.credits;
                setTimeout(function () {
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip()
                    })
                },500);
            }
        })
    }

    // Inicializacion
    $scope.GetAll();
}]);
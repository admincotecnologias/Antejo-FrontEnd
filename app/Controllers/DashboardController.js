/**
 * Created by Enrique on 01/06/2017.
 */
antejo.controller('DashboardCtrl', ['$filter', 'SweetAlert', 'DashboardFact', '$scope', function ($filter, SweetAlert, DashboardFact, $scope) {
    $scope.menu = 'Morosidad';
    $scope.MorosidadTotal = function () {

        DashboardFact.MorosidadTotal().then(function (response) {
            $scope.Morosidad = {};
            $scope.Morosidad.labels = ['Activo', 'Vencido', 'Fuera de Gracia'];
            $scope.Morosidad.colors = ['#8bc34a','#ffc107','#e51c23']
            $scope.Morosidad.data = [];
            $scope.Morosidad.datacartera = [];
            $scope.Morosidad.options = {};
            //Inicializamos sumatorias de dinero y cantidad de muestras
            $scope.totalActive = 0;
            $scope.totalGrace = 0;
            $scope.totalExpired = 0;
            $scope.sampleCount = 0;
            $scope.samples = response.data.samples;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras
            for (var sampleId in $scope.samples) {
                var sample = $scope.samples[sampleId];
                $scope.sampleCount++;
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    $scope.totalActive += sample[entryKey].active_money;
                    $scope.totalGrace += sample[entryKey].grace_money;
                    $scope.totalExpired += sample[entryKey].expired_money;
                }
            }
            console.log($scope.totalActive);
            console.log($scope.totalGrace);
            console.log($scope.totalExpired);

            $scope.Morosidad.Vencido = {
                porcentaje: 0,
                total: 0
            }

            $scope.Morosidad.datacartera.push($scope.totalActive/$scope.sampleCount);
            $scope.Morosidad.datacartera.push($scope.totalGrace/$scope.sampleCount);
            $scope.Morosidad.datacartera.push($scope.totalExpired/$scope.sampleCount);

            $scope.Morosidad.data.push($filter('number')($scope.Morosidad.datacartera[0]),2);
            $scope.Morosidad.data.push($filter('number')($scope.Morosidad.datacartera[1]),2);
            $scope.Morosidad.data.push($filter('number')($scope.Morosidad.datacartera[2]),2);
        }).catch(function (error) {
            console.log(error);
        })
        /*
        DashboardFact.MorosidadTotal().then(function (response) {
            $scope.Morosidad = {};
            $scope.Morosidad.labels = ['Activo', 'Vencido', 'Fuera de Gracia'];
            $scope.Morosidad.colors = ['#8bc34a','#ffc107','#e51c23']
            $scope.Morosidad.data = [];
            $scope.Morosidad.datacartera = [];
            $scope.Morosidad.options = {}
                if(response.data.hasOwnProperty('1')
            )
            {
                $scope.Morosidad.data.push($filter('number')(response.data['1'].porcentaje,2));
                $scope.Morosidad.datacartera.push(response.data['1'].cartera);
                $scope.Morosidad.Activo = response.data['1'];
            }
            else
            {
                $scope.Morosidad.Activo = {
                    porcentaje: 0,
                    total: 0
                }
            }
            if (response.data.hasOwnProperty('2')) {
                $scope.Morosidad.data.push($filter('number')(response.data['2'].porcentaje,2));
                $scope.Morosidad.datacartera.push(response.data['2'].cartera);
                $scope.Morosidad.Vencido = response.data['2'];
            } else {
                $scope.Morosidad.Vencido = {
                    porcentaje: 0,
                    total: 0
                }
            }
            if (response.data.hasOwnProperty('3')) {
                $scope.Morosidad.data.push($filter('number')(response.data['3'].porcentaje,2));
                $scope.Morosidad.datacartera.push(response.data['3'].cartera);
                $scope.Morosidad.Gracia = response.data['3'];
            } else {
                $scope.Morosidad.Gracia = {
                    porcentaje: 0,
                    total: 0
                }
            }
            console.log($scope.Morosidad);
        }).catch(function (error) {
            console.log(error);
        })
        */
    }
    $scope.InteresNeto = function () {
        DashboardFact.InteresNeto().then(function (response) {
            console.log(response)
        }).catch(function (error) {
            console.log(error)
        })
    }
    $scope.MorosidadTotal();
    $scope.InteresNeto();
}]);
/**
 * Created by Enrique on 01/06/2017.
 */
antejo.controller('DashboardCtrl', ['$filter', 'SweetAlert', 'DashboardFact', '$scope', function ($filter, SweetAlert, DashboardFact, $scope) {
    $scope.menu = 'Morosidad';
    $scope.MorosidadTotal = function () {

        DashboardFact.MorosidadTotal().then(function (response) {
            $scope.Morosidad = {};
            $scope.Morosidad.labels = ['Activo', 'Vencido', 'Fuera de Gracia'];
            $scope.Morosidad.lineLabels = [];
            $scope.Morosidad.lineSeries = ['Activo','Vencido','Fuera de Gracia'];
            $scope.Morosidad.colors = ['#8bc34a','#ffc107','#e51c23'];
            $scope.Morosidad.lineColors = ['#8bc34a','#e51c23','#ffc107'];
            $scope.Morosidad.doughnutData = [];
            $scope.Morosidad.lineData = [];
            $scope.Morosidad.options = {};
            //Inicializamos sumatorias de dinero y cantidad de muestras
            totalActive = 0;
            totalGrace = 0;
            totalExpired = 0;
            sampleCount = 0;
            samples = response.data.samples;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras
            for (var sampleId in samples) {
                var sample = samples[sampleId];
                sampleCount++;
                sampleQuantities = [];
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    $scope.Morosidad.labels.push(sample[entryKey].created_at);
                    totalActive += sample[entryKey].active_money;
                    sampleQuantities[0] = totalActive;
                    totalExpired += sample[entryKey].expired_money;
                    sampleQuantities[1] = totalExpired;
                    totalGrace += sample[entryKey].grace_money;
                    sampleQuantities[2] = totalGrace;
                }
                $scope.Morosidad.lineData.push(sampleQuantities);


            }
            //Sumamos la cantidad total de dinero
            grandTotal = totalActive + totalGrace + totalExpired;
            //A cada uno de los estados de dinero, agregamos el total y su cantidad porcentual
            $scope.Morosidad.Vencido = {
                cartera: totalExpired,
                carteraporcentaje: totalExpired/grandTotal*100
            }
            $scope.Morosidad.Activo = {
                cartera: totalActive,
                carteraporcentaje: totalActive/grandTotal*100
            }
            $scope.Morosidad.Gracia = {
                cartera: totalGrace,
                carteraporcentaje: totalGrace/grandTotal*100
            }
            //Empujamos los datos a la grafica
            $scope.Morosidad.doughnutData.push(totalActive/sampleCount);
            $scope.Morosidad.doughnutData.push(totalGrace/sampleCount);
            $scope.Morosidad.doughnutData.push(totalExpired/sampleCount);

            //Empujamos los datos a la grafica
        }).catch(function (error) {
            console.log(error);
        })

    }
    $scope.InteresNeto = function () {
        DashboardFact.InteresNeto().then(function (response) {
            $scope.Intereses = {};
            $scope.Intereses.labels = ['Activo', 'Vencido', 'Fuera de Gracia'];
            $scope.Intereses.colors = ['#8bc34a','#ffc107','#e51c23']
            $scope.Intereses.datacartera = [];
            $scope.Intereses.options = {};
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
            //Sumamos la cantidad total de dinero
            $scope.grandTotal = $scope.totalActive + $scope.totalGrace + $scope.totalExpired;
            //A cada uno de los estados de dinero, agregamos el total y su cantidad porcentual
            $scope.Intereses.Vencido = {
                cartera: $scope.totalExpired,
                carteraporcentaje: $scope.totalExpired/$scope.grandTotal*100
            }
            $scope.Intereses.Activo = {
                cartera: $scope.totalActive,
                carteraporcentaje: $scope.totalActive/$scope.grandTotal*100
            }
            $scope.Intereses.Gracia = {
                cartera: $scope.totalGrace,
                carteraporcentaje: $scope.totalGrace/$scope.grandTotal*100
            }
            //Empujamos los datos a la grafica
            $scope.Intereses.datacartera.push($scope.totalActive/$scope.sampleCount);
            $scope.Intereses.datacartera.push($scope.totalGrace/$scope.sampleCount);
            $scope.Intereses.datacartera.push($scope.totalExpired/$scope.sampleCount);
        }).catch(function (error) {
            console.log(error);
        })
    }
    $scope.MorosidadTotal();
    $scope.InteresNeto();
}]);
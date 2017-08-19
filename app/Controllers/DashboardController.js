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
            $scope.Morosidad.lineColors = ['#8bc34a','#ffc107','#e51c23'];
            $scope.Morosidad.doughnutData = [];
            $scope.Morosidad.lineData = [
                [],//Dinero activo
                [],//Dinero vencido
                [] //Dinero fuera de gracia
            ];
            $scope.Morosidad.options = {};
            $scope.Morosidad.datasetOverride = [{ yAxisID: 'y-axis-1' }];
            $scope.Morosidad.lineOptions = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            };
            sampleCount = 0;
            samples = response.data.samples;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras
            for (var sampleId in samples) {
                var sample = samples[sampleId];
                sampleCount++;
                //Inicializamos sumatorias de dinero
                totalActive = 0;
                totalGrace = 0;
                totalExpired = 0;
                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.Morosidad.lineLabels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD

                    totalActive += sample[entryKey].active_money;
                    totalExpired += sample[entryKey].expired_money;
                    totalGrace += sample[entryKey].grace_money;
                }
                $scope.Morosidad.lineData[0].push(totalActive);
                $scope.Morosidad.lineData[1].push(totalExpired);
                $scope.Morosidad.lineData[2].push(totalGrace);


            }
            console.log($scope.Morosidad.lineData);
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
            $scope.Intereses.labels = [];
            $scope.Intereses.series = ['Ingresos Neto'];
            $scope.Intereses.colors = ['#8bc34a'];
            $scope.Intereses.data = [
                []//ingresos neto
            ];
            $scope.Intereses.options = {};
            samples = response.data.samples;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras

            for (var sampleId in samples) {
                var sample = samples[sampleId];
                //Inicializamos sumatorias de dinero
                totalInterestGained = 0;
                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.Intereses.labels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD

                    totalInterestGained+=sample[entryKey].interest_net_income;
                }
                $scope.Intereses.data[0].push(totalInterestGained);
            }
        }).catch(function (error) {
            console.log(error);
        })
    };

    $scope.CarteraPromedio = function () {
        DashboardFact.CarteraPromedio().then(function (response) {
            $scope.CarteraPromedio = {};
            $scope.CarteraPromedio.labels = [];
            $scope.CarteraPromedio.series = ['Cartera Promedio'];
            $scope.CarteraPromedio.colors = ['#87CEFA'];
            $scope.CarteraPromedio.data = [
                []//ingresos neto
            ];
            $scope.CarteraPromedio.options = {};
            $scope.CarteraPromedio.doughnutData = [];
            $scope.CarteraPromedio.doughnutLabels = [];
            samples = response.data.samples;
            tempDict = {};
            totalMoneyLoaned = 0;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras

            for (var sampleId in samples) {
                var sample = samples[sampleId];
                //Inicializamos sumatorias de dinero

                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.CarteraPromedio.labels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD
                    moneyLoaned = sample[entryKey].money_loaned;
                    totalMoneyLoaned+=moneyLoaned;
                    if(!tempDict[sample[entryKey].idclient]){
                        tempDict[sample[entryKey].idclient] = {
                            moneyLoaned : 0,
                            name : sample[entryKey].name
                        };
                    }
                    tempDict[sample[entryKey].idclient].moneyLoaned+=moneyLoaned;
                }
                $scope.CarteraPromedio.data[0].push(totalMoneyLoaned);
            }
            //Transformamos el objeto de valores a arreglo (para poder usarlo en la grafica)
            for(var entryKey in tempDict){
                $scope.CarteraPromedio.doughnutData.push(tempDict[entryKey].moneyLoaned);
                $scope.CarteraPromedio.doughnutLabels.push(tempDict[entryKey].name+" : "+$filter('number')(tempDict[entryKey].moneyLoaned/totalMoneyLoaned*100,2) + '% ');
            }
            console.log($scope.CarteraPromedio.doughnutData);
            console.log($scope.CarteraPromedio.doughnutLabels);
        }).catch(function (error) {
            console.log(error);
        })
    };
    $scope.DeudaPromedio = function () {
        DashboardFact.DeudaPromedio().then(function (response) {
            $scope.DeudaPromedio = {};
            $scope.DeudaPromedio.labels = [];
            $scope.DeudaPromedio.series = ['Cartera Promedio'];
            $scope.DeudaPromedio.colors = ['#87CEFA'];
            $scope.DeudaPromedio.data = [
                []//ingresos neto
            ];
            $scope.DeudaPromedio.options = {};
            $scope.DeudaPromedio.doughnutData = [];
            $scope.DeudaPromedio.doughnutLabels = [];
            samples = response.data.samples;
            tempDict = {};
            totalMoneyBorrowed = 0;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras

            for (var sampleId in samples) {
                var sample = samples[sampleId];
                //Inicializamos sumatorias de dinero

                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.DeudaPromedio.labels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD
                    moneyBorrowed = sample[entryKey].money_loaned;
                    totalMoneyBorrowed+=moneyBorrowed;
                    if(!tempDict[sample[entryKey].idclient]){
                        tempDict[sample[entryKey].idclient] = {
                            moneyBorrowed : 0,
                            name : sample[entryKey].name
                        };
                    }
                    tempDict[sample[entryKey].idclient].moneyBorrowed+=moneyBorrowed;
                }
                $scope.DeudaPromedio.data[0].push(totalMoneyBorrowed);
            }
            //Transformamos el objeto de valores a arreglo (para poder usarlo en la grafica)
            for(var entryKey in tempDict){
                $scope.DeudaPromedio.doughnutData.push(tempDict[entryKey].moneyBorrowed);
                $scope.DeudaPromedio.doughnutLabels.push(tempDict[entryKey].name+" : "+$filter('number')(tempDict[entryKey].moneyBorrowed/totalMoneyBorrowed*100,2) + '% ');
            }
            console.log($scope.DeudaPromedio.doughnutData);
            console.log($scope.DeudaPromedio.doughnutLabels);
        }).catch(function (error) {
            console.log(error);
        })
    };
    $scope.MargenFinanciero = function () {
        DashboardFact.MargenFinanciero().then(function (response) {
            console.log(response);
            $scope.MargenFinanciero = {};
            $scope.MargenFinanciero.labels = [];
            $scope.MargenFinanciero.series = ['Margen Financiero'];
            $scope.MargenFinanciero.colors = ['#8bc34a'];
            $scope.MargenFinanciero.data = [
                []//margen financiero
            ];
            $scope.MargenFinanciero.options = {};
            samples = response.data.samples;
            for(var sample in samples){
                $scope.MargenFinanciero.labels.push(samples[sample].created_at.substring(0,11));
                $scope.MargenFinanciero.data[0].push(samples[sample].financial_margin);
            }
            console.log($scope.MargenFinanciero);
        }).catch(function (error) {
            console.log(error);
        })
    }

    $scope.MorosidadTotal();
    $scope.InteresNeto();
    $scope.MargenFinanciero();
    $scope.CarteraPromedio();
    $scope.DeudaPromedio();
}]);
/**
 * Created by Enrique on 01/06/2017.
 */
antejo.controller('DashboardCtrl', ['$filter', 'SweetAlert', 'DashboardFact', '$scope', function ($filter, SweetAlert, DashboardFact, $scope) {

    $scope.menu = 'Morosidad';
    $scope.MorosidadTotal = function (dates = null) {
        console.log(dates);
        DashboardFact.MorosidadTotal(dates).then(function (response) {
            if(response.data.error){
                if(dates){
                    SweetAlert.swal("Advertencia","No se encontraron muestras en el rango de fechas seleccionado.","warning");
                    return;
                }
            }
            $scope.oldResponse = response;
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
    $scope.InteresNeto = function (dates = null) {

        DashboardFact.InteresNeto(dates).then(function (response) {
            if(response.data.error){
                if(dates){
                    SweetAlert.swal("Advertencia","No se encontraron muestras en el rango de fechas seleccionado.","warning");
                    return;
                }
            }
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
    $scope.CarteraPromedio = function (dates = null) {

        DashboardFact.CarteraPromedio(dates).then(function (response) {
            if(response.data.error){
                if(dates){
                    SweetAlert.swal("Advertencia","No se encontraron muestras en el rango de fechas seleccionado.","warning");
                    return;
                }
            }
            $scope.Cartera = {};
            $scope.Cartera.labels = [];
            $scope.Cartera.series = ['Cartera Promedio'];
            $scope.Cartera.colors = ['#87CEFA'];
            $scope.Cartera.data = [
                []//ingresos neto
            ];
            $scope.Cartera.options = {};
            $scope.Cartera.doughnutData = [];
            $scope.Cartera.doughnutLabels = [];
            samples = response.data.samples;
            tempDict = {};
            totalMoneyLoaned = 0;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras

            for (var sampleId in samples) {
                var sample = samples[sampleId];
                //Inicializamos sumatorias de dinero

                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.Cartera.labels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                moneyPerSample = 0;
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD
                    moneyLoaned = sample[entryKey].money_loaned;
                    moneyPerSample+=moneyLoaned
                    totalMoneyLoaned+=moneyLoaned;
                    if(!tempDict[sample[entryKey].idclient]){
                        tempDict[sample[entryKey].idclient] = {
                            moneyLoaned : 0,
                            name : sample[entryKey].name
                        };
                    }
                    tempDict[sample[entryKey].idclient].moneyLoaned+=moneyLoaned;
                }
                $scope.Cartera.data[0].push(moneyPerSample);
            }
            //Transformamos el objeto de valores a arreglo (para poder usarlo en la grafica)
            for(var entryKey in tempDict){
                $scope.Cartera.doughnutData.push(tempDict[entryKey].moneyLoaned);
                $scope.Cartera.doughnutLabels.push(tempDict[entryKey].name+" : "+$filter('number')(tempDict[entryKey].moneyLoaned/totalMoneyLoaned*100,2) + '% ');
            }
            console.log($scope.Cartera.doughnutData);
            console.log($scope.Cartera.doughnutLabels);
        }).catch(function (error) {
            console.log(error);
        })
    };
    $scope.DeudaPromedio = function (dates = null) {

        DashboardFact.DeudaPromedio(dates).then(function (response) {
            if(response.data.error){
                if(dates){
                    SweetAlert.swal("Advertencia","No se encontraron muestras en el rango de fechas seleccionado.","warning");
                    return;
                }
            }
            $scope.Deuda = {};
            $scope.Deuda.labels = [];
            $scope.Deuda.series = ['Cartera Promedio'];
            $scope.Deuda.colors = ['#87CEFA'];
            $scope.Deuda.data = [
                []//ingresos neto
            ];
            $scope.Deuda.options = {};
            $scope.Deuda.doughnutData = [];
            $scope.Deuda.doughnutLabels = [];
            samples = response.data.samples;
            tempDict = {};
            totalMoneyBorrowed = 0;
            //Iteramos cada muestra, la asignamos a una variable, y aumentamos el numero de muestras

            for (var sampleId in samples) {
                var sample = samples[sampleId];
                //Inicializamos sumatorias de dinero

                //hacemos este ciclo para obtener la fecha de muestra; solo la ocupamos una vez
                for(var entryKey in sample){
                    $scope.Deuda.labels.push(sample[entryKey].created_at.substring(0,11));
                    break;
                }
                //Iteramos cada entrada en la muestra, y agregamos a las sumatorias de dinero correspondientes.
                moneyPerSample = 0;
                for(var entryKey in sample){
                    //Metemos la fecha en su formato YYYY/MM/DD
                    moneyBorrowed = sample[entryKey].money_borrowed;
                    moneyPerSample+=moneyBorrowed;
                    totalMoneyBorrowed+=moneyBorrowed;
                    if(!tempDict[sample[entryKey].idclient]){
                        tempDict[sample[entryKey].idclient] = {
                            moneyBorrowed : 0,
                            name : sample[entryKey].name
                        };
                    }
                    tempDict[sample[entryKey].idclient].moneyBorrowed+=moneyBorrowed;
                }
                $scope.Deuda.data[0].push(moneyPerSample);
            }
            //Transformamos el objeto de valores a arreglo (para poder usarlo en la grafica)
            for(var entryKey in tempDict){
                $scope.Deuda.doughnutData.push(tempDict[entryKey].moneyBorrowed);
                $scope.Deuda.doughnutLabels.push(tempDict[entryKey].name+" : "+$filter('number')(tempDict[entryKey].moneyBorrowed/totalMoneyBorrowed*100,2) + '% ');
            }
            console.log($scope.Deuda.doughnutData);
            console.log($scope.Deuda.doughnutLabels);
        }).catch(function (error) {
            console.log(error);
        })
    };
    $scope.MargenFinanciero = function (dates = null) {

        DashboardFact.MargenFinanciero(dates).then(function (response) {
            console.log(response);
            if(response.data.error){
                if(dates){
                    SweetAlert.swal("Advertencia","No se encontraron muestras en el rango de fechas seleccionado.","warning");
                    return;
                }
            }
            $scope.Margen = {};
            $scope.Margen.labels = [];
            $scope.Margen.series = ['Margen Financiero'];
            $scope.Margen.colors = ['#8bc34a'];
            $scope.Margen.data = [
                []//margen financiero
            ];
            $scope.Margen.options = {};
            samples = response.data.samples;
            for(var sample in samples){
                $scope.Margen.labels.push(samples[sample].created_at.substring(0,11));
                $scope.Margen.data[0].push(samples[sample].financial_margin);
            }
            console.log($scope.Margen);
        }).catch(function (error) {
            console.log(error);
        })
    }

    $scope.doIt = function(){
        if(!$scope.startDate){
            SweetAlert.swal("Advertencia","Introduzca una fecha inicial.","warning");
            return;
        }
        if(!$scope.endDate){
            SweetAlert.swal("Advertencia","Introduzca una fecha final.","warning");
            return;
        }
        if($scope.startDate > $scope.endDate){
            SweetAlert.swal("Advertencia","Rango de fechas no valido.","warning");
            return;
        }
        startDate = $filter('date')($scope.startDate,"yyyy-MM-dd HH:mm:ss");
        endDate = $filter('date')($scope.endDate,"yyyy-MM-dd HH:mm:ss");
        var dates = {
            startDate :startDate,
            endDate : endDate
        }
        console.log(dates);
        switch($scope.menu){
            case "Morosidad":
                $scope.MorosidadTotal(dates);
                break;
            case "Margen Financiero":
                $scope.MargenFinanciero(dates);
                break;
            case "Ingreso Neto":
                $scope.InteresNeto(dates);
                break;
            case "Cartera Promedio":
                $scope.CarteraPromedio(dates);
                break;
            case "Deuda Promedio":
                $scope.DeudaPromedio(dates);
                break;
        }
    }

    $scope.MorosidadTotal();
    $scope.InteresNeto();
    $scope.MargenFinanciero();
    $scope.CarteraPromedio();
    $scope.DeudaPromedio();



}]);
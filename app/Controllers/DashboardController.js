/**
 * Created by Enrique on 01/06/2017.
 */
antejo.controller('DashboardCtrl', ['$filter', 'SweetAlert', 'DashboardFact', '$scope', function ($filter, SweetAlert, DashboardFact, $scope) {
    var ctrl = this;
    ctrl.menu = 'Morosidad';
    ctrl.MorosidadTotal = function () {
        DashboardFact.MorosidadTotal().then(function (response) {
            ctrl.Morosidad = {};
            ctrl.Morosidad.labels = ['Activo', 'Vencido', 'Fuera de Gracia'];
            ctrl.Morosidad.colors = ['#8bc34a','#ffc107','#e51c23']
            ctrl.Morosidad.data = [];
            ctrl.Morosidad.datacartera = [];
            ctrl.Morosidad.options = {}
                if(response.data.hasOwnProperty('1')
            )
            {
                ctrl.Morosidad.data.push($filter('number')(response.data['1'].porcentaje,2));
                ctrl.Morosidad.datacartera.push(response.data['1'].cartera);
                ctrl.Morosidad.Activo = response.data['1'];
            }
            else
            {
                ctrl.Morosidad.Activo = {
                    porcentaje: 0,
                    total: 0
                }
            }
            if (response.data.hasOwnProperty('2')) {
                ctrl.Morosidad.data.push($filter('number')(response.data['2'].porcentaje,2));
                ctrl.Morosidad.datacartera.push(response.data['2'].cartera);
                ctrl.Morosidad.Vencido = response.data['2'];
            } else {
                ctrl.Morosidad.Vencido = {
                    porcentaje: 0,
                    total: 0
                }
            }
            if (response.data.hasOwnProperty('3')) {
                ctrl.Morosidad.data.push($filter('number')(response.data['3'].porcentaje,2));
                ctrl.Morosidad.datacartera.push(response.data['3'].cartera);
                ctrl.Morosidad.Gracia = response.data['3'];
            } else {
                ctrl.Morosidad.Gracia = {
                    porcentaje: 0,
                    total: 0
                }
            }
            console.log(ctrl.Morosidad);
        }).catch(function (error) {
            console.log(error);
        })
    }
    ctrl.InteresNeto = function () {
        DashboardFact.InteresNeto().then(function (response) {
            console.log(response)
        }).catch(function (error) {
            console.log(error)
        })
    }
    ctrl.MorosidadTotal();
    ctrl.InteresNeto();
}]);
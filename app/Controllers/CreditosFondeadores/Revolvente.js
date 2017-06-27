/**
 * Created by Enrique on 19/05/2017.
 */
antejo.controller('ShowCreditFundsCtrl', ['$filter', 'SweetAlert', 'FoundFact', "Upload",'$routeParams', function( $filter, SweetAlert, FoundFact, Upload,$routeParams) {
    this.idStock = $routeParams.idStock;
    this.idCredito = $routeParams.idcredito;
    var ctrl = this;
    ctrl.DateNow = new Date().toDateString();
    ctrl.DateMin = null;
    ctrl.credit = [];
    ctrl.cliente = '';
    ctrl.lastMove = {}
    ctrl.proyecto = '';
    ctrl.moves = '';
    ctrl.CreditPadre = '';
    ctrl.modalpay={
        pay:'',
        sel_moneda:'',
        currency:'',
        date: '',
        file:[]
    }
    ctrl.selectPago = function(credito){
        ctrl.modalDetallePago = credito
    }
    ctrl.Disposicion = {}
    ctrl.lastCredit = {}
    ctrl.newMove = {}
    ctrl.newMove = {}
    ctrl.AddFile = function ($file) {
        if($file){
            ctrl.modalpay.file.push($file);
        }
    }
    ctrl.deleteFile = function (index) {
        ctrl.modalpay.file.splice(index,1);
        if(ctrl.modalpay.file.length<1){
            $("#dropzone").removeClass("dropped");
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
        }else{
            $("#dropzone div").html('<br><i class="material-icons rotate-180" style="font-size: 50px">system_update_alt</i>');
            $('#dropzone img').remove();
        }
    }

    ctrl.insertCondition = function(){

    }

    ctrl.insertDisposicion = function () {
        console.log(ctrl.Disposicion);
        var auxDate = new Date(Date.parse(angular.copy(ctrl.Disposicion.start_date)));
        ctrl.Disposicion.start_date = angular.copy(auxDate);
        if((auxDate.getDate()<ctrl.CreditPadre.datelimit)){
            if(ctrl.diferencia>=(ctrl.Disposicion.amount)){
                ctrl.Disposicion.extends = ctrl.CreditPadreUnedit.id;
                FoundFact.addFund(ctrl.Disposicion).then(function (response) {
                    if(response.data.error){
                        console.log(response.data)
                        SweetAlert.swal("Error:","No se agrego disposición.","error");
                    }else{
                        SweetAlert.swal({
                                title: "Mensaje:",
                                text: "Dispocición Agregada.",
                                type: "success",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Aceptar.",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            },
                            function(isConfirm){
                                if (isConfirm) {
                                    location.reload(true);
                                } else {
                                    location.reload(true);
                                }
                            });
                    }
                })
            }else{
                SweetAlert.swal("Mensaje","No puedes disponer mas del total del credito restante.","error");
            }
        }
        else{
            SweetAlert.swal("Mensaje","Fecha fuera de plazo.","error");
        }
    }
    ctrl.CalcularPago = function(){
        console.log(ctrl.modalpay)
        var newMove = angular.copy(ctrl.lastMove);
        var dateFinal = ctrl.addTerm()
        var pago = angular.copy(parseFloat(ctrl.modalpay.pay))
        var lastDate = new Date(Date.parse(angular.copy(ctrl.lastMove.period)))
        var SelectDate = new Date(ctrl.modalpay.date)
        var diffDays = Math.floor((SelectDate.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha seleccionada y la del ultimo movimiento
        diffDays = diffDays<0?0:diffDays;
        var diffDays2 = Math.floor((dateFinal.getTime()-lastDate.getTime())/1000/60/60/24) //Diferencia de dias con la fecha final y la ultima
        diffDays2 = diffDays2<0?0:diffDays2;
        var diffDays3 = Math.floor((SelectDate.getTime()-new Date(ctrl.addTerm().setDate(ctrl.addTerm().getDate()+ctrl.CreditPadre.grace_days)).getTime())/1000/60/60/24) //Diferecia si se pasa el
        diffDays3 = diffDays3<0?0:diffDays3;
        newMove.period = angular.copy(SelectDate)
        newMove.pay = angular.copy(pago)
        if(dateFinal.getTime()>=SelectDate.getTime()){
            var interes = parseFloat(angular.copy(ctrl.lastMove.interest_balance))+
                (angular.copy(parseFloat(ctrl.lastMove.capital_balance))*((parseFloat(ctrl.CreditPadre.interest)/100/365)*diffDays));
            var iva = interes*(parseFloat(ctrl.CreditPadre.iva)/100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            ctrl.liquidarmodal = (angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat(ctrl.lastMove.capital_balance)))
        }
        if((new Date(dateFinal.setDate((ctrl.addTerm().getDate()+ctrl.CreditPadre.grace_days))).getTime()>=SelectDate.getTime())&&(SelectDate.getTime()>=ctrl.addTerm().getTime())){
            var interes = parseFloat(angular.copy(ctrl.lastMove.interest_balance))+
                (angular.copy(parseFloat(ctrl.lastMove.capital_balance))*((parseFloat(ctrl.CreditPadre.interest)/100/365)*diffDays2));
            var iva = interes*(parseFloat(ctrl.CreditPadre.iva)/100)
            newMove.interest = angular.copy(interes)
            newMove.iva = angular.copy(iva)
            ctrl.liquidarmodal = (angular.copy(interes)+angular.copy(iva)+angular.copy(parseFloat(ctrl.lastMove.capital_balance)))
        }
        if(new Date(ctrl.addTerm().setDate(ctrl.addTerm().getDate()+ctrl.CreditPadre.grace_days)).getTime()<SelectDate.getTime()){
            if(diffDays==0){
                var interes = parseFloat(angular.copy(ctrl.lastMove.interest_balance));
                var iva = interes*(parseFloat(ctrl.CreditPadre.iva)/100)
                var interesmoratorio = angular.copy(parseFloat(ctrl.lastMove.interest_arrear_balance));
                var ivaMoratorio = interesmoratorio*(ctrl.CreditPadre.iva/100);
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                newMove.interest_arrear = angular.copy(interesmoratorio)
                newMove.iva_arrear = angular.copy(ivaMoratorio)
                ctrl.liquidarmodal = (angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat(ctrl.lastMove.capital_balance)))
            }else{
                var interes = parseFloat(angular.copy(ctrl.lastMove.interest_balance))+
                    (angular.copy(parseFloat(ctrl.lastMove.capital_balance))*((parseFloat(ctrl.CreditPadre.interest)/100/365)*diffDays2));
                var iva = interes*(parseFloat(ctrl.CreditPadre.iva)/100)
                var interesmoratorio = angular.copy(parseFloat(ctrl.lastMove.interest_arrear_balance))+((angular.copy(parseFloat(ctrl.lastMove.capital_balance))+angular.copy(parseFloat(interes))+angular.copy(parseFloat(ctrl.lastMove.interest_arrear_balance)))*(angular.copy((parseFloat(ctrl.CreditPadre.interest_arrear))/100/365)*diffDays3));
                var ivaMoratorio = interesmoratorio*(ctrl.CreditPadre.iva/100)
                newMove.interest = angular.copy(interes)
                newMove.iva = angular.copy(iva)
                newMove.interest_arrear = angular.copy(interesmoratorio)
                newMove.iva_arrear = angular.copy(ivaMoratorio)
                ctrl.liquidarmodal = (angular.copy(interes)+angular.copy(interesmoratorio)+angular.copy(iva)+angular.copy(ivaMoratorio)+angular.copy(parseFloat(ctrl.lastMove.capital_balance)))
            }
        }
        if(ivaMoratorio!=null){
            if(pago>=ivaMoratorio){
                pago-=ivaMoratorio
                newMove.pay_iva_arrear = angular.copy(ivaMoratorio)
                newMove.interest_arrear_iva_balance = 0
            } else{
                pagoIvaMoratorio=pago
                newMove.pay_iva_arrear = angular.copy(pago)
                newMove.interest_arrear_iva_balance -= angular.copy(pago)
                pago=0
            }
        }else {
            newMove.pay_iva_arrear = 0
            newMove.interest_arrear_iva_balance = 0
        }if(interesmoratorio != null){
            if(pago>=interesmoratorio){
                pago-=interesmoratorio
                newMove.pay_interest_arrear = angular.copy(interesmoratorio)
                newMove.interest_arrear_balance = 0
            }  else{
                pagoInteres=pago
                newMove.pay_interest_arrear = angular.copy(pago)
                newMove.interest_arrear_balance -= angular.copy(pago)
                pago=0
            }
        }else{
            newMove.pay_interest_arrear = 0
            newMove.interest_arrear_balance -= 0
        }
        if(pago>=iva){
            pago-=iva
            newMove.pay_iva = angular.copy(iva)
            newMove.iva_balance = 0
            pagoIva=iva
        } else{
            pagoIva=pago
            newMove.pay_iva = angular.copy(pago)
            newMove.iva_balance -= angular.copy(pago)
            pago=0
        }
        if(pago>=interes){
            pago-=interes
            newMove.pay_interest = angular.copy(interes)
            newMove.interest_balance = 0
            pagoInteres = interes
        }  else{
            pagoInteres=pago
            newMove.pay_interest = angular.copy(pago)
            newMove.interest_balance -= angular.copy(pago)
            pago=0
        }
        if(pago=>ctrl.lastMove.capital_balance && pago>0){
            pagoCapital=pago
            newMove.capital_balance -= pago
            newMove.pay_capital = pagoCapital
        }else{
            if(pago==0){
                pagoCapital=0
            }else {
                pagoCapital=ctrl.lastMove.capital_balance
            }
        }
        ctrl.newMove = newMove;
        ctrl.calcInterest = $filter('currency')(angular.copy(pagoInteres))
        ctrl.calcIva = $filter('currency')(angular.copy(pagoIva))
        ctrl.calcMonto = $filter('currency')(angular.copy(pagoCapital))
    }
    ctrl.savePago = function (){
        FoundFact.addCtrl(ctrl.newMove).then(function (response) {
            callback = response.data;
            if(callback.error==false){
                SweetAlert.swal({
                        title: "Guardado",
                        text: "PAGO CREADO",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#4bdd86",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            location.reload();
                        }
                    });
            }else if(callback.errors.length>0){
                var text = "";
                for(let i = 0;i<callback.errors.length;i++){
                    text+= '\n' + callback.errors[i];
                }
                SweetAlert.swal({
                        title: callback.message,
                        text: text,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#dd654f",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            //location.reload();
                        }
                    });
            }else{
                SweetAlert.swal({
                        title: "Error",
                        text: callback.message,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#dd654f",
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            //location.reload();
                        }
                    });
            }
        }).catch(function (error) {
            console.log(error);
            SweetAlert.swal("Error:","No se puede establecer conexión con el servidor.","error")
        })
    }
    ctrl.addTerm= function(){
        var aux = new Date( angular.copy(ctrl.CreditPadre.start_date));
        aux.setMonth(aux.getMonth()+angular.copy(ctrl.CreditPadre.term));
        return aux;
    }
    ctrl.SelectCondition = function (credito) {
        ctrl.ModalDetalleCondicion = credito
    }
    ctrl.getData = function () {
        FoundFact.DetailFundsByStock(ctrl.idStock,ctrl.idCredito).then(function (response) {
            ctrl.CreditPadre = angular.copy(response.data.fund[0]);
            ctrl.CreditPadreUnedit = angular.copy(ctrl.CreditPadre);
            delete ctrl.CreditPadre.id;
            ctrl.diferencia = ctrl.CreditPadre!=0? angular.copy(ctrl.CreditPadre.amount - ctrl.CreditPadre.lastmove):angular.copy(ctrl.CreditPadre.amount);
            ctrl.credit = angular.copy(response.data.fund);
            ctrl.selectedCondicion = angular.copy(response.data.cntrl);
            ctrl.name = response.data.stock.type == "Moral"? response.data.stock.businessname:response.data.stock.name+" "+response.data.stock.lastname;
            ctrl.lastMove = response.data.cntrl.pop();
            ctrl.DateMin = response.data.cntrl.length>0?angular.copy(new Date(Date.parse(ctrl.lastMove.period)).getTime()):new Date(Date.parse(angular.copy(ctrl.CreditPadre.start_date))).getTime()
            ctrl.Disposicion = angular.copy(ctrl.CreditPadre);
            ctrl.Disposicion.amount = 0;
            ctrl.Disposicion.start_date = new Date();
            ctrl.Disposicion.todo = "";
        }).catch(function (error) {
            console.log(error)
        })
    }
    // Inicializacion
    ctrl.getData();
}]);
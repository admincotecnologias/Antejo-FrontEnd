antejo.directive('format', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            switch (attrs.format){
                case "number": {
                    ctrl.$formatters.unshift(function(a) {
                        return $filter(attrs.format)(ctrl.$modelValue)
                    });
                    ctrl.$parsers.unshift(function(viewValue) {
                        var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                        elem.val($filter(attrs.format)(plainNumber));
                        return plainNumber;
                    });
                    break;
                }
                case "float": {
                    scope.$watch(attrs.ngModel,function (newVal,oldVal) {
                        var Regex = /^\d*(\.)?(\d{1,})?$/;
                        if(!Regex.test(newVal)){
                            scope[attrs.ngModel] = (oldVal==null||oldVal==undefined)?'':oldVal.toString().trim();
                            elem.val(scope[attrs.ngModel].toString().trim());
                        }else {
                            scope[attrs.ngModel] = (newVal==null||newVal==undefined)?'':newVal.toString().trim();
                            elem.val(scope[attrs.ngModel].toString().trim());
                        }
                        return scope[attrs.ngModel].toString().trim()
                    },true);
                    break;
                }
                case "RFC": {
                    scope.$watch(attrs.ngModel,function (newVal,oldVal) {
                        newVal = newVal.toString().toUpperCase().trim();
                        elem.val(newVal);
                        var Regex = /^[A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3}$/;
                        if (!Regex.test(newVal)) {
                            if(newVal != ""){
                                elem.parent('div').addClass('has-error');
                            }else{
                                elem.parent('div').removeClass('has-error');
                            }
                            ctrl.$setValidity("RFC Incorrecto",false)
                        } else {
                            elem.parent('div').removeClass('has-error');
                            ctrl.$setValidity("RFC Incorrecto",true)
                        }
                        return newVal;
                    });
                    break;
                }
                case "CURP": {
                    scope.$watch(attrs.ngModel,function (newVal,oldVal) {
                        newVal = newVal.toString().toUpperCase().trim();
                        elem.val(newVal);
                        var Regex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
                        if (!Regex.test(newVal)) {
                            if(newVal != ""){
                                elem.parent('div').addClass('has-error');
                            }else{
                                elem.parent('div').removeClass('has-error');
                            }
                            ctrl.$setValidity("CURP Incorrecto",false)
                        } else {
                            elem.parent('div').removeClass('has-error');
                            ctrl.$setValidity("CURP Incorrecto",true)
                        }
                        return newVal;
                    });
                    break;
                }
                case "phone": {
                    scope.$watch(attrs.ngModel,function (newVal,oldVal) {
                        newVal = newVal!=null?newVal.toString().replace(/[^\d]/, ''):'';
                        newVal = newVal.toString().toUpperCase().trim();
                        elem.val(newVal);
                        var Regex = /^[0-9]{10}$/;
                        if (!Regex.test(newVal)) {
                            if(newVal != ""){
                                elem.parent('div').addClass('has-error');
                            }else{
                                elem.parent('div').removeClass('has-error');
                            }
                            ctrl.$setValidity("Tel. Incorrecto",false)
                        } else {
                            elem.parent('div').removeClass('has-error');
                            ctrl.$setValidity("Tel. Incorrecto",true)
                        }
                        return newVal;
                    });
                    break;
                }
                case "email": {
                    scope.$watch(attrs.ngModel,function (newVal,oldVal) {
                        newVal = newVal!=null? newVal.toString().toLowerCase().trim():'';
                        elem.val(newVal);
                        var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!Regex.test(newVal)) {
                            if(newVal != ""){
                                elem.parent('div').addClass('has-error');
                            }else{
                                elem.parent('div').removeClass('has-error');
                            }
                            ctrl.$setValidity("Email Incorrecto",false)
                        } else {
                            elem.parent('div').removeClass('has-error');
                            ctrl.$setValidity("Email Incorrecto",true)
                        }
                        return newVal;
                    })
                    break;
                }
            }
        }
    };
}]);
/**
 * Created by practicante on 8/08/17.
 */


//Script needed to close sweet alerts on page back
// source : https://github.com/t4t5/sweetalert/issues/231#issuecomment-67749036

$(document).on("pagebeforechange", function(e, ob) { //to prevent back navigation
    if(ob.options.direction=="back" && swal.isOpen()){
        swal.cancelAlert(); //close the swal
        e.preventDefault(); //prevent back nav
        history.go(1); //avoid hash change
        // return false;
    }
})

// Closes/Cancel any open sweet alerts

window.swal.cancelAlert = function() {
    closeModal();
};

//Check whether the SWAL is open or not.

window.swal.isOpen = function() {
    var modal= getModal();
    if(hasClass(modal,"showSweetAlert")){
        return true;
    }else if(hasClass(modal,"hideSweetAlert")){
        return false;
    }else{
        return false;
    }
};
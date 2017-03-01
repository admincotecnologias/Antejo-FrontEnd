(function() {
    "use strict";

    // custom scrollbar

    $("body").niceScroll({ styler: "fb", cursorcolor: "#F2B33F", cursorwidth: '6', cursorborderradius: '10px', background: '#424f63', spacebarenabled: false, cursorborder: '0', zindex: '1000' });
    $(".scrollbar1-collapsed").niceScroll({ styler: "fb", cursorcolor: "#F2B33F", cursorwidth: '6', cursorborderradius: '10px', background: '#424f63', spacebarenabled: false, cursorborder: '0', zindex: '1000' });
    $(".table-scroll").niceScroll({ styler: "fb", cursorcolor: "#1c1f38", cursorwidth: '6', cursorborderradius: '0', autohidemode: 'false', background: '#F1F1F1', spacebarenabled: false, cursorborder: '0' });

    $("#activeMenu").click(function() {
        if ($("#subMenu").is(":visible")) {
            $("#subMenu").fadeOut("slow");
        } else {
            $("#subMenu").fadeIn("slow");
        }
    });
    $(".navbar-brand").click(function() {
        $("#activeMenu").click();
    });
    $(".nav-tabs a").click(function() {
        var tab = $(this).attr('data-target');
        console.log(tab);
        $(tab).tab('show');

    });
    $(".navee").mousedown(function(event) {
        switch (event.which) {
            case 1:
                event.preventDefault();
                break;
            default:
                alert('You have a strange Mouse!');
        }
    });
    //$(".dropdown-toggle").mouseleave(function() {
    //   this.click();
    //});

    $(".scrollbar1").getNiceScroll();
    if ($('body').hasClass('scrollbar1-collapsed')) {
        $(".scrollbar1").getNiceScroll().hide();
    }

})(jQuery);
function initializeJS() {

    //tool tips
    jQuery('.tooltips').tooltip();

    //popovers
    jQuery('.popovers').popover();

    //custom scrollbar
    //for html
    jQuery("html").niceScroll({ styler: "fb", cursorcolor: "#007AFF", cursorwidth: '6', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: '', zindex: '1000' });
    //for sidebar
    jQuery("#sidebar").niceScroll({ styler: "fb", cursorcolor: "#007AFF", cursorwidth: '3', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: '' });
    // for scroll panel
    jQuery(".scroll-panel").niceScroll({ styler: "fb", cursorcolor: "#007AFF", cursorwidth: '3', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: '' });

    //sidebar dropdown menu
    var lastBox = null;
    jQuery('#sidebar .sub-menu > a').click(function() {
        jQuery('#sidebar .sub-menu > ul:visible').slideUp(200);
        var arrow = $(this).children("span.menu-arrow")
        if (arrow.length == 0) {
            jQuery('#sidebar .sub-menu > a').children("span.menu-arrow").removeClass("arrow_carrot-down").addClass("arrow_carrot-right")
        }
        if (arrow.hasClass("arrow_carrot-right")) {
            jQuery('#sidebar .sub-menu > a').children("span.menu-arrow").removeClass("arrow_carrot-down").addClass("arrow_carrot-right")
            arrow.removeClass("arrow_carrot-right").addClass("arrow_carrot-down")
            $(this).next().slideDown(200)
        } else {
            console.log(arrow);
            //jQuery('#sidebar .sub-menu > a').children("span.menu-arrow").removeClass("arrow_carrot-down").addClass("arrow_carrot-right")
            arrow.addClass("arrow_carrot-right").removeClass("arrow_carrot-down")
        }
        /*
        var last = jQuery('.sub-menu.open', jQuery('#sidebar'));
        jQuery('.menu-arrow').removeClass('arrow_carrot-right');
        jQuery('.sub', last).slideUp(200);
        var sub = jQuery(this).next();
        if (sub.is(":visible")) {
            console.log(sub);
            jQuery('.menu-arrow').addClass('arrow_carrot-right');
            sub.slideUp(200);
        } else {
            console.log(sub);
            jQuery('.menu-arrow').addClass('arrow_carrot-down');
            sub.slideDown(200);
            //lastBox = sub;
        }

        if(lastBox != null && lastBox!=sub){
            lastBox.slideUp(200);
        }
        lastBox = sub;*/
        var o = (jQuery(this).offset());
        diff = 200 - o.top;
        if (diff > 0)
            jQuery("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
        else
            jQuery("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
    });

    // sidebar menu toggle
    jQuery(function() {
        function responsiveView() {
            var wSize = jQuery(window).width();
            if (wSize <= 768) {
                jQuery('#container').addClass('sidebar-close');
                jQuery('#sidebar > ul').hide();
            }

            if (wSize > 768) {
                jQuery('#container').removeClass('sidebar-close');
                jQuery('#sidebar > ul').show();
            }
        }
        jQuery(window).on('load', responsiveView);
        jQuery(window).on('resize', responsiveView);
    });

    jQuery('.toggle-nav').click(function() {
        if (jQuery('#sidebar > ul').is(":visible") === true) {
            jQuery('#main-content').css({
                'margin-left': '0px'
            });
            jQuery('#sidebar').css({
                'margin-left': '-180px'
            });
            jQuery('#sidebar > ul').hide();
            jQuery("#container").addClass("sidebar-closed");
        } else {
            jQuery('#main-content').css({
                'margin-left': '180px'
            });
            jQuery('#sidebar > ul').show();
            jQuery('#sidebar').css({
                'margin-left': '0'
            });
            jQuery("#container").removeClass("sidebar-closed");
        }
    });

    //bar chart
    if (jQuery(".custom-custom-bar-chart")) {
        jQuery(".bar").each(function() {
            var i = jQuery(this).find(".value").html();
            jQuery(this).find(".value").html("");
            jQuery(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }

}

jQuery(document).ready(function() {
    initializeJS();
});
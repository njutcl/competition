
    function nav() {
        $(".show").animate({opacity: '0.92'});
        $(".article-active").animate({opacity: '0.92'});
        var $current = $("#menu-t>.active"),
            $target = $("#menu-t li"),
            $slider = $("#animate1");
        $current.unbind();
        $slider.unbind();
        $target.unbind();
        $target.mouseenter(function () {
            var posL = $(this).position().left;
            $slider.animate({'left': posL}, "fast")
        });
        $("#menu-t").mouseleave(function (cur) {
            cur = $current.position().left;
            $slider.stop(true, true).animate({
                "left": cur
            }, "fast")
        });


        var $current1 = $("#menu1>.active"),
            $target1 = $("#menu1 li"),
            $slider1 = $("#animate2");
        $current1.unbind();
        $slider1.unbind();
        $target1.unbind();
        $target1.mouseenter(function () {
            var posL = $(this).position().left;
            $slider1.animate({'left': posL}, "fast")
        });
        $("#menu1").mouseleave(function (cur) {
            cur = $current1.position().left;
            $slider1.stop(true, true).animate({
                "left": cur
            }, "fast")
        });

        var $current2 = $("#menu2>.active"),
            $target2 = $("#menu2 li"),
            $slider2 = $("#animate3");
        $current2.unbind();
        $slider2.unbind();
        $target2.unbind();
        $target2.mouseenter(function () {
            var posL = $(this).position().left;
            $slider2.animate({'left': posL}, "fast")
        });
        $("#menu2").mouseleave(function (cur) {
            cur = $current2.position().left;
            $slider2.stop(true, true).animate({
                "left": cur
            }, "fast")
        });


        var $current3 = $("#menu3>.active"),
            $target3 = $("#menu3 li"),
            $slider3 = $("#animate4");
        $current3.unbind();
        $slider3.unbind();
        $target3.unbind();
        $target3.mouseenter(function () {
            var posL = $(this).position().left;
            $slider3.animate({'left': posL}, "fast")
        });
        $("#menu3").mouseleave(function (cur) {
            cur = $current3.position().left;
            $slider3.stop(true, true).animate({
                "left": cur
            }, "fast")
        });


        var $current4 = $("#menu4>.active"),
            $target4 = $("#menu4 li"),
            $slider4 = $("#animate5");
        $current4.unbind();
        $slider4.unbind();
        $target4.unbind();
        $target4.mouseenter(function () {
            var posL = $(this).position().left;
            $slider4.animate({'left': posL}, "fast")
        });
        $("#menu4").mouseleave(function (cur) {
            cur = $current4.position().left;
            $slider4.stop(true, true).animate({
                "left": cur
            }, "fast")
        });
        var $current5 = $("#menu5>.active"),
            $target5 = $("#menu5 li"),
            $slider5 = $("#animate6");
        $current5.unbind();
        $slider5.unbind();
        $target5.unbind();
        $target5.mouseenter(function () {
            var posL = $(this).position().left;
            $slider5.animate({'left': posL}, "fast")
        });
        $("#menu5").mouseleave(function (cur) {
            cur = $current5.position().left;
            $slider5.stop(true, true).animate({
                "left": cur
            }, "fast")
        });
    }


nav();
function menu(obj) {
    var tmp=obj;
    $(tmp).addClass("active")
        .siblings().removeClass("active");
    nav();
    $("#menu-t" + tmp.id).removeClass("hide").addClass("show").animate({opacity: '0.92'})
        .siblings().animate({opacity: '0'}).addClass("hide").removeClass("show");
    $("#content" + tmp.id).fadeIn(200)
        .siblings().fadeOut(200);

}
function submenu(obj){
    var tmp=obj;
    $(tmp).addClass("active")
        .siblings().removeClass("active");
    nav();
    $("#11" + tmp.id).removeClass("article-hide").addClass("article-active").animate({opacity: '0.92'})
        .siblings().animate({opacity: '0'}).addClass("article-hide").removeClass("article-active");
}


function toProjectFromNav(project_id){
    _page_flag="project";
    clearInterval(_scroll_timer);
    card_project=$('<div class="card-project"></div>');
    box_body=$(".box-body");
    box_content=$(".box-content");
    $(box_body).children().remove();
    $(box_content).children().remove();
    $(box_body).removeClass("box-body-info box-body-news box-body-tools");
    $(box_body).addClass("box-body-project");
    $(box_body).children().remove();
    $(box_body).append(card_project);
    setTimeout(function(){
        $(card_project).addClass("card-project-full");
    },200);

    /* full the box-content */
    initProject(project_id);

}
_scroll_up=0;
_scroll_down_cnt=0;
_scroll_up_cnt=0;
function infoSearchClick(){
    _page_flag="info";
    clearInterval(_scroll_timer);
    box_body=$(".box-body");
    card_center=$(".card-center")[0];
    card_beside=$(".card-beside");
    arrow=$(".box-arrow");
    indicate_bar=$(".indicate-bar");
    nav_dot=$("#nav-info");

    caption=$("#card-caption-info");
    box_search=$("#box-search-info");
    btn_search=$("#search-btn-info");
    /* clear elements */
    clearEleByHide(card_beside);
    clearEle(arrow);
    clearEle(indicate_bar);
    clearEle(caption);
    $(card_center).removeAttr("onmouseover");
    $(card_center).removeAttr("onmouseout");
    // $(card_center).addClass("card-info-transition");

    /* rebuild page for info */
    $("body").css("overflow-y","scroll");   
    $(box_body).addClass("box-body-info");
    $(card_center).addClass("card-info-full");
    $(box_search).addClass("box-search-info-full");
    $(btn_search).removeAttr("onClick");
    $(btn_search).attr("onClick","infoSearchClickFull()");
    $(nav_dot).click();

    /* do initial */
    box_content=$(".box-content");
    box_toTop=createToTop();
    $(box_content).append(box_toTop);
    searchKeyword = $('input[name="corpname"]').val();
    setTimeout(function(){
        $(box_search).remove();
    box_search=createInfoSearch();
    $(box_content).append(box_search);
    $(box_search).css("transition-duration","0.3s");
    if(searchKeyword==""){;}
    else{
        $('input[name="corpname"]').val(searchKeyword);
       
    }
    },1000)
    setTimeout(() => {
        if(searchKeyword!=""){
            infoSearchClickFull(searchKeyword);
        }
    }, 500);
    // $(box_search).css("transition","tranform 1s");

}



function toInfoFromNav(){
    _page_flag="info";
    $("body").css("overflow-y","scroll");
    clearInterval(_scroll_timer);
    card_info=$('<div class="card-info"></div>');
    box_body=$(".box-body");
    box_content=$(".box-content");
    $(box_content).children().remove();
    $(box_body).removeClass("box-body-news box-body-project box-body-tools");
    $(box_body).addClass("box-body-info");
    $(box_body).children().remove();
    $(box_body).append(card_info);
    box_search=createInfoSearch()
    $(box_content).append(box_search);
    $(box_search).css("transition-duration","0.3s");

    box_toTop=createToTop();
    $(box_content).append(box_toTop);
    
    setTimeout(function(){
        $(card_info).addClass("card-info-full");
        $(box_search).addClass("box-search-info-full");
        addToTopBtn(box_content);
    },200);
    
    // setTimeout(function(){
    //     doInitAjax();
    // },1000);
}

function createInfoSearch(){
    box_search=$('<div class="card-content box-search box-search-info box-search-info-full" id="box-search-info"></div>');
    e_input=$('<input class="search-input" id="search-input-info" name="corpname" placeholder="搜索公司名">');
    e_btn=$('<div class="search-btn" id="search-btn-info" onclick="infoSearchClickFull()"></div>');
    e_icon=$('<span class="glyphicon glyphicon-search"></span>');

    $(e_btn).append(e_icon);
    box_search.append(e_input);
    box_search.append(e_btn);

    return box_search;
}



/* do search */
function infoSearchClickFull(s_keyword){
    var searchKeyword = null;
    if(s_keyword){
        searchKeyword=s_keyword;
    }
    else{
        searchKeyword=$('input[name="corpname"]').val();
    }
    var searchURL = "http://118.24.43.47:8089/search?keyword="+searchKeyword;
    // var searchData = {keyword: searchKeyword};
    // console.log(searchKeyword);
    // console.log(searchURL);
    //加载搜索结果
    box_content=$('.box-content');
    cards=$(".card-company");
    clearEle(cards);
    $.ajax({
        type : 'get',
        url : searchURL,
        dataType : 'json',
        success : function(data) {
            cnt=0;
            $.each(data, function (index, item) { 
                 cnt+=1;
                 if(item.irgOpts){
                     item.name=item.name+"【该公司被列入经营异常名录】";
                 }
                 if(cnt<10){
                    setTimeout(function(){
                        card=createCompanyBlock(item.name,item.type,item.reg_auth,item.id,item.state,item.reg_date);
                        $(box_content).append(card);
                        $(card).animate({opacity:1},500);
                    },250*cnt);
                 }
                 else{
                    setTimeout(function(){
                        card=createCompanyBlock(item.name,item.type,item.reg_auth,item.id,item.state,item.reg_date);
                        $(box_content).append(card);
                        $(card).animate({opacity:1},500);
                    },250*10);
                 }

            });
        }
    });
}

function loadMore(){
    box_content=$(".box-content");
    cards=$(".card-company");
    clearEle(cards);
    b_svg=$("<svg>");
    $(box_content).append(b_svg);
    load_relation_graph()
}

function createCompanyBlock(name,type,reg_auth,id,state,reg_date,){
    b_card=$('<div class="card-company" style="opacity:1;" onclick="loadMore()"></div>');
    /* onclick 事件待添加 */
    h_title=$('<h5 class="card-title company_name">'+name+'</h5>');
    p_type=$('<p class="tpye">'+type+'</p>');
    p_reg_auth=$('<p class="reg_auth">'+reg_auth+'</p>');
    p_id=$('<p class="id">'+id+'</p>');
    p_state=$('<p class="state">'+state+'</p>');
    p_reg_date=$('<p class="reg_date">'+reg_date+'</p>');

    $(b_card).append(h_title);
    $(b_card).append(p_type);
    $(b_card).append(p_reg_auth);
    $(b_card).append(p_id);
    $(b_card).append(p_state);
    $(b_card).append(p_reg_date);

    return b_card;
}

/* 监控scroll以显示 top btn  控制搜索框的显示*/
$(window).scroll(function(){
    if(_page_flag=="info"){
        scroll_t=$(window).scrollTop();
        _pre_scroll=scroll_t;
        if(scroll_t<_scroll_up){
            _scroll_up_cnt=_scroll_up_cnt+(_scroll_up-scroll_t);
            
            _scroll_down_cnt=0;
        }
        if(scroll_t>_scroll_up){
            _scroll_down_cnt=_scroll_down_cnt+(scroll_t)-_scroll_up;
            _scroll_up_cnt=0;
        }
        if(_scroll_down_cnt>300){
            $(".box-search-info-full").addClass("clear-box");
        }
        if(_scroll_up_cnt>300||scroll_t==0){
            $(".box-search-info-full").removeClass("clear-box");
        }
        _scroll_up=scroll_t;
        win_h=$(window).height();
        box_content=$("#box-content");
        // box_h=$(box_content).height()+0.25*_height;
        doc_h=$(document).height();
        if($(box_content).scrollTop()<(scroll_t-300)){
            controlBtnTop("show");
            
        }
        else{
            controlBtnTop("hide");
        }
        if(_load_flag){
            if($(".box-article")){
            $(".box-article").remove()
            }
            doc_h=$(document).height();
        }
        
    }
})












function load_relation_graph(graphId, num){
    //         document.getElementById("curlayer").innerHTML = num; //������ʾ����������
        d3.select("body").select("svg") //���SVG�е�����
            .selectAll('*')
            .remove();
        var max_layer = num;
        var img_w = 24;
        var img_h = 32;
        var svg = d3.select("body").select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
    
        var color = d3.scaleOrdinal(d3.schemeCategory20);
    
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(300).strength(0.3))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 4));
    
    //		d3.json("json/relation3.json", function(error, graph) {
        d3.json("http://118.24.43.47:8089/inverst-map?graphId="+graphId, function(error, graph) {
            if (error) throw error;
    
            var jsonstr="[]";
            var nodes = eval('('+jsonstr+')');  //��ʾ�ĵ�
            var curlinks = eval('('+jsonstr+')');  //��ʾ�ı�
    
            var initnodes = graph.nodes;
            initnodes.forEach(function(node){
                if(node.layer <= max_layer){
                    nodes.push(node);
                    console.log(node);
                }
            });
    
            var nodeById = d3.map(initnodes, function(d) { return d.name; }),
                links = graph.edges,
                bilinks = [];
    
    
            var linkGroup = {};
            //�������߽���ͳ�ƺͷ��飬�����������ߵķ���ֻҪ����ͬ����ʵ�壬����Ϊ��ͬһ��
            var linkmap = {};
    
    
            links.forEach(function(link) {
                if(link.layer < max_layer){
                    var s = link.source = nodeById.get(link.source),
                        t = link.target = nodeById.get(link.target),
                        r = link.relation,
                        linknum = 0,
                        text_pos = 0;
                    var tmplink = [s, t, r, linknum, text_pos, link.subscription, link.actual_subscription, link.method, link.subscp_date, link.actual_subscp_date];
                    var key = link.source.name < link.target.name ? link.source.name+':'+link.target.name: link.target.name+':'+link.source.name;
                    bilinks.push(tmplink);
                    if(!linkmap.hasOwnProperty(key)){
                        linkmap[key] = 0;
                        linkGroup[key]=[];
                    }
                    linkmap[key]++;
                    linkGroup[key].push(tmplink);
                    curlinks.push(link);
                }
            });
    
            for(var i=0; i<links.length; i++){
                if(links[i].layer >= max_layer) continue;
                console.log(links[i].source, links[i].layer);
                var key = links[i].source.name < links[i].target.name ? links[i].source.name+':'+links[i].target.name: links[i].target.name+':'+links[i].source.name;
                links[i].size = linkmap[key];
                //ͬһ��Ĺ�ϵ���б��
                var group = linkGroup[key];
                //���ڵ������
                setLinkNumber(group);
            }
    
            function setLinkNumber(group){
                if(group.length==0) return;
                if(group.length==1){
                    group[0][3] = 0;
                    group[0][4] = 1 / 2;
                    return;
                }
                var maxLinkNumber = group.length%2==0?group.length/2:(group.length-1)/2;
    
                var startLinkNum = -maxLinkNumber;
                for(var i = 0;i<group.length;i++){
                    group[i][3] = startLinkNum++;
                    group[i][4] = (i + 1) / (group.length + 1);
                }
            }
    
    
            var R = 30;
            var link = svg.selectAll(".link")
                .data(bilinks)
                .enter().append("path")
                .attr("class", "link")
                .attr("marker-end", "url(#arrow)" );//���ݼ�ͷ��ǵ�id�ű�Ǽ�ͷ
    
            var edges_text = svg.selectAll(".linetext")
                .data(bilinks)
                .attr("class","linetext")
                .style("stroke","#1874CD")
                .enter().append("text")
                .text(function(d){
                    return d[2]
                })
                .style("font-size","12px");
    
            var node = svg.selectAll("image")
                .data(nodes.filter(function(d) { return d.name; }))
                .enter()
                .append("image")
                .attr("xlink:href",function(d){
                    return d.image;
                })
                .attr("width",img_w)
                .attr("height",img_h)
                .attr("class", "node")
                .attr("r", 5)
                //      .attr("fill", function(d) { return color(d.group); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
    
            node.append("title")
                .text(function(d) { return "��ҵͳһ������ô��룺" + d.id; });
    
            edges_text.append("title")
                .text(function(d) { return "�Ͻɽ�" + d[5] + "\nʵ���Ͻɽ�" + d[6] + "\n�Ͻɷ�ʽ��" + d[7] + "\n�Ͻ����ڣ�" + d[8] + "\nʵ���Ͻ����ڣ�" + d[9]});
    
            var nodes_text = svg.selectAll(".nodetext")
                .data(nodes)
                .enter()
                .append("text")
                .attr("class","nodetext")
                .style("font-size","13px")
                .text(function(d){
                    return d.name;
                });
    
            simulation
                .nodes(nodes)
                .on("tick", ticked);
    
            simulation.force("link")
                .links(curlinks);
    
            function ticked() {
                link.attr("d", positionLink);
                node.attr("transform", positionNode);
                edges_text.attr("x",binode_x);
                edges_text.attr("y",binode_y);
                nodes_text.attr("x",node_x);
                nodes_text.attr("y",node_y);
            }
        });
    
        function positionLink(d) {
            var sx = d[0].x + 10 + d[3] * 8;
            var sy = d[0].y + 15 + d[3] * 8;
            var tx = d[1].x + 10 + d[3] * 8;
            var ty = d[1].y + 15 + d[3] * 8;
            return "M" + sx + "," + sy
                + " " + tx + "," + ty;
        }
    
        function binode_x(d) {
            var sx = d[0].x + 10 + d[3] * 8;
            var tx = d[1].x + 10 + d[3] * 8;
            return sx + (tx - sx) * d[4];
        }
    
        function binode_y(d) {
            var sy = d[0].y + 15 + d[3] * 8;
            var ty = d[1].y + 15 + d[3] * 8;
            return sy + (ty - sy) * d[4];
        }
    
        function node_x(d) {
            return d.x + 5;
        }
    
        function node_y(d) {
            return d.y + 39;
        }
    
        function positionNode(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x, d.fy = d.y;
        }
    
        function dragged(d) {
            d.fx = d3.event.x, d.fy = d3.event.y;
        }
    
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null, d.fy = null;
        }
    }
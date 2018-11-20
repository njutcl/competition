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
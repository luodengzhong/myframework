var raphaelPager= null;//画布对象
//开始绘制坐标
var initX=190,initY=120;
//流程图节点默认显示宽度，高度，弧度
var nodeWidth=150,nodeHeight=40,nodeR=10,ellipseR=25,nodeInterval=40;
//字体默认显示样式
var labelFont={font: "12px Arial,sans-serif", "text-anchor": "middle"};
//数据对象由JSP提供
var nodesList=nodesList||[];
/*测试数据*/
/*nodesList=[
   	[{nodeId:'1',title:'haha'}],
   	[{nodeId:'4',title:'节点4'},{nodeId:'5',title:'节点5'},{nodeId:'6',title:'节点6'}],
   	[{nodeId:'21',title:'haha'}],
   	[{nodeId:'3',title:'hehe'},{nodeId:'8',title:'节点8'},{nodeId:'9',title:'节点9'},{nodeId:'11',title:'节点11'}]
];*/
var statusKind={ready:'尚未处理',executing:'正在处理',merged:'已合并',sleeping:'暂缓处理',canceled:'已取消',aborted:'已终止',completed:'已完成',returned:'已回退',trainsmited:'已转发',paused:'已暂停'};
var colors={ready:'#4d9bee',completed:'#75ee8d',def:'#e0e0e0',merged:'#FFF8b8',copyto:'#8ce3fa'};
//页面初始化
$(document).ready(function() {
	initializeUI();
});

//根据数据绘制流程图
function initializeUI(){
	 //创建绘图对象
	raphaelPager = Raphael("flowChartDiv", $(window).width(), $(window).height());
	raphaelPager.rect(50, 50, 50, 30, nodeR).attr({fill:colors['ready']});
	raphaelPager.text(75,65, "当前环节").attr(labelFont);
	raphaelPager.rect(50, 100, 50, 30, nodeR).attr({fill:colors['completed']});
	raphaelPager.text(75,115, "已处理");
	raphaelPager.rect(50, 150, 50, 30, nodeR).attr({fill:colors['def']});
	raphaelPager.text(75,165, "未处理");
	raphaelPager.rect(50, 200, 50, 30, nodeR).attr({fill:colors['merged']});
	raphaelPager.text(75,215, "已合并");
	raphaelPager.rect(50, 250, 50, 30, nodeR).attr({fill:colors['copyto']});
	raphaelPager.text(75,265, "抄送");
	var shapeLen = nodesList.length; //节点数量
    if(shapeLen==0) return;
    var getProcedureInfoUrl=$('#getProcedureInfoUrl').val();
    var maxWidth=$(window).width();
    var shapes = new Object(),shapeObject;
	//默认添加开始节点
	shapes['startNode']=raphaelPager.ellipse(initX+(nodeWidth)/2,(initY-ellipseR)/2, ellipseR, ellipseR).attr({fill:colors['completed']});
	raphaelPager.text(initX+(nodeWidth)/2,(initY-ellipseR)/2, "开始").attr(labelFont);
	shapes['startNode']['nextNode']=nodesList[0];//开始节点默认连接数组中的第一组节点
    $.each(nodesList,function (index, items) {
        var r_y = (nodeHeight + nodeInterval) * index +initY;
		$.each(items,function (i, node) {
			var r_x= (nodeWidth + nodeInterval) * i + initX;
			maxWidth=Math.max(maxWidth,r_x+nodeInterval+initX);
			//节点json数据
			shapeObject=raphaelPager.rect(r_x, r_y-10, nodeWidth, nodeHeight, nodeR);
			//为节点添加样式和事件
			//shapeObject.attr({fill:'#e0e0e0', "stroke-width": 1,'stroke-dasharray':'-'});
			shapeObject.attr({fill:colors[node.status]});
			shapeObject.id = node.nodeId;
			shapeObject.attr("title", node.title);
			if(node.cooperationModelId=='assistant'){//协审修改为虚线
				shapeObject.attr({'stroke-dasharray':'-'});
			}else if(node.cooperationModelId=='cc'){//抄送改颜色
				shapeObject.attr({fill:colors['copyto'],stroke:'#2D65DC','stroke-dasharray':'-'});
			}
			var toolTip=$('<div>&nbsp;</div>').css({
				top:r_y-10,
				left:r_x,
				backgroundColor:'red',
				width:nodeWidth+1,
				height:nodeHeight,
				opacity : 0,
				filter : "Alpha(Opacity=0)",
				zIndex:10000,
				position:'absolute'
			}).appendTo('body');
			if(node.procUnitId=='Apply'){
				var html=['<div class="taskTip">'];
				html.push("<div class='taskTitle'>",node.title,'</div>');
				html.push("<div class='taskLine'></div>");
				html.push("<div class='taskTip-usercard'>执行者：",node.executorFullName,'</div>');
				html.push("<div class='taskTip-usercard'>状态：",statusKind[node.status],'</div>');
				html.push("<div class='taskTip-usercard'>开始时间：",node.startTime,'</div>');
				if(!Public.isBlank(node.endTime)){
					html.push("<div class='taskTip-usercard'>结束时间：",node.endTime,'</div>');
				}
				html.push('</div>');
				toolTip.tooltip({position:'right',width:220,content:html.join('')});
			}else{
				toolTip.tooltip({
					position:'right',
					url:getProcedureInfoUrl,
					param:{nodeId:node.nodeId,bizId:$('#bizId').val()},
					dataType:'ajax',
					width:220,
					getContent:function(data){
						var html=['<div class="taskTip">'];
						if($.isEmptyObject(data)){
							html.push("<div class='taskTitle'>",node.title,'</div>');
							html.push("<div class='taskLine'></div>");
							html.push("<div class='taskTip-usercard'>执行者：",node.handlerName,'</div>');
						}else{
							html.push("<div class='taskTitle'>",node.title,'</div>');
							html.push("<div class='taskLine'></div>");
							html.push("<div class='taskTip-usercard'>执行者：",data.executorFullName,'</div>');
							html.push("<div class='taskTip-usercard'>状态：",statusKind[data.statusId],'</div>');
							html.push("<div class='taskTip-usercard'>开始时间：",data.startTime,'</div>');
							if(!Public.isBlank(data.endTime)){
								html.push("<div class='taskTip-usercard'>结束时间：",data.endTime,'</div>');
							}
						}
						html.push('</div>');
						return html.join('');
					}
				});
			}
			//添加文字
			raphaelPager.text(r_x+nodeWidth/2, r_y, node.title).attr(labelFont).attr('font-size','10px');
			raphaelPager.text(r_x+nodeWidth/2, r_y+18,node.handlerName).attr(labelFont).attr('font-size','13px');//.attr('fill','blue')
			//raphaelPager.text(r_x+nodeWidth/2, r_y+nodeHeight/2,node.title).attr(labelFont);
			if(index + 1<shapeLen){
				shapeObject['nextNode']=nodesList[index + 1];
			}else{
				shapeObject['nextNode']='endNode';
			}
			shapes[node.nodeId]=shapeObject;
		});
    });
	//默认添加结束节点
	shapes['endNode']=raphaelPager.ellipse(initX+(nodeWidth)/2,(nodeHeight + nodeInterval) * shapeLen +initY+(ellipseR/2) , ellipseR, ellipseR).attr({fill:colors['def']});
	raphaelPager.text(initX+(nodeWidth)/2,(nodeHeight + nodeInterval) * shapeLen +initY+(ellipseR/2) , "结束").attr(labelFont);
	//添加节点间的连接线
    $.each(shapes,function (p, node) {
		var nextNode=node['nextNode'];
		if(!nextNode) return;//没有下一节点
		if($.isArray(nextNode)){
		   $.each(nextNode,function (i, nn) {
				raphaelPager.drawArr({ obj1:node,obj2: shapes[nn.nodeId]});
		   });
		}else{
			raphaelPager.drawArr({ obj1:node,obj2: shapes[nextNode] });
		}
    });
    //重新设置画布大小
	raphaelPager.setSize(maxWidth, (nodeHeight + nodeInterval) * shapeLen +initY+ellipseR*2);
}
//随着节点位置的改变动态改变箭头
Raphael.fn.drawArr = function (obj) {
    var point = getStartEnd(obj.obj1, obj.obj2);
    var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y, 8);
    if (obj.arrPath) {
        obj.arrPath.attr({ path: path1 });
    } else {
        obj.arrPath = this.path(path1);
    }
	//obj.arrPath.attr({"stroke-width": 2});
	obj.arrPath.attr({stroke:'blue'});//定义线条颜色
    return obj;
};

//开始--结束坐标位置
function getStartEnd(obj1, obj2) {
    var bb1 = obj1.getBBox(),bb2 = obj2.getBBox();
    var start={x: bb1.x + bb1.width / 2,y: bb1.y + bb1.height+1},
	    end={x: bb2.x + bb2.width / 2,y: bb2.y-1};
    return {start:start,end:end};
}

//获取组成箭头的线段的路径
function getArr(x1, y1, x2, y2, size) {
    var result = ["M",x1,y1];
	result.push('L',x1,y1+Math.ceil((y2-y1)/2));
	result.push('L',x2,y1+Math.ceil((y2-y1)/2));
	result.push('L',x2,y2);
    var angle = Raphael.angle(x2, y1, x2, y2); //得到两点之间的角度
    var a45 = Raphael.rad(angle - 35); //角度转换成弧度
    var a45m = Raphael.rad(angle + 35);
    var x2a = x2 + Math.cos(a45) * size;
    var y2a = y2 + Math.sin(a45) * size;
    var x2b = x2 + Math.cos(a45m) * size;
    var y2b = y2 + Math.sin(a45m) * size;
	result.push('L', x2a, y2a);
	result.push('M', x2, y2);
	result.push('L', x2b, y2b);
    return result;
}
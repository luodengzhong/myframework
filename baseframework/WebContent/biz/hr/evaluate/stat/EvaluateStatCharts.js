var gridManager = null,initFlag=false,statCharManager=null,centerLayoutManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeToolBar();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5,onSizeChanged:function(){
		if(statCharManager){
			statCharManager.resize();
		}
		if(centerLayoutManager){//同时改变
			centerLayoutManager._onResize.call(centerLayoutManager);
		}
		setTimeout(function(){gridResize();},0);
		setAttachmentFileHeight();
	}});
	centerLayoutManager=UICtrl.layout('#centerLayout', {topHeight:380,allowTopResize:false});
	$('#layout').children('div.l-layout-center').css({'border':'0px none','borderRight':'1px solid #C6C6C6','borderBottom':'1px solid #C6C6C6'});
	setAttachmentFileHeight();
	$('#divTreeArea').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			hideAttachmentFile();//隐藏文件预览
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id');
			if(id=='file'){
				var fileId=$clicked.attr('fileId');//预览文件
				addConvertPreviewFileIFrame(fileId);
			}else{
				loadData(id,$clicked.text());
			}
			$clicked.parent().addClass('divChoose');
		}
	});
	//默认选择第一个
	$($('#divTreeArea').find('a.GridStyle').get(0)).trigger('click');
}

function setAttachmentFileHeight(){
	var layout = $("#layout");
	$('#showAttachmentFile').height(layout.height());
}
//预览文件
function addConvertPreviewFileIFrame(fileId){
	setAttachmentFileHeight();
	var div=$('#showAttachmentFile');
	var convertUrl=$('#attachmentConvertUrl').val();
	var method='/attachment.do?method=convertAttachment&attachmentId='+fileId+'&a='+new Date().getTime();
	method+="&wmode=transparent&isReadOnly=true";
	//var url=web_app.name + '/evaluateStartAction!showInsertEvaluateStart.do';
	var url=convertUrl+method;
	AttachmentUtil.addConvertPreviewFileIFrame(div,url);
	div.css({position:'absolute'}).show();
}
function hideAttachmentFile(){
	var div=$('#showAttachmentFile').hide();
	AttachmentUtil.clearView(div);
	div.empty();
}

//存在任务ID创建操作菜单
function initializeToolBar(){
	var taskId=$('#chartsTaskId').val();
	if(Public.isBlank(taskId)){
		return;
	}
	var div=$('div.l-layout-left').find('div.l-layout-header-inner').attr('id','scoreToolbar');
	div.html('').css({border:'0px',borderBottom:'1px',fontWeight:'normal'}).toolBar([
		{id:'savesubmit',name:'提交',icon:'turn',event:doSubmit},
		{line:true},
		{id:'view',name:'知会',icon:'view',event:sendReoprt},
		{line:true}
	]);
}

function sendReoprt(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			var ids=[],_self=this;
			$.each(data,function(i,o){
				ids.push(o['id']);
			});
			var evaluateReportId=$('#evaluateReportId').val();
			var url=web_app.name + '/evaluateStartAction!saveSendReport.ajax';
			Public.ajax(url, {evaluateReportId:evaluateReportId,ids:$.toJSON(ids)}, function(data){_self.close();});
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function doSubmit(){
	var taskId=$('#chartsTaskId').val();
	UICtrl.confirm('您是否提交当前信息？',function(){
		Public.ajax(web_app.name + '/workflowAction!completeTask.ajax',{taskId:taskId},function(){
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		});
	});
}
//查询后台加载数据
function loadData(kind,p_title){
	var evaluateStartId=$('#evaluateStartId').val();
	$('#chartsEvaluateKind').val(kind);
	Public.ajax(web_app.name + '/evaluateStatAction!queryEvaluateStatCharts.ajax', {evaluateStartId:evaluateStartId,evaluateKind:kind}, function(data){
		loadProcessStatChar(data,p_title);
		initializeGrid(data);
	});
}
//改变大小同时修改表格显示大小
function gridResize(){
	if(gridManager){
		var height=$('#centerLayout').find('div.l-layout-center').height();
		gridManager.options.height=height;//控制高度 在 _onResize 是需要引用
		gridManager._setHeight(height-10);
	}
}
//初始化表格
function initializeGrid(data) {
    var columns=data.columns;
    var gridColumns=new Array();
    gridColumns.push({ 
    	display: "被评价组织/评价组织", name: "name",frozen: true,
    	width: 150, minWidth: 60, 
    	type: "string", align: "left",
    	render: function (item) {
    		var evaluateOrgId=item['evaluateOrgId'];
    		return '<a href="javascript:showEvaluateOrgGroupAvgIndex(\''+evaluateOrgId+'\');" class="GridStyle">'+item['name']+'</a>';
		}
    });
    $.each(columns,function(i,c){
    	gridColumns.push({ 
    		display:c['name'], name: c['id'], 
    		width:120, minWidth: 60, 
    		type: "number", align: "right",
    		render: function (item) {
    			var evaluateOrgId=item['evaluateOrgId'];
    			var orgId=c['id'];
    			if(!Public.isBlank(item[orgId])){
    				return '<a href="javascript:showEvaluateOrgIndex(\''+evaluateOrgId+'\',\''+orgId+'\');" class="GridStyle">'+item[orgId]+'</a>';
    			}
    			return '';
			}
    	});
    });
    gridColumns.push({ 
    	display: "平均分", name: "avgScore",
    	width: 120, minWidth: 60, 
    	type: "string", align: "right"
    });
    if(initFlag){//已初始化表格
    	 var tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
    	 setTimeout(function(){
        	 gridManager.set('columns', gridColumns); 
        	 gridManager.setData({Rows:data.datas});
        	 gridManager.reRender();
        	 tip.remove();
        },500);
    }else{
    	gridManager=UICtrl.grid('#maingrid', {
        	dataType:'local',
        	data:{Rows:data.datas},
    		columns:gridColumns,
    		width : '100%',
    		height : '100%',
    		heightDiff : -10,
    		headerRowHeight : 25,
    		rowHeight : 25,
    		usePager:false,
    		fixedCellHeight : true,
    		selectRowButtonOnly : true,
    		rownumbers:true
    	});
    	initFlag=true;
    	gridResize();
    }
}

 var colorList = ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'];
function loadProcessStatChar(op,p_title){
	var avgscore=op.avgscore;
	var maxObj=op.maxScores;//排名第一
	var maxscore=maxObj['score'];
	maxscore = Math.ceil(parseFloat(maxscore))+1;//向上取整,有小数就整数部分加1
	var minObj=op.minScores;
	var minscore=minObj['score'];//排名最后
	minscore = Math.floor(parseFloat(minscore))-1;//向下取整
	var data=op.avgScores;
	var titleText=['平均分为',avgscore,','];
	titleText.push(maxObj.name,'排名第一,');
	titleText.push(minObj.name,'排名最后。');
	var option = {
		title : {
		    text:p_title,
		    subtext: titleText.join('')
	    },
	    tooltip : {
	    	trigger: 'axis',
	    	axisPointer : {type : 'shadow'},
	    	formatter:function(param){
	    		var d=param[0].data;
	    		var n=param[0].name;
	    		return n+':'+d.value;
	    	}
	    },
	    toolbox: {
	        show : true,
	        itemSize:24,
	        padding:10,
	        feature : {
	        	exportExcel: {
	                show : true,
	                title : '导出',
	                icon :web_app.name +'/themes/default/images/32X32/import.png',
	                onclick : function (){
	                	exportExcelHandler();
	                }
	            },
	    		saveAsImage : {show: true}
	        }
	    },
	    grid:{y:60,y2:120},
	    yAxis : [{type : 'value',min:minscore,max:maxscore}], xAxis : [], series : []
	};
	if(!statCharManager){
		statCharManager = echarts.init(document.getElementById('evaluateStatCharView'));
		statCharManager.on('click',function(param){
	 		var id=param.data.id;
	 		showEvaluateOrgGroupAvgIndex(id);
	 	});
	}
	var names=new Array(),values=new  Array();
	if(data&&data.length>0){
	 	$.each(data,function(i,o){
	 		name=o['name'];
	 		names.push({
	 			value:name
	 		});
	 		values.push({value:o['score'],id:o['id']});
	 	});
	 	option['xAxis'].push({
	 		type : 'category', 
	 		data :names,
	 		axisLabel:{
	 			rotate:45 //刻度旋转45度角
	 		}
	 	});
	 	option['series'].push({
	 		type : 'bar',
	 		itemStyle : { 
	 			normal: {
	 				label : {show: true, position: 'top',textStyle:{color:'#333333'}},
	 				color:function(params){
		 				var dataIndex=params.dataIndex;
		 				return colorList[params.dataIndex%colorList.length];
		 			}
	 			}
	 		},
	 		data:values,
	 	    markPoint : {
	            data : [
	                 {type : 'max', name: '最大值'},
	                 {type : 'min', name: '最小值'}
	            ]
	        },
	 		markLine : {
	           data : [
	               {type : 'average', name : '平均值',itemStyle:{normal:{color:'#ff0000',lineStyle:{width:3,type:'dotted'}}}}
	           ]
	        }
	 	});
	 	try{statCharManager.clear();}catch(e){} 
	 	statCharManager.setOption(option);
	 }
}

//导出明细
function exportExcelHandler(){
	var columns=gridManager.get('columns');
	var datas=gridManager.getData();
	//组合导出数据XML
	var xmls=['<tables><table>'];
	xmls.push("<row>");
	$(columns).each(function (i, column){
	    xmls.push('<col>',column['display'],'</col>');
	});
	xmls.push("</row>");
	$(datas).each(function (i, d){
		xmls.push("<row>");
		$(columns).each(function (i, c){
			xmls.push('<col>',d[c['name']],'</col>');
		})
		xmls.push("</row>");
	});
	xmls.push('</table></tables>');
	var url = web_app.name+'/evaluateStatAction!exportEvaluateStatScore.ajax';
	UICtrl.downFileByAjax(url,{xml:encodeURI(encodeURI(xmls.join('')))},$('div.divChoose').text());
}

//被评价组织评分字表汇总平均
function showEvaluateOrgGroupAvgIndex(evaluateOrgId){
	var evaluateStartId=$('#evaluateStartId').val();
	var evaluateKind=$('#chartsEvaluateKind').val();
	UICtrl.showAjaxDialog({
		url: web_app.name + '/evaluateStatAction!queryEvaluateOrgGroupAvgIndex.load',
		title:'评价指标汇总',width:getDefaultDialogWidth(),
		param:{evaluateOrgId:evaluateOrgId,evaluateStartId:evaluateStartId,evaluateKind:evaluateKind},
		init:function(doc){
			var table=$(doc).find('tbody');
			mergeCellIndexTable(table,"mainContent");
			mergeCellIndexTable(table,"partContent");
		},
		ok: false
	});
}

//显示评分指标平均分
function showEvaluateOrgIndex(evaluateOrgId,personOrgId){
	var evaluateStartId=$('#evaluateStartId').val();
	UICtrl.showAjaxDialog({
		url: web_app.name + '/evaluateStatAction!queryEvaluateIndexAvgScore.load',
		title:'评价指标汇总',width:getDefaultDialogWidth(),
		param:{evaluateOrgId:evaluateOrgId,personOrgId:personOrgId,evaluateStartId:evaluateStartId},
		init:function(doc){
			var table=$(doc).find('tbody');
			mergeCellIndexTable(table,"mainContent");
			mergeCellIndexTable(table,"partContent");
		},
		ok: false
	});
}
//合并单元格
function mergeCellIndexTable(table,className){
	var oldval,firstTD,counter = 0;
	var $tds=$('td.'+className,table);
	$tds.each(function(index) {
		if (index == 0) {
			oldval = $(this).text();
	        firstTD = $(this).get(0);
	        counter = 1;
	    } else {
	    	if ($(this).text() == oldval) {
	    		$(this).remove();
	            counter++;
	        } else {
	            $(firstTD).attr("rowSpan", counter);
	            oldval = $(this).text();
	            firstTD = $(this).get(0);
	            counter = 1;
	       }
	    }
	    if (index >= $tds.length - 1) {
	   		$(firstTD).attr("rowSpan", counter);
	    }
	});
}


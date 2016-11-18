var gridManager=null,statScoreDetailGridManager=null,statScoreDetailDatas=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	//切换显示类别
	$('#statScoreDetailType').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(function(){
    			var type=$clicked.getValue();
    			//改变显示数据
    			changeStatScoreDetailGrid(type);
    		},0);
    	} 
    });
    //grid 中的指标明细点击
    $('#statScoreDetailGrid').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('a.evaluateOrg')){
    		var id=$clicked.attr('id');
    		showEvaluateOrgGroupAvgIndex(id);
    		return;
    	}
    	if($clicked.is('a.GridStyle')){
    		var ids=$clicked.attr('id').split('|');
    		showEvaluateOrgIndex(ids[0],ids[1]);
    		return;
    	} 
    });
    $('#indexAvgScoreDetailToolBar').toolBar([
    	{ id: 'export', name: '导出EXCEL', icon: 'down', event: function(){
    		exportIndexAvgScore();
    	}},
    	{ id: 'back', name: '返 回', icon: 'undo', event: function(){
    		changeDivVisible('statScoreDetailGridDiv');
    	}}
    ]);
}
function changeDivVisible(divId){
	var ids=['statScoreDetailGridDiv','maingridDiv','indexAvgScoreDetailDiv'];
	$.each(ids,function(i,id){
		$('#'+id)[id==divId?'show':'hide']();
	})
}
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveTurnHandler:{id:'turn',text:'重新统计',img:'page_refresh.gif',click:function(){
			var evaluateStartId=$('#evaluateStartId').val();
			UICtrl.confirm('确定重新统计评价结果吗?',function(){
				Public.ajax(web_app.name + '/evaluateStatAction!saveStatEvaluatePerson.ajax', {evaluateStartId:evaluateStartId}, function(data){
					location.reload();
				});
			});
		}},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		showDetailHandler:{id:'showDetail',text:'详细信息',img:'page_tree.gif',click:function(){
			showDetailHandler();
		}},
		showOverallEvaluation:{id:'showOverallEvaluation',text:'显示总体评价',img:'page_text.gif',click:function(){
			showOverallEvaluation();
		}}
	});
	var evaluateStartId=$('#evaluateStartId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位", name: "name", width: 250, minWidth: 60, type: "string", align: "left" },		   
		{ display: "得分", name: "score", width: 100, minWidth: 60, type: "number", align: "right"},
		{display: '不同层级评价对象双向评价评分', columns:[
			{ display: "副总经理级及以上人员", name: "avg60", width: 150, minWidth: 60, type: "number", align: "right"},
			{ display: "总经理助理级及以下人员", name: "avg40", width: 150, minWidth: 60, type: "number", align: "right"}
		]}
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateStatAction!slicedQueryEvaluateStatScore.ajax',
		parms:{evaluateStartId:evaluateStartId,pagesize:1000},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		usePager:false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#evaluateStartId').val()=='');
		}
	});
}
//评分详情
function showDetailHandler(){
	var evaluateStartId=$('#evaluateStartId').val();
	Public.ajax(web_app.name + '/evaluateStatAction!queryEvaluateStatScoreDetail.ajax', {evaluateStartId:evaluateStartId}, function(data){
		initializeStatScoreDetailGrid(data);
		statScoreDetailDatas=data;
	});
}
//查询总体评价
function showOverallEvaluation(){
	var row = gridManager.getSelectedRow();
	var orgId='';
	if (row) {
		orgId=row.id;
	}
	var evaluateStartId=$('#evaluateStartId').val();
	var url=web_app.name + '/evaluateStatAction!forwardOverallEvaluation.do?evaluateStartId='+evaluateStartId+"&evaluateOrgId="+orgId;
	parent.addTabItem({ tabid: 'OverallEvaluation'+evaluateStartId, text: '总体评价', url:url});
}
function initializeStatScoreDetailGrid(data) {
	changeDivVisible('statScoreDetailGridDiv');
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			exportExcelHandler();
		},
		backHandler:{id:'back',text:'返回',img:'page_left.gif',click:function(){
			changeDivVisible('maingridDiv');
		}}
	});
    var columns=data.columns;
    var gridColumns=new Array();
    gridColumns.push({ 
    	display: "组织", name: "name",
    	width: 120, minWidth: 60, 
    	type: "string", align: "left",
    	render: function (item) {
    		var evaluateOrgId=item['evaluateOrgId'];
    		return '<a href="javascript:void(null);" class="GridStyle evaluateOrg" id="'+evaluateOrgId+'">'+item['name']+'</a>';
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
    				return '<a href="javascript:void(null);" class="GridStyle" id="'+evaluateOrgId+'|'+orgId+'">'+item[orgId]+'</a>';
    			}
    			return '';
			}
    	});
    });
    statScoreDetailGridManager=UICtrl.grid('#statScoreDetailGrid', {
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
		toolbar: toolbarOptions
	});
}
function changeStatScoreDetailGrid(type){
	var columns=statScoreDetailDatas.columns;
    var datas=statScoreDetailDatas.datas;
    var gridColumns=new Array(),showDatas=new Array();
    gridColumns.push({ 
    	display: "组织", name: "name",
    	width: 120, minWidth: 60, 
    	type: "string", align: "left",
    	render: function (item) {
    		var evaluateOrgId=item['evaluateOrgId'];
    		return '<a href="javascript:void(null);" class="GridStyle evaluateOrg" id="'+evaluateOrgId+'">'+item['name']+'</a>';
		}
    });
    switch (parseInt(type,10)) {  
    	case 1 : //总部职能评价城市公司/专业公司/事业部
		    $.each(columns,function(i,c){
		    	if(c['evaluateOrgKind']=='HQ'){
		    		gridColumns.push({
		    			display:c['name'], name: c['id'], 
		    			width:120, minWidth: 60,
		    			type: "number", align: "right",
		    			render: function (item) {
			    			var evaluateOrgId=item['evaluateOrgId'];
			    			var orgId=c['id'];
			    			if(!Public.isBlank(item[orgId])){
			    				return '<a href="javascript:void(null);" class="GridStyle" id="'+evaluateOrgId+'|'+orgId+'">'+item[orgId]+'</a>';
			    			}
			    			return '';
						}
		    		});
		    	}
		    });
		    $.each(datas,function(i,c){
		    	if(c['evaluateOrgKind']=='cityCorp'){
		    		showDatas.push(c);
		    	}
		    });
    		break;
    	case 2 ://城市公司/专业公司/事业部评价总部职能
    		$.each(columns,function(i,c){
		    	if(c['evaluateOrgKind']=='cityCorp'){
		    		gridColumns.push({ 
		    			display:c['name'], name: c['id'], 
		    			width:120, minWidth: 60, 
		    			type: "number", align: "right",
		    			render: function (item) {
			    			var evaluateOrgId=item['evaluateOrgId'];
			    			var orgId=c['id'];
			    			if(!Public.isBlank(item[orgId])){
			    				return '<a href="javascript:void(null);" class="GridStyle" id="'+evaluateOrgId+'|'+orgId+'">'+item[orgId]+'</a>';
			    			}
			    			return '';
						}
		    		});
		    	}
		    });
		    $.each(datas,function(i,c){
		    	if(c['evaluateOrgKind']=='HQ'){
		    		showDatas.push(c);
		    	}
		    });
    		break;
    	case 3 ://总部职能评价总部职能
    		$.each(columns,function(i,c){
		    	if(c['evaluateOrgKind']=='HQ'){
		    		gridColumns.push({ 
		    			display:c['name'], name: c['id'], 
		    			width:120, minWidth: 60,
		    			type: "number", align: "right",
		    			render: function (item) {
			    			var evaluateOrgId=item['evaluateOrgId'];
			    			var orgId=c['id'];
			    			if(!Public.isBlank(item[orgId])){
			    				return '<a href="javascript:void(null);" class="GridStyle" id="'+evaluateOrgId+'|'+orgId+'">'+item[orgId]+'</a>';
			    			}
			    			return '';
						}
		    		});
		    	}
		    });
		    $.each(datas,function(i,c){
		    	if(c['evaluateOrgKind']=='HQ'){
		    		showDatas.push(c);
		    	}
		    });
    		break;
        default :
        	$.each(columns,function(i,c){
		    	gridColumns.push({ 
		    		display:c['name'], name: c['id'],
		    		width:120, minWidth: 60,
		    		type: "number", align: "right",
		    		render: function (item) {
			    		var evaluateOrgId=item['evaluateOrgId'];
			    		var orgId=c['id'];
			    		if(!Public.isBlank(item[orgId])){
			    			return '<a href="javascript:void(null);" class="GridStyle" id="'+evaluateOrgId+'|'+orgId+'">'+item[orgId]+'</a>';
			    		}
			    		return '';
					}
		    	});
		    });
        	showDatas=datas;
        	break;
     }
     var tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
     setTimeout(function(){
     	 statScoreDetailGridManager.set('columns', gridColumns); 
     	 statScoreDetailGridManager.setData({Rows:showDatas});
     	 statScoreDetailGridManager.reRender();
     	 tip.remove();
     },1000);
}
//导出明细
function exportExcelHandler(){
	var columns=statScoreDetailGridManager.get('columns');
	var datas=statScoreDetailGridManager.getData();
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
	UICtrl.downFileByAjax(url,{xml:encodeURI(encodeURI(xmls.join('')))},"母子公司双向评价得分");
}
//显示评分指标平均分
function showEvaluateOrgIndex(evaluateOrgId,personOrgId){
	var evaluateStartId=$('#evaluateStartId').val();
	var url=web_app.name + '/evaluateStatAction!queryEvaluateIndexAvgScore.load';
	Public.load(url,{evaluateOrgId:evaluateOrgId,personOrgId:personOrgId,evaluateStartId:evaluateStartId},function(data){
		var div=$('#indexAvgScoreDetail').html(data);
		var table=div.find('tbody');
		mergeCellIndexTable(table,"mainContent");
		mergeCellIndexTable(table,"partContent");
		changeDivVisible('indexAvgScoreDetailDiv');
	});
}
//被评价组织评分字表汇总平均
function showEvaluateOrgGroupAvgIndex(evaluateOrgId){
	var evaluateStartId=$('#evaluateStartId').val();
	var url=web_app.name + '/evaluateStatAction!queryEvaluateOrgGroupAvgIndex.load';
	Public.load(url,{evaluateOrgId:evaluateOrgId,evaluateStartId:evaluateStartId},function(data){
		var div=$('#indexAvgScoreDetail').html(data);
		var table=div.find('tbody');
		mergeCellIndexTable(table,"mainContent");
		mergeCellIndexTable(table,"partContent");
		changeDivVisible('indexAvgScoreDetailDiv');
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
//导出评分指标明细
function exportIndexAvgScore(){
	var indexDiv=$('#indexAvgScoreDetail').find('div.indexAvgScoreList');
	var xmls=['<tables><table>'];
	indexDiv.each(function(){
		var title=$(this).find('div.subject').text();
		xmls.push('<row>','<col colSpan="5">',title,'</col>','</row>');
		xmls.push('<row>');
		xmls.push('<col colSpan="2">评价维度</col>');
		xmls.push('<col>要求</col>');
		xmls.push('<col>评均分</col>');
		xmls.push('</row>');
		$(this).find('tbody>tr').each(function(){
			xmls.push('<row>');
			$(this).find('td').each(function(){
				var rowSpan=$(this).attr('rowSpan');
				xmls.push('<col');
				if(parseInt(rowSpan,10)>1){
					xmls.push(' rowSpan="',rowSpan,'">')
				}else{
					xmls.push('>');
				}
				xmls.push($(this).text(),'</col>');
			});
			xmls.push('</row>');
		});
	});
	xmls.push('</table></tables>');
	var url = web_app.name+'/evaluateStatAction!exportEvaluateStatScore.ajax';
	UICtrl.downFileByAjax(url,{xml:encodeURI(encodeURI(xmls.join('')))},"母子公司双向评价");
}
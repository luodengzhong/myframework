var gridManager = null,unqualifiedIndexGridManager=null,isShowOverallEvaluation=true;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#divTreeArea').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id'),title=$clicked.attr('title');
			var html=[];
			html.push('<font style="color:Tomato;font-size:13px;">[',title,']</font>总体评价');
			$('.l-layout-center .l-layout-header').html(html.join(''));
			$('#evaluateOrgId').val(id);
			UICtrl.gridSearch(isShowOverallEvaluation?gridManager:unqualifiedIndexGridManager,{evaluateOrgId:id});
			$clicked.parent().addClass('divChoose');
		}
	});
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		showAllOverallEvaluation:{id:'showAllOverallEvaluation',text:'显示全部评价',img:'page_sound.gif',click:function(){
			$('.l-layout-center .l-layout-header').html('总体评价');
			$('div.divChoose',$('#divTreeArea')).removeClass('divChoose');
			UICtrl.gridSearch(gridManager,{evaluateOrgId:'',overallRvaluation:''});
		}},
		showOverallEvaluation:{id:'showOverallEvaluation',text:'显示总体评价',img:'page_sound.gif',click:function(){
			UICtrl.gridSearch(gridManager,{overallRvaluation:1});
		}},
		showUnqualifiedIndex:{id:'showUnqualifiedIndex',text:'显示得分低于80分指标',img:'page_link.gif',click:function(){
			if(!unqualifiedIndexGridManager){
				initializeUnqualifiedIndexGrid();
			}else{
				UICtrl.gridSearch(unqualifiedIndexGridManager);
			}
			$('#showShowOverallEvaluation').hide();
			$('#showUnqualifiedIndexGridManager').show();
			isShowOverallEvaluation=false;
		}}
	});
	var param={evaluateStartId:$('#evaluateStartId').val(),overallRvaluation:1};
	param['evaluateOrgId']=$('#evaluateOrgId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "评价组织", name: "personOrgName", width: 200, minWidth: 60, type: "string", align: "left" },	
		{ display: "评价人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "评价人权重", name: "weight", width: 80, minWidth: 60, type: "number", align: "right" },
		{ display: "评分", name: "avgPoints", width: 60, minWidth: 60, type: "number", align: "right" },
		{ display: "被评价组织", name: "orgUtilName", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "总体评价", name: "overallEvaluation", width:500, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateStatAction!slicedQueryOverallEvaluation.ajax',
		parms:param,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.createGridQueryBtn('#maingrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(gridManager, { keyValue: encodeURI(value) });
    });
}

function initializeUnqualifiedIndexGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(unqualifiedIndexGridManager);
		},
		showAllUnqualifiedIndex:{id:'showAllUnqualifiedIndex',text:'显示全部得分较低指标',img:'page_key.gif',click:function(){
			$('.l-layout-center .l-layout-header').html('总体评价');
			$('div.divChoose',$('#divTreeArea')).removeClass('divChoose');
			UICtrl.gridSearch(unqualifiedIndexGridManager,{evaluateOrgId:''});
		}},
		showOverallEvaluation:{id:'showOverallEvaluation',text:'显示总体评价',img:'page_sound.gif',click:function(){
			UICtrl.gridSearch(gridManager);
			$('#showShowOverallEvaluation').show();
			$('#showUnqualifiedIndexGridManager').hide();
			isShowOverallEvaluation=true;
		}}
	});
	var param={evaluateStartId:$('#evaluateStartId').val()};
	param['evaluateOrgId']=$('#evaluateOrgId').val();
	unqualifiedIndexGridManager = UICtrl.grid('#unqualifiedIndexGrid', {
		columns: [
		{ display: "评价组织", name: "personOrgName", width: 130, minWidth: 60, type: "string", align: "left" },	
		{ display: "评价人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "评价人权重", name: "weight", width: 80, minWidth: 60, type: "number", align: "right" },
		{ display: "被评价组织", name: "orgUtilName", width: 130, minWidth: 60, type: "string", align: "left" },
		{ display: "评价维度", name: "mainContent", width:120, minWidth: 60, type: "string", align: "left" },
		{ display: "评价维度", name: "partContent", width:120, minWidth: 60, type: "string", align: "left" },
		{ display: "要求", name: "desption", width:220, minWidth: 60, type: "string", align: "left" },
		{ display: "得分", name: "scoreNum", width:120, minWidth: 60, type: "string", align: "left" },
		{ display: "说明", name: "remark", width:320, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateStatAction!slicedQueryUnqualifiedIndexs.ajax',
		parms:param,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.createGridQueryBtn('#unqualifiedIndexGrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(unqualifiedIndexGridManager, { keyValue: encodeURI(value) });
    });
}
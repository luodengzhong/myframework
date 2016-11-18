var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
     UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
     $('#maintree').commonTree({
	    loadTreesAction:'orgAction!queryOrgs.ajax',
	    parentId :'orgRoot',
	    manageType:'hrArchivesManage',
	    getParam : function(e){
		if(e){
			return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
		 }
		return {showDisabledOrg:0};
	   },
	  changeNodeIcon:function(data){
		data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
	},
	IsShowMenu:false,
	onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data) {
     var html=[],fullId='',fullName='';
     if(!data){
	    html.push('人力编制和成本情况列表');
     }else{
	    fullId=data.fullId,fullName=data.fullName;
	    html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人力编制和成本情况列表');
     }
     $('.l-layout-center .l-layout-header').html(html.join(''));
     $('#mainFullId').val(fullId);
     if (gridManager&&fullId!='') {
	    UICtrl.gridSearch(gridManager,{fullId:fullId});
     }else{
	    gridManager.options.parms['fullId']='';
     }
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler: saveHandler, 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "组织名称", name: "dptName", width: 120, minWidth: 60, type: "string", align: "left",
		render:function(item){
				if(item.existNum>item.targetNum){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.dptName+'</font>';
				} 
				return item.dptName;},
				totalSummary:{
				render: function (suminf, column, data){
					return '合 计';
				},
				align: 'center'
			}},
		{ display: "年份", name: "year", width: 80, minWidth: 60, type: "string", align: "center" },		   
		{ display: "月份", name: "month", width: 80, minWidth: 60, type: "string", align: "center" },		   
		//{ display: "目标编制人数", name: "targetNum", width: 80, minWidth: 60, type: "number", align: "left",
		//totalSummary:UICtrl.getTotalSummary()},		   
		//{ display: "当月占编人数", name: "existNum", width: 80, minWidth: 60, type: "number", align: "left",
		//totalSummary:UICtrl.getTotalSummary()},	
		{display: '本月计编人员动态', columns:[
		         { display: "录用人数", name: "employNum", width: 80, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary() },		   
		         { display: "离职人数", name: "resignationNum", width: 80, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary() },		   
		         { display: "晋升人数", name: "promoteNum", width: 80, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary() },		   
		         { display: "淘汰人数", name: "outNum", width: 80, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary() }	
		 ]},
		 {display: '人力成本预算', columns:[
		         { display: "成本计划值(万元)", name: "budgetValue", width: 120, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary(),
		          editor : {
						type : 'spinner',
						mask : 'nnnnnnn.nn'
					}},		
				 { display: "成本完成值(万元)", name: "completeValue", width: 120, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary(),
		          editor : {
						type : 'spinner',
						mask : 'nnnnnnn.nn'
					}},		
		         { display: "计划完成率", name: "planCompletePercent", width: 120, minWidth: 60, type: "string", align: "left",
		         render:function(item){
				 if(item.completeValue>=item.budgetValue){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.planCompletePercent+'</font>';
				} 
				return item.planCompletePercent;}},
			 { display: "上月成本计划值(万元)", name: "lastBudgetValue", width: 120, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary()},
			 { display: "上月计划完成率", name: "lastPlanCompletePercent", width: 120, minWidth: 60, type: "string", align: "left"}
		 ]},
		 { display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left", editor : {
				type : 'text'
			}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/costScheduleAction!slicedQuery.ajax',
		enabledEdit : true,
		parms:{totalFields:'targetNum,existNum,employNum,resignationNum,promoteNum,outNum,budgetValue,completeValue,lastBudgetValue'},
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function saveHandler(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	     });
	Public.ajax(web_app.name + '/costScheduleAction!save.ajax', {detailData:$.toJSON(extendedData)}, function(){
			reloadGrid();
		});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

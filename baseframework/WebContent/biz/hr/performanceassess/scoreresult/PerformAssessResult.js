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
		manageType:'hrPerFormAssessManage',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('测评结果');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>测评结果列表');
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
	
		archiveHandler:{id:'archiveHandler',text:'批量归档',img:'page_next.gif',click:archiveHandler},
		oneAchiveHandler:{id:'oneAchiveHandler',text:'单项归档',img:'save.gif',click:function(){
			viewHandler();
		}},
		deleteHandler:deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		  		{ display: "被考核对象姓名", name: "assessName", width: 100, minWidth: 60, type: "string", align: "left",
		  			render:function(item){
						return '<a href="javascript:showScoreDetail('+item.formId+');" class="GridStyle">'+item.assessName+'</a>';
		  			}},
		  		{ display: "考核表名称", name: "formName", width: 150, minWidth: 60, type: "string", align: "left" },
		  		{ display: "上级平均分", name: "upLevelAverageScore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "平级平均分", name: "equelLevelAverageScore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "下级平均分", name: "lowLevelAverageScore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "合计平均分", name: "totalAverage", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "自评平均分", name: "scoreMyself", width: 100, minWidth: 60, type: "string", align: "left" }	,	   
		  		{ display: "评分状态", name: "scoreStatusTextView", width: 100, minWidth: 60, type: "string", align: "left" },	  
		  		{ display: "发起时间", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" }	   
		  		],
		dataAction : 'server',
		url: web_app.name+'/performAssessResultAction!slicedQuery.ajax',
		manageType:'hrPerFormAssessManage',
		checkbox:true,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		sortName:' fillinDate',
		sortOrder:'desc',
		onDblClickRow : function(data, rowindex, rowobj) {
		    viewHandler(data.formId);
		}
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

function archiveHandler(){
	 var formIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'formId' });
    if (!formIds) return;
	
	UICtrl.confirm('确定归档分数吗?',function(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performAssessResultAction!archive.ajax',
	    param:{formIds:$.toJSON(formIds)},
		success : function() {
			reloadGrid();
		}
	});
	});
}
//对于重复发起的任务执行删除操作  
function deleteHandler(){
		var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }

		var formId=row.formId;
		var status=row.scoreStatus;
		if(status==2 ||status==4){
			Public.tip('选择的数据不能执行删除操作！'); return;
		}
		UICtrl.confirm('确定删除吗?',function(){
			Public.ajax(web_app.name + '/paformMakeAction!deleteAssessFrom.ajax', 
				{formId:formId}, function(){
			     reloadGrid();
		});
		});
		
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function showScoreDetail(formId){
	parent.addTabItem({ 
		tabid: 'HRAssessResult'+formId,
		text:'员工考评评分情况查看',
		url: web_app.name + '/performAssessScoreDetailAction!forwardList.do?formId='+formId
		}); 
	
}

function viewHandler(formId){
	if(!formId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		formId=row.formId;
	}
	parent.addTabItem({ 
		tabid: 'HRScoreReault'+formId,
		text: '测评结果查看',
		url: web_app.name + '/performAssessResultAction!showDetail.do?formId=' 
			+ formId 
		}); 
}


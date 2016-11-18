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
	manageType:'hrBaseRecruitData',
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
	html.push('录用申请单列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>录用申请单列表');
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
		viewHandler:function(){
			updateHandler();
		},
	 exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "申请日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "录用员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "审批时间", name: "approveDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "拟定单位", name: "employCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定中心", name: "employCenter", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定部门", name: "employDept", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "录用职位", name: "employPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		//{ display: "年收入预期标准(万元)", name: "salaryYear", width: 200, minWidth: 60, type: "string", align: "left" },		   
		//{ display: "拟定月度岗位工资标准(元)", name: "salaryMonth", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "入职时间", name: "employDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "优秀素质", name: "excellent", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "职级", name: "staffingPostsRankTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "职级序列", name: "staffingPostsRankSequence", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "体系分类", name: "systemTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }	   

		],
		dataAction : 'server',
		url: web_app.name+'/employApplyAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,

		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.employApplyId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/employApplyAction!showInsert.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(employApplyId){
	if(!employApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		employApplyId=row.employApplyId;
	}
	
	parent.addTabItem({
		tabid: 'HREmployApply'+employApplyId,
		text: '新员工录用审批',
		url: web_app.name + '/employApplyAction!showUpdate.job?bizId=' 
			+ employApplyId+'&isReadOnly=true'
	  }
	);
	
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/employApplyAction!delete.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'employApplyAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/employApplyAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/employApplyAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "employApplyAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'employApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'employApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/

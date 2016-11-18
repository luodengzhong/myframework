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
	html.push('档案交接列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>档案交接列表');
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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "交接时间", name: "handOverTime", width: 100, minWidth: 60, type: "date", align: "center" },		   
		{ display: "交接档案员工", name: "handStaffName", width: 100, minWidth: 60, type: "string", align: "center"},
		{ display: "移交人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center"},
		{ display: "接收人", name: "receivingStaffName", width: 100, minWidth: 60, type: "string", align: "center"},
		{ display: "接收单位", name: "receivingOgnName", width: 150, minWidth: 60, type: "string", align: "center" },	
		{ display: "资料完备情况", name: "desption", width: 250, minWidth: 60, type: "string", align: "center"},		   
		{ display: "接收人签名", name: "receivingNameSign", width: 150, minWidth: 60, type: "string", align: "center"}	
		],
		dataAction : 'server',
		url: web_app.name+'/archivesHandoverAction!slicedQueryArchivesHandoverDetail.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'handOverTime',
		sortOrder:'desc',
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/archivesHandoveAction!showInsertArchivesHandover.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/archivesHandoveAction!showUpdateArchivesHandover.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/archivesHandoveAction!deleteArchivesHandover.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'archivesHandoveAction!deleteArchivesHandover.ajax',
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
	$('#submitForm').ajaxSubmit({url: web_app.name + '/archivesHandoveAction!insertArchivesHandover.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/archivesHandoveAction!updateArchivesHandover.ajax',
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
	var action = "archivesHandoveAction!updateArchivesHandoverSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'archivesHandoveAction!updateArchivesHandoverStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'archivesHandoveAction!updateArchivesHandoverStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/

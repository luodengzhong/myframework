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
			return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
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
	html.push('应聘岗位列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>应聘岗位列表');
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
	var  param=$('#param').val();
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
		   
		{ display: "职位名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单位名称", name: "organName", width: 200, minWidth: 60, type: "string", align: "left" },	
		{ display: "招聘人数", name: "recNumber", width: 200, minWidth: 60, type: "string", align: "left" },
	    { display: "操作", name: "", width: 100, minWidth: 60, type: "string", align: "left",
	       render: function (item){
		    return '<a href="javascript:viewPosDetail(\''+item.recPosId+'\');" class="GridStyle">' + "应聘" + '</a>';
	     }}
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryPosList.ajax',
		parms:{param:param},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'organName',
		sortOrder:'desc',
		fixedCellHeight : true,
		//toolbar: toolbarOptions,

		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateHandler(data.employApplyId);
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

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


function viewPosDetail(recPosId){
 window.location.href =web_app.name + '/personregisterAction!forwardPosDetail.do?posId='+recPosId+'&sourceType='+3;
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

var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initializeGrid();
});


function initUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseBeformalManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
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
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
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
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		beFormalHandler:{id:'beFormalHandler',text:'转正意见征求',img:'page_next.gif',click:function(){
			beFormal();
		}}
	});
	gridManager = UICtrl.grid('#maingrlistid', {
		columns: [
		  		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		  		{ display: "身份证号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
		  		{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left",frozen: true},
		  		{ display: "转正意见征求状态", name: "statusTextView", width: 120, minWidth: 60, type: "string", align: "left"},
		  		{ display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left"},
		  		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		  		{ display: "层级", name: "posTierTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "编制状态", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		  		],
		  		dataAction : 'server',
		  		url: web_app.name+'/beFormalAction!queryBeFormalPerson.ajax',
				manageType:'hrBaseBeformalManage',
		  		pageSize : 20,
		  		width : '100%',
		  		height : '100%',
		  		heightDiff : -10,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'sequence',
		  		sortOrder:'asc',
		  		checkbox:true,
		  		toolbar: toolbarOptions,
		  		fixedCellHeight : true,
		  		selectRowButtonOnly : true
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





function beFormal(){
	 var archivesIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'archivesId' });
    if (!archivesIds) return;
    var sts=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'status' });
    for(var i=0;i<sts.length;i++){
   		if(parseInt(sts[i])==1 ){
   			Public.tip('已发送试用期转正征求意见,无需重复发起!');
   			return false;
   		}
    }
    
	$('#submitForm').ajaxSubmit({url: web_app.name + '/beFormalAskopAction!insert.ajax',
		param:{archivesIds:$.toJSON(archivesIds)},
		success : function(data) {
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


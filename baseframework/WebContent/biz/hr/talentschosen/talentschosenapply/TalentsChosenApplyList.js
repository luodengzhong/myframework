var gridManager = null, refreshFlag = false,competeStatus=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	competeStatus=$('#competeStatus').combox('getJSONData');
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseTalentsChosenData',
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
		html.push('员工列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>员工列表');
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
	var speechType=$('#speechType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		aduitHandler:{id:'aduit',text:'发起审核',img:'page_next.gif',click:function(){
			aduit();
		}},
		dropHandler:{id:'drop',text:'淘汰',img:'page_deny.gif',click:function(){
			drop();
		}},
		passHandler:{id:'pass',text:'通过',img:'page_extension.gif',click:function(){
			pass();
		}}
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表时间", name: "fillinDate", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "竞聘岗位名称", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "竞聘岗位所在机构", name: "chosenOrganName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "竞聘岗位所在中心", name: "chosenCenterName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "竞聘状态", name: "competeStatus", width: 100, minWidth: 60, type: "string", align: "left",
		render:function(item){
				return competeStatus[item.competeStatus];
			}},		   
		{ display: "机构", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学历", name: "educationTextView", width: 70, minWidth: 60, type: "string", align: "left" },		   
		{ display: "大学", name: "campus", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄", name: "age", width: 60, minWidth: 60, type: "string", align: "left" }		
		],
		dataAction : 'server',
		url: web_app.name+'/talentschosenapplyAction!slicedQueryTalentsChosenApply.ajax',
		pageSize : 20,
		parms:{speechType:speechType},
		manageType:'hrBaseTalentsChosenData',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.chosenApplyId);
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


function aduit(){
	var chosenApplyIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'chosenApplyId' });
    if (!chosenApplyIds) return;
    var sts=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'competeStatus' });
    var competePositionIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'competePositionId' });
    for(var i=0;i<sts.length;i++){
   		if(parseInt(sts[i])==1 ){
   			Public.tip('选中人员已发起报批,无需重复发起!');
   			return false;
   		}
    }
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosenapplyAction!insertCompeteCandidateAduit.ajax',
		param:{chosenApplyIds:$.toJSON(chosenApplyIds),competePositionIds:$.toJSON(competePositionIds),type:1},
		success : function(data) {
			refreshFlag = true;
			reloadGrid();
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
}
//添加按钮 
function addHandler() {
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply',
		text: '人才选拨申请表 ',
		url: web_app.name + '/talentschosenapplyAction!forwardTalentsChosenApplyBill.do?speechType=1'
	}); 
}

//编辑按钮
function updateHandler(chosenApplyId){
	if(!chosenApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		chosenApplyId=row.chosenApplyId;
	}
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply'+chosenApplyId,
		text: '修改竞聘员工详情 ',
		url: web_app.name + '/talentschosenapplyAction!showUpdateTalentsChosenApply.do?chosenApplyId=' 
			+ chosenApplyId
	}); 
}

function viewHandler(chosenApplyId){
	if(!chosenApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		chosenApplyId=row.chosenApplyId;
	}
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply'+chosenApplyId,
		text: '修改竞聘员工详情 ',
		url: web_app.name + '/talentschosenapplyAction!showUpdateTalentsChosenApply.job?chosenApplyId=' 
			+ chosenApplyId
	}); 
}

function drop(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var chosenApplyId=row.chosenApplyId;
	UICtrl.confirm('确定该员工不参与竞聘演讲吗?',function(){
		Public.ajax(web_app.name + '/talentschosenapplyAction!updateChosenStatus.ajax', 
				{chosenApplyId:chosenApplyId,competeStatus:2}, function(){
			reloadGrid();
		});
	}); 	
		
}

function pass(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var chosenApplyId=row.chosenApplyId;
	UICtrl.confirm('确定该员工参与竞聘演讲吗?',function(){
		Public.ajax(web_app.name + '/talentschosenapplyAction!updateChosenStatus.ajax', 
				{chosenApplyId:chosenApplyId,competeStatus:3}, function(){
			reloadGrid();
		});
	}); 	
}


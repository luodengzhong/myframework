var gridManager = null, refreshFlag = false;
var dataSource={
		status:{'1':'启用','-1':'禁用','0':'草稿'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	$('#status').combox({data:dataSource.status,checkbox:true}).combox('setValue','0,1');
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
		html.push('竞聘岗位列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>竞聘岗位列表');
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
	var queryType=$('#queryType').val();
	var toolbarOptions =null;
	var manageType=null;
	if (queryType==0){//???queryType=0什么意思  queryType=0表示不是在首页显示
		manageType='hrBaseTalentsChosenData';
		toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			addHandler: addHandler, 
			updateHandler: function(){
				updateHandler();
			},
			enableHandler: enableHandler,
			disableHandler: disableHandler
		});
	}else{
		toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			competePosApplyHandler:{id:'competePosApply',text:'竞聘报名',img:'page_next.gif',click:function(){
				competePosApply();
			}}
		});
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "竞聘岗位名称", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "所在单位", name: "chosenOrganName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所在中心", name: "chosenCenterName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所在部门", name: "chosenDeptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟选拨人数", name: "chosenNum", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left" ,
		render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}},		   
		{ display: "时间", name: "updateDate", width: 100, minWidth: 60, type: "string", align: "left" }	,	   
		{ display: "说明", name: "desption", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/talentschosendemandAction!slicedQueryCompetitionPosition.ajax',
		manageType:manageType,
		parms:{status:'0,1'},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
        checkbox : true,
		rowHeight : 25,
		sortName:'updateDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
		/*onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.competePositionId);
		}*/
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function competePosApply(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var competePositionId=row.competePositionId;
	var chosenPosName=row.chosenPosName;
	parent.addTabItem({
		tabid: 'HRtalentschosendemand'+competePositionId,
		text: '岗位【'+chosenPosName+'】竞聘详情',
		url: web_app.name + '/talentschosendemandAction!showCompetePosDetail.do?competePositionId=' 
			+ competePositionId
	});
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
	UICtrl.showAjaxDialog({url: web_app.name + '/talentschosendemandAction!showInsertCompetitionPosition.load', 
	width:400,
	title:'新增竞聘岗位',
	init:initDialog,
	ok: insert,
	close: dialogClose});
}
function initDialog(){
	
     
    $('#chosenOrganName').orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
    //	manageType:'hrBaseTalentsChosenData',
		back:{
			text:'#chosenOrganName',
			value:'#chosenOrganId',
			id:'#chosenOrganId',
			name:'#chosenOrganName'
		}
	});
    
	$('#chosenCenterName').orgTree({filter:'dpt',
		getParam:function(){
			var ognId=$('#chosenOrganId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		//manageType:'hrBaseTalentsChosenData',
		back:{
			text:'#chosenCenterName',
			value:'#chosenCenterId',
			id:'#chosenCenterId',
			name:'#chosenCenterName'
		}
	});
	
    $('#chosenDeptName').orgTree({filter:'dpt',
		getParam:function(){
			var ognId=$('#chosenOrganId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		//manageType:'hrBaseTalentsChosenData',
		back:{
			text:'#chosenDeptName',
			value:'#chosenDeptId',
			id:'#chosenDeptId',
			name:'#chosenDeptName'
		}
	});
    
    var $el=$('#chosenPosName');
	$el.orgTree({filter:'pos',
		getParam:function(){
			var ognId=$('#chosenOrganId').val(),
				dptId=$('#chosenDeptId').val(),
				root='orgRoot';
			if(ognId!=''){
				root=ognId;
			}
			if(dptId!=''){
				root=dptId;
			}
		  return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
		},
		
		back:{
			text:$el,
			value:'#chosenPosId',
			id:'#chosenPosId'
		}
	});
  
}
//编辑按钮
function updateHandler(competePositionId){
	if(!competePositionId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		competePositionId=row.competePositionId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/talentschosendemandAction!showUpdateCompetitionPosition.load',
	param:{competePositionId:competePositionId}, 
	width:400,
	ok: update, 
	init:initDialog,
	title:'修改竞聘岗位',
	close: dialogClose});
}



//新增保存
function insert() {
	var competePositionId=$('#competePositionId').val();
	if(competePositionId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosendemandAction!insertCompetitionPosition.ajax',
		success : function(data) {
			$('#competePositionId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosendemandAction!updateCompetitionPosition.ajax',
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


//启用
function enableHandler(){
	DataUtil.updateById({ action: 'talentschosendemandAction!updateCompetitionPositionStatus.ajax',
		gridManager: gridManager,idFieldName:'competePositionId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'talentschosendemandAction!updateCompetitionPositionStatus.ajax',
		gridManager: gridManager,idFieldName:'competePositionId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}


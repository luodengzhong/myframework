var gridManager = null, refreshFlag = false,speechTypeTemp=null;
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
		html.push('竞聘候选人演讲分数列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>竞聘候选人演讲分数列表');
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
	var  speechType=$('#speechType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		aduitHandler:{id:'aduit',text:'发起审核',img:'page_next.gif',click:function(){
			aduit();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 { display: "生成时间", name: "createTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
	    { display: "机构", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
  		{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "是否报批", width: 100, minWidth: 60, type: "string", align: "left",
			render:function(item){
				if(item.resultAduitId>0){
					return "是";
				} 
				return "否";}   
		},
		{ display: "是否通过", name: "isAgree", width: 100, minWidth: 60, type: "string", align: "left" ,
		render:function(item){
				if(item.isAgree==1){
					return "是";
				} 
				return "否";}},		   
	//	{ display: "审核通过", name: "yesornoTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "拟定岗位", name: "planPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨岗位", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨机构", name: "chosenOrganName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨中心", name: "chosenCenterName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "主评委平均分", name: "mainJuryAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "平級评委平均分", name: "commonJuryAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "下級评委平均分", name: "lowerAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "合计平均分", name: "sumAvgscore", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/speechscoreresultAction!slicedQuerySpeechScoreResult.ajax',
		parms:{speechType:speechType},
		manageType:'hrBaseTalentsChosenData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		sortName:'createTime',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.resultId,data.resultAduitId);
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
	var  speechType=$('#speechType').val();
	UICtrl.showAjaxDialog({url: web_app.name + '/speechscoreresultAction!showInsertSpeechScoreResult.load',
	title:'新增人员的评分结果',
	width:530,
	param:{speechType:speechType},
	init:initDialog,
	ok: insert, close: dialogClose});
}
function initDialog(){
	 $('#staffName').searchbox({ type:"hr",name: "resignationChoosePerson",
			back:{
				ognId:"#ognId",ognName:"#ognName",centreId:"#centreId",
				centreName:"#centreName",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId"}
	 });
	 posNameSelect($('#chosenPosName'));
}

function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if(this.mode=='tree'){
				
				$('#chosenOrganName').val(nodeData.orgName);
	        	$('#chosenOrganId').val(nodeData.orgId);
	        	$('#chosenCenterName').val(nodeData.centerName);
	        	$('#chosenCenterId').val(nodeData.centerId);
			}
		},
		back:{
			text:$el,
			value:'#chosenPosId',
			id:'#chosenPosId',
			name:$el,
			orgName:'#chosenOrganName',
			orgId:'#chosenOrganId',
			centerName:'#chosenCenterName',
			centerId:'#chosenCenterId'
		}
	});
}
//编辑按钮
function updateHandler(resultId,resultAduitId){
	if(!resultId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		resultId=row.resultId;
		resultAduitId=row.resultAduitId;
	
	}
	if(resultAduitId){
		Public.tip('已发起审核的评分结果不能修改！');
		return false;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/speechscoreresultAction!showUpdateSpeechScoreResult.load',
	param:{resultId:resultId}, ok: update,	width:530,init:initDialog,
	title:'修改人员的评分结果',close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/speechscoreresultAction!deleteSpeechScoreResult.ajax', {resultId:row.resultId}, function(){
			reloadGrid();
		});
	});
	
}
function aduit(){
	var speechType=$('#speechType').val();
	var resultIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'resultId' });
    if (!resultIds) return;
   	var resultAduitIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'resultAduitId' });
   	  for(var i=0;i<resultAduitIds.length;i++){
   		if(parseInt(resultAduitIds[i])>0 ){
   		Public.tip('选中人员中存在评分结果已审核的人员!');
   			return false;
   		}
    }
   	
   	$('#submitForm').ajaxSubmit({url: web_app.name + '/speechscoreresultAction!insertSpeechScoreResultAduit.ajax',
		param:{resultIds:$.toJSON(resultIds),speechType:speechType},
		success : function(data) {
			refreshFlag = true;
			reloadGrid();
			UICtrl.closeAndReloadTabs("TaskCenter", null);
	
		}
	});
 
    
}
//新增保存
function insert() {
	
	var resultId=$('#resultId').val();
	if(resultId!='') return update();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/speechscoreresultAction!insertSpeechScoreResult.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#resultId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/speechscoreresultAction!updateSpeechScoreResult.ajax',
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

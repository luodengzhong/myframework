
var gridManager = null, refreshFlag = false, specialOrganFullId=null;
var staffingLevelData=null ,wageAffiliationData=null,costExpenseOrganData=null;
$(document).ready(function() {
	$('#HRSpecialRecruitApplyFileList').fileList();
	staffingLevelData=$('#mainStaffingLevel').combox('getJSONData');
	wageAffiliationData=$('#mainWageAffiliation').combox('getJSONData');
	costExpenseOrganData=$('#mainCostExpenseOrgan').combox('getJSONData');
	initializeGrid();
});


function getId() {
	return $("#applyId").val() || 0;
}

function setId(value){
	$("#applyId").val(value);
	gridManager.options.parms['applyId'] =value;
    $('#HRSpecialRecruitApplyFileList').fileList({bizId:value});
}

function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}


//初始化表格
function initializeGrid() {
	var applyId=$('#applyId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "招聘单位", name: "specialOrganName", width: 130, minWidth: 60, type: "string", align: "left" ,
		editor: { type: 'tree', required: true,data:{name : 'org',hasSearch:false,width:250,filter:'ogn',getParam:function(rowData){
			return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn')"};
		}
		},
		textField:'specialOrganName',valueField:'specialOrganId'}},  
		
		{ display: "招聘部门", name: "specialDeptName", width: 130, minWidth: 60, type: "string", align: "left",
		editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'dpt',getParam:function(rowData){
			var ognId=rowData.specialOrganId||'';
			root='orgRoot';
			if(ognId!=''){
			   root=ognId;
			}
			return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in ('ogn','dpt')"};
		}},textField:'specialDeptName',valueField:'specialDeptId'}},		   
		{ display: "招聘岗位", name: "specialPosName", width: 130, minWidth: 60, type: "string", align: "left" ,
		editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'pos',getParam:function(rowData){
			var ognId=rowData.specialOrganId||'';
			var deptId=rowData.specialDeptId||'';
			root='orgRoot';
			if(ognId!=''){
			   root=ognId;
			}
			if(deptId!=''){
			   root=deptId;
			}
			return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in ('ogn','dpt','pos')"};
		}},textField:'specialPosName',valueField:'specialPosId'}},		   
		{ display: "到岗时间", name: "workDate", width: 110, minWidth: 60, type: "date", align: "left" ,
		  editor : {
		 	    type : 'date',
				required : false
			}
		 },		   
		{ display: "编制类别", name: "staffingLevel", width: 130, minWidth: 60, type: "string", align: "left",
		 editor: { type:'combobox',data:staffingLevelData,onChange:function(data,editParm){
		       var ognId=data.record.specialOrganId;
		       if(data.value&&ognId!=''){
		       	var url=web_app.name+'/hRPersonnelQuotaAction!queryOrganNumberByIDAndType.ajax';
				Public.ajax(url,{ognId:ognId,fullId:specialOrganFullId,staffingLevel:data.value},function(m){
				       if(m){
				       	data.record.orgNumOld=m.orgNumOld;
				       	data.record.existNum=m.existNum;
				       }
				});
		       }
		 }
		 },
		 render: function (item) { 
			return staffingLevelData[item.staffingLevel];
		}
		},	
		{ display: "原定员人数", name: "orgNumOld", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "已有人数", name: "existNum", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "新增人数", name: "addNum", width: 100, minWidth: 60, type: "string", align: "left",
		editor:{type: 'text',required:true,mask:'nnnnn'}},		   
		{ display: "增加费用类型", name: "wageAffiliation", width: 100, minWidth: 60, type: "string", align: "left",
		 editor: { type:'combobox',data:wageAffiliationData,required : true},
		 render: function (item) { 
			return wageAffiliationData[item.wageAffiliation];
		}
		},		   
		{ display: "费用列支单位", name: "costExpenseOrgan", width: 180, minWidth: 60, type: "string", align: "left" ,
		 editor: { type:'combobox',data:costExpenseOrganData,required : true},
		 render: function (item) { 
			return costExpenseOrganData[item.costExpenseOrgan];
		}},		   
		{ display: "增加费用（万元）", name: "costAmount", width: 100, minWidth: 60, type: "string", align: "left",
		editor:{type: 'text',required:false,mask:'nnnnn.nn'}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/specialRecruitApplyAction!slicedQuerySpecialRecruitApplyDeta.ajax',
		parms: {applyId: applyId,pagesize:200},
		pageSize : 200,
		usePager: false,
		enabledEdit: true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'specialOrganName',
		sortOrder:'asc',
		addAutoRowByKeydown:false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onBeforeEdit:function(editParm){
			var c=editParm.column;
			if(c.name=='costAmount'){//如果选择胡是城市公司 不能编辑
			   if(editParm.record['costExpenseOrgan']==1){
			   	return false;
			   }else{
			   	return true;
			   }
			}
			return true;
		},
		 onLoadData :function(){
			return !($('#applyId').val()=='');
		}
		
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
	 UICtrl.addGridRow(gridManager);
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/specialRecruitApplyAction!showUpdateSpecialRecruitApply.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	
	DataUtil.delSelectedRows({action:'specialRecruitApplyAction!deleteSpecialRecruitApplyDeta.ajax',
		gridManager:gridManager,idFieldName:'applyDetaId',
		onSuccess:function(){
			reloadGrid();	
		}
	});

	/*
	DataUtil.del({action:'specialRecruitApplyAction!deleteSpecialRecruitApply.ajax',
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
	$('#submitForm').ajaxSubmit({url: web_app.name + '/specialRecruitApplyAction!insertSpecialRecruitApply.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/specialRecruitApplyAction!updateSpecialRecruitApply.ajax',
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
	var action = "specialRecruitApplyAction!updateSpecialRecruitApplySequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'specialRecruitApplyAction!updateSpecialRecruitApplyStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'specialRecruitApplyAction!updateSpecialRecruitApplyStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/

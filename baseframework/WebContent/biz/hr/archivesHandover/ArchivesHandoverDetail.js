var gridManager = null, refreshFlag = false, toolbarOptions=null ;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	//审核环节
	var procUnitId=$('#procUnitId').val();
	if(procUnitId=='Apply'){
		initUI();
	}else{
		showButton()
		setEditAble();
	}
});

function initUI(){
	$('#print,#print_line').hide();
	$('#taskCollect,#taskCollect_line').hide();
	$('#save,#save_line').hide();
}

function showButton(){
	$('#back,#back_line').hide();
	$('#assist,#assist_line').hide();
	$('#print,#print_line').hide();
}

function setEditAble(){
		permissionAuthority['maingrid.desption']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.receivingNameSign']={authority:'readwrite',type:'1'};
}
//初始化表格
function initializeGrid() {
	var personMemberName=$('#personMemberName').val();
	var fillinDate=$('#fillinDate').val();
	var receivingArchivesId=$('#receivingArchivesId').val();
	var taskId=$('#taskId').val();
	if(taskId>0){
	 toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		signArchivesHandoverHandler: {id:'signArchivesHandover',text:'签字确认',img:'page_settings.gif',click:function(){
				signArchivesHandover();
			}
		}
	});
	}else{
	 toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
		UICtrl.addGridRow(gridManager);
		},
		deleteHandler: deleteHandler
	});
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "移交人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "交接时间", name: "handOverTime", width: 120, minWidth: 60, type: "string", align: "left"},		   
		{ display: "交接档案员工姓名", name: "handStaffName", width: 150, minWidth: 60, type: "string", align: "left",
		editor : {
						type : 'select',
						required : true,
						data : {
							type : "hr",
							name : "resignationChoosePerson",
							back : {
								staffName : "handStaffName",
								archivesId : "handArchivesId"
							}
						}
					}},		   
		{ display: "接收人", name: "receivingStaffName", width: 150, minWidth: 60, type: "string", align: "left",
		 editor : {
						type : 'select',
						required : true,
						data : {
							type : "hr",
							name : "resignationChoosePerson",
							back : {
								staffName : "receivingStaffName",
								archivesId : "receivingArchivesId",
								ognName:"receivingOgnName",
								ognId:"receivingOgnId"
							}
						}
					}},	
		{ display: "接收单位", name: "receivingOgnName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "资料完备情况", name: "desption", width: 270, minWidth: 60, type: "string", align: "left"},		   
		{ display: "接收人签名", name: "receivingNameSign", width: 150, minWidth: 60, type: "string", align: "left"}	   
		],
		dataAction : 'server',
		url: web_app.name+'/archivesHandoverAction!slicedQueryArchivesHandoverDetail.ajax',
		parms:{handoverId:$('#handoverId').val(),receivingArchivesId:receivingArchivesId},
		enabledEdit : true,
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'handOverTime',
		sortOrder:'desc',
		autoAddRow:{personMemberName:personMemberName,handOverTime:fillinDate},
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#handoverId').val()=='');
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


//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'archivesHandoverAction!deleteArchivesHandoverDetail.ajax',
		gridManager:gridManager,idFieldName:'handoverDetailId',
		onSuccess:function(){
			reloadGrid();	
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


function save(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	$('#submitForm').ajaxSubmit({url: web_app.name + '/archivesHandoverAction!save.ajax',
	    param:{detailData:$.toJSON(extendedData)},
		success : function(data) {
			setId(data);
			refreshFlag = true;
		}
	});
}

function setId(data){
	 $('#handoverId').val(data);
	 gridManager.options.parms['handoverId'] =data;
}

function getId() {
	return $("#handoverId").val() || 0;
}

/*
function abort(){
	var taskId=$('#taskId').val();
	var handoverId=$('#taskId').val();
}*/
function advance(){
	var taskId=$('#taskId').val();
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	$('#submitForm').ajaxSubmit({url: web_app.name + '/archivesHandoverAction!advance.ajax',
	    param:{detailData:$.toJSON(extendedData),taskId:taskId},
		success : function(data) {
				setId(data);
				UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
}

function  signArchivesHandover(){
        var row = gridManager.getSelectedRow();
        var handoverDetailId=row.handoverDetailId;
		if (!row) {Public.tip('请选择数据！'); return; }    
	    UICtrl.showAjaxDialog({url: web_app.name + '/archivesHandoverAction!showUpdateArchivesHandoverDetail.load', 
	    param:{handoverDetailId:handoverDetailId}, width:400,title:'确认接收档案',ok: update, close: dialogClose});
}

function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/archivesHandoverAction!updateArchivesHandoverDetail.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

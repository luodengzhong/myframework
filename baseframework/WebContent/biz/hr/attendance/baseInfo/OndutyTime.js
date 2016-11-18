var gridManager = null, yesOrNo = {0:'否', 1:'是'},refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
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
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='';
	if(data){
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>上班时间列表');
		//鉴权通过后才能执行
		Public.authenticationManageType('hrBaseAttManage',data.fullId,function(flag){
			if(flag){
				$('#mainOrganId').val(organId);
				$('#mainOrganName').val(name);
				$('.l-layout-center .l-layout-header').html(html.join(''));
				UICtrl.gridSearch(gridManager,{organId:organId});
			}
		});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		//saveHandler:saveHandler,
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "开始日期", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'date',required:true} },		   
		{ display: "结束日期", name: "endDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'date',required:true}},		   
		{ display: "上午上班时间", name: "amStartTime", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true, mask: "nn:nn"}},		   
		{ display: "上午下班时间", name: "amEndTime", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true, mask: "nn:nn"} },		   
		{ display: "上午下班记考勤", name: "amEndCheck", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'combobox',data: yesOrNo},
				render: function (item) { 
					return yesOrNo[item.amEndCheck];
				} },		   
		{ display: "分隔点", name: "compartTime", width: 100, minWidth: 60, type: "string", align: "left",
					editor: { type: 'text',required:true, mask: "nn:nn"}},		   
		{ display: "下午上班记考勤", name: "pmStartCheck", width: 100, minWidth: 60, type: "string", align: "left",
						editor: { type: 'combobox',data: yesOrNo},
						render: function (item) { 
							return yesOrNo[item.pmStartCheck];
						}},		   
		{ display: "下午上班时间", name: "pmStartTime", width: 100, minWidth: 60, type: "string", align: "left",
							editor: { type: 'text',required:true, mask: "nn:nn"}},		   
		{ display: "下午下班时间", name: "pmEndTime", width: 100, minWidth: 60, type: "string", align: "left" ,
								editor: { type: 'text',required:true, mask: "nn:nn"}},		   
		{ display: "工作时间", name: "workingHour", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true}}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryOndutyTime.ajax',
		parms:{year: getYear()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'startDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: false,
		checkbox: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.ondutyTimeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function getYear(){
	return $('#year').val();
}

function getOrganName(){
	return $("#mainOrganName").val();
}
function getOrganId(){
	return $("#mainOrganId").val();
}
function query(obj) {
	if(getOrganId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

/*function addHandler() {
	if(getOrganId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	UICtrl.addGridRow(gridManager,{year: getYear(),organId:getOrganId(),organName: getOrganName() });
}*/
var ondutyTimeTmpId = '';
//添加按钮 
function addHandler() {
	ondutyTimeTmpId = '';
	if(getOrganId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardOndutyTimeDetail.load',
		param:{year: getYear(),organId:getOrganId(),organName: getOrganName()},
		title:'新增上班时间设置',ok: insert,
		close: dialogClose,width:610
	});
}

function insert(){
	if(ondutyTimeTmpId==''){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!insertOndutyTime.ajax',
			success : function(data) {
				ondutyTimeTmpId = data;
				$('#ondutyTimeId').val(ondutyTimeTmpId);
				refreshFlag = true;
			}
		});
	}
	else{
		update();
	}
}

function updateHandler(id){
	var ondutyTimeId="";
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		ondutyTimeId=row.ondutyTimeId;
	}else{
		ondutyTimeId=id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/attBaseInfoAction!forwardOndutyTimeDetail.load', 
			param:{ondutyTimeId:ondutyTimeId},
			title:'修改上班时间设置',ok:update,
			close: dialogClose,width:610});
}

function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!updateOndutyTime.ajax',
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

function saveHandler(){
	var detailData = DataUtil.getGridData({gridManager:gridManager});
	if(!detailData || detailData.length == 0) return false;
	Public.ajax(web_app.name +'/attBaseInfoAction!saveOrUpdateOndutyTime.ajax',
		{
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadGrid();
		}
	);
}

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deleteOndutyTime.ajax', 
		gridManager: gridManager, idFieldName: 'ondutyTimeId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}



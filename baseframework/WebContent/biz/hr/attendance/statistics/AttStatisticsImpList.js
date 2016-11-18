var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#year').val(new Date().getFullYear());
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
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
		onClick : onFolderTreeNodeClick
	});
	PayPublic.initPeriodSearchbox();
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('考勤结果导入明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>考勤结果导入明细');
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
		addHandler: addHandler,
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
					{ display: "姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "left",frozen: true },
					{ display: "期间", name: "periodName", width: 200, minWidth: 80, type: "string", align: "left",frozen: true },
					{ display: "未打卡次数", name: "withoutCard", width: 80, minWidth: 80, type: "string", align: "center" },	
					{ display: "打卡异常次数", name: "exceptionNumber", width:80, minWidth: 80, type: "string", align: "center" },	
					{ display: "病假天数", name: "sickLeave", width: 80, minWidth: 80, type: "string", align: "center" },
					{ display: "事假天数", name: "personalAffair", width: 80, minWidth: 80, type: "string", align: "center" },
					{ display: "工伤假天数", name: "industrialInjury", width: 80, minWidth: 80, type: "string", align: "center" },
					{ display: "产检假天数", name: "prenatalLeave", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "产假天数", name: "maternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "婚假天数", name: "marriageLeave", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "丧假天数", name: "funeralLeave", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "年休假天数", name: "annualLeave", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "考试假天数", name: "examination", width: 80, minWidth: 80, type: "string", align: "center"},
					{ display: "陪产假天数", name: "accompanyMaternityleave", width: 80, minWidth: 80, type: "string", align: "center"},
			  		{ display: "周末加班天数", name: "weekendOvertime", width: 150, minWidth: 150, type: "string", align: "center" },		   
					{ display: "节假日加班天数", name: "holidayOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
					//{ display: "一般加班天数", name: "commonOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
					{ display: "驾驶员晚上", name: "driverNight", width: 150, minWidth: 150, type: "string", align: "center" },
					{ display: "驾驶员夜班车", name: "driverNightBus", width: 150, minWidth: 150, type: "string", align: "center" },
					{ display: "延时加班（小时）", name: "delayOvertime", width: 150, minWidth: 150, type: "string", align: "center" },
					{ display: "食堂员工加班", name: "canteenStaff", width: 150, minWidth: 150, type: "string", align: "center" },
					{ display: "搬运工加班", name: "porterOvertime", width: 150, minWidth: 150, type: "string", align: "center" },
					{ display: "迟到次数（15分钟内）", name: "late15", width: 80, minWidth: 80, type: "string", align: "center",sortField:'late_15' },
					{ display: "迟到次数（16－30分钟）", name: "late1630", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_16_30' },
					{ display: "迟到次数（31－60分钟）", name: "late3160", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_31_60'},
					{ display: "迟到次数（60分钟以上）", name: "late61", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_61'},
					{ display: "早退次数（15分钟内）", name: "leaveEarly15", width: 150, minWidth: 150, type: "string", align: "center",sortField:'leave_early_15'},
					{ display: "早退次数（16－30分钟）", name: "leaveEarly1630", width: 150, minWidth: 80, type: "string", align: "center",sortField:'leave_early_16_30'},
					{ display: "早退次数（31－60分钟）", name: "leaveEarly3160", width: 150, minWidth: 80, type: "string", align: "center",sortField:'leave_early_31_60' },	
					{ display: "早退次数（60分钟以上）", name: "leaveEarly61", width: 150, minWidth: 150, type: "string", align: "center",sortField:'leave_early_61' },
					{ display: "出勤天数", name: "attendance", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryAttStatImp.ajax',
		manageType:'hrBaseAttManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
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
	onFolderTreeNodeClick();
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/attStatisticsAction!showAddAttStatImp.load', ok: insert,width:820,init:onDialogInit, close: dialogClose});
}


//编辑按钮
function updateHandler(id){
	var row = null;
	if(!id){
		row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/attStatisticsAction!showUpdateAttStatImp.load',
		param:{statisticsImpId:row.statisticsImpId}, 
		ok: update,
		width:820,
		init:onDialogInit,
		close: dialogClose
	});
}
function onDialogInit(doc){
	$('#detailStaffName').searchbox({
		type:'hr',name:'personArchiveSelect',manageType:'hrBaseAttManage',
		back:{archivesId:'#detailArchiviesId',staffName:'#detailStaffName',ognId:'#detailOrganId',ognName:'#detailOrganName'}
	});
	/*$('#detailPeriodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		var year = new Date().getFullYear();
		return {paramValue:year};
	},back:{periodId:'#detailPeriodId',yearPeriodName:'#detailPeriodName'}});*/
	$('#yearDetail').spinner({countWidth:80}).mask('nnnn');
	$('#yearDetail').val($('#year').val());
	var detailPeriodName=$('#periodName',doc);
	detailPeriodName.searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#yearDetail').val(),organId:$('#organId').val()};
	},back:{periodId:'#detailPeriodId',yearPeriodName:detailPeriodName}});
}
//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/attStatisticsAction!deleteAttStatImp.ajax', {statisticsImpId:row.statisticsImpId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	var _self=this;
	var id=$('#statisticsImpId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attStatisticsAction!insertAttStatImp.ajax',
		success : function(data) {
			//$('#statisticsImpId').val(data);
			_self.close();
			reloadGrid();
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attStatisticsAction!updateAttStatImp.ajax',
		success : function() {
			_self.close();
			reloadGrid();
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
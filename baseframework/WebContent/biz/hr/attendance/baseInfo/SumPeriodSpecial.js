var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseZKAtt',
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
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
	//$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',
	//	back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
}

function onFolderTreeNodeClick(data) {
	var html=[],id='',name='',orgKindId='',fullName='';
	if(!data){
		html.push('班次信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullName=data.fullName;
		$('#positionName').val(name);
		if(orgKindId=="pos"){//显示岗位上班天数信息
			$('#positionId').val(id);
		}
		else if(orgKindId=="dpt"){//显示部门上班天数信息
			$('#positionId').val(id);
		}
		else if(orgKindId=="ogn"){//显示机构上班天数信息
			$('#positionId').val(id);
		}
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>期间特殊情况设置');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			var positionId = getPositionId();
			if(positionId==""){
				Public.tip("请选择组织");
				return;
			}
			var periodId = getPeriodId();
			if(periodId==""){
				Public.tip("请选择期间");
				return;
			}
			var attendanceCount = 0;
			var overtimeLimit = 0;
			//获取出勤天数及加班上限
			Public.syncAjax(web_app.name+'/attBaseInfoAction!getPeriodOnduty.ajax', 
					{positionId:positionId,periodId:periodId},
					function(data){
					if(data.attendanceCount==undefined){
						UICtrl.alert("该期间上班天数还未设置！");
						return;
					}
					else{
						attendanceCount = data.attendanceCount;
						overtimeLimit = data.overtimeLimit;
					}
			});
			if(attendanceCount==""||attendanceCount==0){
				UICtrl.alert("该期间上班天数还未设置！");
				return;
			}
			showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{personId:o['personId'],personName:o['name'],status:'0',
						attendanceCount:attendanceCount,overtimeLimit:overtimeLimit,
						positionId:positionId,periodId:periodId,sickLeave:0,personalAffair:0,
						maternityLeave:0,marriageLeave:0,funeralLeave:0,annualLeave:0,
						examination:0,accompanyMaternityLeave:0,swapRest:0});
					addRows.push(row);
				});
				gridManager.addRows(addRows);
			});
		}, 
		saveHandler: saveHandler,
		deleteHandler: deleteHandler,
		addBatchHandler:addBatchHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:  [	  
		    { display: "人员名称", name: "personName", width: 120, minWidth: 60, type: "string", align: "left",frozen: true},	
		    { display: "年假共计", name: "totalYearLeave", isSort:false, width: 60, minWidth: 60, type: "string", align: "left",frozen: true},
		    { display: "年假结余(不含本次)", name: "balance", isSort:false, width: 60, minWidth: 60, type: "string", align: "left",frozen: true},
		    { display: "上上月加班结余", name: "llastMonthBalance", isSort:false, width: 80, minWidth: 60, type: "string", align: "left",frozen: true},
		    { display: "上月加班结余", name: "lastMonthBalance", isSort:false, width: 80, minWidth: 60, type: "string", align: "left",frozen: true},
			{ display: "出勤天数", name: "attendanceCount", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn',required:true}},		   
			{ display: "加班上限", name: "overtimeLimit", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn',required:false}},
		   	{ display: "病假天数", name: "sickLeave", width: 60, minWidth: 60, type: "string", align: "left",
		   		editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "事假天数", name: "personalAffair", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "产假天数", name: "maternityLeave", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "婚假天数", name: "marriageLeave", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "丧假天数", name: "funeralLeave", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "年假天数", name: "annualLeave", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "考试假天数", name: "examination", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "陪产假天数", name: "accompanyMaternityLeave", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}},		   
			{ display: "换休天数", name: "swapRest", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',mask:'nn.n',required:false}}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQuerySumPeriodSpecial.ajax',
		parms: {positionId:getPositionId(),periodId:getPeriodId()},
		pageSize : 20,
		delayLoad:true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'personId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData: function(){
			return (getPositionId()!="");
		},
		onBeforeEdit:function(editParm){
			var status = editParm.record['status'];
			//期间工资已结算，不允许修改
			if(status=='1'){
				return false;
			}
			return true;
		},
		onAfterEdit:function(editParm){
			var balance = editParm.record['balance'];
			var annualLeave = editParm.record['annualLeave'];
			//请假最小单位半天，转浮点不存在误差
			if(parseFloat(annualLeave)>parseFloat(balance)){//校验年假
				UICtrl.alert("年假天数不能大于年假结余！");
				this.updateCell("annualLeave", "0", editParm.record);
				return false;
			}
			var llastMonthBalance = editParm.record['llastMonthBalance'];
			var lastMonthBalance = editParm.record['lastMonthBalance'];
			var swapRest = editParm.record['swapRest'];
			if(parseFloat(swapRest)>(parseFloat(llastMonthBalance)+parseFloat(lastMonthBalance))){//校验换休
				UICtrl.alert("换休天数不能大于前两月结余数！");
				this.updateCell("swapRest", "0", editParm.record);
				return false;
			}
			return true;
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function getPositionName(){
	return $("#positionName").val();
}

function getPeriodId(){
	return $("#periodId").val();
}

function getPositionId(){
	return $("#positionId").val();
}

function getAttendanceCount(){
	return $("#attendanceCount").val();
}

function getOvertimeLimit(){
	return $("#overtimeLimit").val();
}

// 查询
function query(obj) {
	var positionId = getPositionId();
	if(positionId==""){
		Public.tip("请选择左侧的组织");
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//查询
function refreshGrid(){
	var obj = $("#queryMainForm");
	query(obj);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function saveHandler(){
	var detailData = DataUtil.getGridData({gridManager:gridManager});
	if(!detailData || detailData.length == 0) return false;
	Public.ajax(web_app.name +'/attBaseInfoAction!saveSumPeriodSpecial.ajax',
		{
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadGrid();
		}
	);
}

function addBatchHandler(){
	var positionId = getPositionId();
	if(positionId==""){
		Public.tip("请选择组织");
		return;
	}
	var periodId = getPeriodId();
	if(periodId==""){
		Public.tip("请选择期间");
		return;
	}
	//初始化岗位出勤天数及加班上限
	Public.ajax(web_app.name+'/attBaseInfoAction!initPeriodPositionPsm.ajax', 
			{positionId:positionId,periodId:periodId},
			function(data){
				reloadGrid();
			});
}

//删除按钮
function deleteHandler(){
	var rows = gridManager.getSelectedRows();
	if (rows.length==0) {Public.tip('请选择数据！'); return; }
	var status = 0;
	for(var i=0;i<rows.length;i++){
		status = rows[i].status;
		if(status=="1"){
			break;
		}
	}
	if(status=="1"){
		Public.tip('期间已经结算数据，不允许删除！'); return;
	}
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deleteSumPeriodSpecial.ajax', 
		gridManager: gridManager, idFieldName: 'attSumPeriodSpecialId',
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

//打开机构选择对话框
function showChooseOrgDialog(fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}
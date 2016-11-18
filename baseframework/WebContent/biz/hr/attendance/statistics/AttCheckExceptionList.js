var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
});

//初始化表格
function initializeGrid() {
	var toolbarButton={};
	toolbarButton['leaveHandler']={id:'attLeave',text:'请假',img:'page_boy.gif',click:function(){ 
		leave();
	}};
	/*toolbarButton['overtimeHandler']={id:'attOvertime',text:'加班',img:'page_extension.gif',click:function(){ 
		overtime();
	}};*/
	toolbarButton['businessTripHandler']={id:'attBusinessTrip',text:'出差',img:'page_right.gif',click:function(){
		businessTrip();
	}};
	toolbarButton['egressHandler']={id:'attEgress',text:'公出',img:'page_up.gif',click:function(){
		egress();
	}};
	toolbarButton['notCardHandler']={id:'attNotCard',text:'未打卡',img:'page_key.gif',click:function(){
		notCard();
	}};
	toolbarButton['busLateHandler']={id:'busLateHandler',text:'大巴车迟到',img:'page_boy.gif',click:function(){
		busLateHandler();
	}};
	var toolbarOptions = UICtrl.getDefaultToolbarOptions(
			toolbarButton);
	var columns=[
	    { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" }   
	];
	var amColumns={display: '上班', columns:[]};
	amColumns.columns.push({ display: "上班时间", name: "amStartTime", width: 130, minWidth: 100, type: "datetime", align: "center" });
	amColumns.columns.push({ display: "打卡时间", name: "amCheckTime", width: 130, minWidth: 100, type: "datetime", align: "center" });
	amColumns.columns.push({ display: "打卡状态", name: "amStatus", width: 160, minWidth: 100, type: "string", align: "center" });	
	columns.push(amColumns);
	var pmColumns={display: '下班', columns:[]};
	pmColumns.columns.push({ display: "下班时间", name: "pmEndTime", width: 130, minWidth: 100, type: "datetime", align: "center" });
	pmColumns.columns.push({ display: "打卡时间", name: "pmCheckTime", width: 130, minWidth: 100, type: "datetime", align: "center" });
	pmColumns.columns.push({ display: "打卡状态", name: "pmStatus", width: 160, minWidth: 100, type: "string", align: "center" });	
	columns.push(pmColumns);
	columns.push({ display: "打卡详情", name: "", width: 100, minWidth: 60, type: "string", align: "center",
		render: function(item) {
		var html=['<a href="javascript:void(null);" class="GridStyle" onclick="showChkInfo(\''];
		html.push(item.workDate,'\',\'',item.personId,'\')">','考勤记录','</a>');
		return html.join('');
	} });
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns, 
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOwenAttCheckExceptions.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		delayLoad:true,
		enabledEdit: true,
		sortName:'amStartTime',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#periodId').val()=='');
		},
		onSuccess:function(data){
			if(data){
				var total=parseInt(data['Total'],0);
				if(total===0){
					Public.tips({type:0, content:'无考勤异常!',time:5000});
				}
			}
		}
	});
}

function showChkInfo(workDate,personId){
	UICtrl.showFrameDialog({
		url : web_app.name + '/attStatisticsAction!forwardChkDetail.do',
		param:{workDate:workDate,personId:personId},
		title : "["+workDate+"]打卡详细信息",
		width : 600,
		height : 320,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}

function hidePopup(){ 
	var popUp = document.getElementById("popupcontent"); 
	popUp.style.visibility = "hidden";
}

function leave(){
	parent.addTabItem({ 
		tabid: 'HRLeaveApply',
		text: '请假申请 ',
		url: web_app.name + '/attLeaveAction!forwardLeaveApply.job'
		}); 
}
function overtime(){
	parent.addTabItem({ 
		tabid: 'HROvertimeApply',
		text: '出差申请 ',
		url: web_app.name + '/attOvertimeAction!forwardOvertimeApply.job'
		}); 
}
function businessTrip(){
	parent.addTabItem({ 
		tabid: 'HRBusinessTripApply',
		text: '出差申请 ',
		url: web_app.name + '/attBusinessTripAction!forwardBusinessTripApply.job'
		}); 
}
function egress(){
	parent.addTabItem({ 
		tabid: 'HREgressApply',
		text: '公出申请 ',
		url: web_app.name + '/attEgressAction!forwardEgressApply.job'
		}); 
}
function notCard(){
	parent.addTabItem({ 
		tabid: 'HRNotCardApply',
		text: '未打卡 ',
		url: web_app.name + '/attNotCardCertificateAction!forwardNotCardCertificateApply.job'
		}); 
}

function busLateHandler(){
	parent.addTabItem({ 
		tabid: 'HRBusLateApply',
		text: '大巴车迟到 ',
		url: web_app.name + '/attNotCardCertificateAction!forwardNotCardCertificateApply.job?isBusLateFlag=true'
	}); 
}

// 查询
function query(obj) {
	var periodId =  $("#periodId").val();
	if(!periodId){
		Public.tip('请选择期间');	
		return;
	}
	Public.ajax(web_app.name + '/attStatisticsAction!saveOwnAttCheckException.ajax', {periodId:periodId}, function(){
		UICtrl.gridSearch(gridManager, {ownerPeriodId:periodId});
	});
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}



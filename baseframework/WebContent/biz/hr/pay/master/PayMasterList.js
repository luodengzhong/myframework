var gridManager = null, refreshFlag = false;
var totalFields=[];
var isAuthority=false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	//权限判断
	var fields=UICtrl.getPermissionField('noaccess',0);
	isAuthority=$.inArray('payItemDefine',fields)>-1;
	initializeUI();
	var mainId=$('#mainId').val();
	if(mainId==''){//申请环节不需要验证密码
		PersonalPasswordAuth.isAuthenticationPassword=true;
	}else{
		doPersonalPasswordAuth(true);
	}
});
function doPersonalPasswordAuth(flag){
	PersonalPasswordAuth.showDialog({
		checkTimeLimit:flag,
		okFun:function(){
			this.close();
			PersonalPasswordAuth.isAuthenticationPassword=true;
			if(gridManager){
				reloadGrid();
			}
		},
		closeFun:function(){
			this.close();
		}
	});
}
function initializeUI(){
	var columns=[
	    { display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" ,exportAble:false,frozen: true,totalSummary:{
	    	render: function (suminf, column, data){
        		return '合 计:';
			},
			align: 'center'
	    }},
	    { display: "工资主体单位", name: "orgUnitName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true},
	    { display: "工资归属单位", name: "registrationName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true},
	    { display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true},
	    { display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
	    //{ display: "部门", name: "deptName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },
	    //{ display: "层级", name: "posTierTextView", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "行政级别", name: "posLevelTextView", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "姓名", name: "archivesName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true ,
	    	render: function (item){
	    		return '<a href="javascript:showArchiveInfo('+item.archivesId+');" class="GridStyle">' + item.archivesName + '</a>';
			}
	    },
	    { display: "岗位", name: "posName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "工资费用归属", name: "wageAffiliationTextView", width: 90, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "工资类别", name: "wageKindTextView", width:120, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "证件号", name: "idCardNo", width: 140, minWidth: 60, type: "string", align: "left" }
	];
	Public.ajax(web_app.name + '/paymasterAction!queryPayItems.ajax', {isAuthority:isAuthority,id:$('#mainId').val()}, function(data) {
		var totalSummary=null,payItemKind=null,render=null;
		$.each(data,function(i,o){
			totalSummary=null;
			if(parseInt(o.isTotal,10)==1){
				totalFields.push(o.name);
				totalSummary=UICtrl.getTotalSummary();
			}
			render=null;
			payItemKind=parseInt(o.payItemKind,10);
			if(payItemKind<5){
				render=function(item){
						return '<a href="javascript:showPayDetail('+item.periodId+','+item.archivesId+',\''+o.name+'\',\''+o.display+'\');" class="GridStyle">' + Public.currency(item[o.name]) + '</a>';
				};
			}
			columns.push({ 
				display: o.display, name: o.name,
				width: 100, minWidth: 60,
				type: "money", align: "right",
				render:render,totalSummary:totalSummary
			});
		});
		initializeGrid(columns);
	});
}

//初始化表格
function initializeGrid(columns) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveEvaluatePayItem:{id:'saveEvaluatePayItem',text:'重算',img:'page_refresh.gif',click:function(){
			Public.ajax(web_app.name + "/paymasterAction!saveEvaluatePayItem.ajax",{id:$('#mainId').val()},function(){
				reloadGrid();
			});
		}},
		exportExcelHandler:{id:'exportExcelHandler',text:'导出',img:'page_down.gif',click:function(){
			if(!PersonalPasswordAuth.isAuthenticationPassword){
				return false;
			}
			UICtrl.gridExport(gridManager);
		}},
		/*saveImportExcelHandler:{
			id:'saveImportExcelHandler',text:'导入',img:'page_up.gif',click:function(){
				$.uploadDialog({
					backurl:'paymasterAction!importPayAttachment.ajax'
				});
			}
		},*/
		showEexceptionRecord:{id:'showEexceptionRecord',text:'扣款异常数据',img:'page_deny.gif',click:function(){
			UICtrl.gridSearch(gridManager, {archivesName:'',rexceptionRecord:'1'});
		}},
		showAllRecord:{id:'showAllRecord',text:'全部数据',img:'page_tree.gif',click:function(){
			UICtrl.gridSearch(gridManager, {archivesName:'',rexceptionRecord:''});
		}},
		showNotExistsPerson:{id:'showNotExistsPerson',text:'本次未发工资人员',img:'page_find.gif',click:function(){
			showNotExistsPerson();
		}},
		showPassword:{id:'showPassword',text:'密码',img:'page_key.gif',click:function(){
			doPersonalPasswordAuth(false);
		}},
		showStatisticsQuery:{id:'showStatisticsQuery',text:'汇总数据',img:'page_find.gif',click:function(){
			statisticsQuery();
		}},
		showImpHandler:{id:'showImpHandler',text:'导入Excel',img:'page_up.gif',click:function(){
			impHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/paymasterAction!slicedPaymasterQuery.ajax',
		parms:{serialId:$('#mainId').val(),totalFields:totalFields.join(',')},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			if(!getId()){
				return false;
			}
			return PersonalPasswordAuth.isAuthenticationPassword;
		}
	});
	UICtrl.createGridQueryBtn('#maingrid','div.l-panel-topbar',function(param){
		UICtrl.gridSearch(gridManager, {archivesName:encodeURI(param)});
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
//查看工资明细
function showPayDetail(periodId,archivesId,operationCode,display){
	UICtrl.showFrameDialog({
		title:'['+display+']详细',
		url: web_app.name + '/paymasterAction!forwardPaydetailList.do', 
		param:{periodId:periodId,archivesId:archivesId,operationCode:operationCode,serialId:$('#mainId').val()},
		height:320,
		width:getDefaultDialogWidth(),
		resize:true,
		ok:false,
		cancel:true
	});
}
function showArchiveInfo(archivesId){
	//var url=web_app.name + '/hrArchivesAction!showUpdate.do?archivesId='+archivesId;
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesAdd'+archivesId, text: '员工档案 ', url:url});
}
function getId(){
	return $('#mainId').val();
}
function showNotExistsPerson(){
	var payMainId=$('#mainId').val();
	var orgnId=$('#organId').val();
	UICtrl.showFrameDialog({
		url :web_app.name + "/biz/hr/pay/master/notExistsPerson.jsp",
		param : {
			payMainId : payMainId,
			payOrgnId : orgnId
		},
		title : "本次未发工资人员",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}
function statisticsQuery(){
	var periodId=$('#mainPeriodId').val();
	var organId=$('#organId').val();
	var mainId=$('#mainId').val();
	UICtrl.showFrameDialog({
		url: web_app.name + '/paymasterAction!forwardStatisticsQuery.do', 
		param : {
			periodId : periodId,
			organId : organId,
			serialId: mainId 	

		},
		title : "汇总数据",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}

function impHandler(){
	var serialId=getId();
	if(!serialId){
		Public.tip('请先保存主记录！');
		return false;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入工资明细',serialId:serialId,templetCode:'hrPayMasterImp'});
}
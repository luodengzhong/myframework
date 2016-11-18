var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'},positionArray=[];
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	//$('#qperiodName').searchbox({type:'hr',name:'chooseOperationPeriod',
	//	back:{periodId:'#periodId',yearPeriodName:'#qperiodName'}});
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
	$('#positionName').orgTree({manageType:'hrBaseZKAtt',
		param: {searchQueryCondition: "org_kind_id in('ogn','dpt','pos')"},
		back:{			
			text:'#positionName',
			value:'#positionId',
			id:'#positionId',
			name:'#positionName'}});
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
}

function onFolderTreeNodeClick(data) {
	var html=[],id='',name='',orgKindId='',fullName='';
	if(!data){
		html.push('班次信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullName=data.fullName;
		$('#fullId').val(data.fullId);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>期间上班天数设置');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
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
		columns:  [	   
		   	{ display: "期间", name: "periodName", width: 200, minWidth: 160, type: "string", align: "left" },
		   	{ display: "组织全路径", name: "positionName", width: 260, minWidth: 60, type: "string", align: "left" },		   
		   	{ display: "出勤天数", name: "attendanceCount", width: 100, minWidth: 60, type: "string", align: "left" },		   
		   	{ display: "加班上限", name: "overtimeLimit", width: 100, minWidth: 60, type: "string", align: "left" },		   
		   	{ display: "期间是否已经结算", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return yesOrNo[item.status];
			} }
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryPeriodOnduty.ajax',
		parms: {positionId:getPositionId(),periodId:getPeriodId()},
		pageSize : 20,
		//delayLoad:true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'periodBeginDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		/*onLoadData: function(){
			return (getPositionId()!="");
		},*/
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.attPeriodOndutyId,data.status);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function getPositionName(){
	return $("#positionName").val();
}

function getPositionId(){
	return $("#positionId").val();
}

function getPeriodId(){
	return $("#periodId").val();
}

// 查询
function query(obj) {
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

var attPeriodOndutyTmpId = '';
//添加按钮 
function addHandler() {
	clearChooseArray();//清空上次选择的机构
	UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardInsertPeriodOndutyDetail.load',
		title:'新增上班天数信息',ok: insert,init:initDialog,
		close: dialogClose,width:420
	});
	/**/
}

function initDialog(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
}

function insert(){
	if(positionArray.length==0){
		Public.tip("请至少选择一个组织！");
		return false;
	}
	var _self=this;
	var positionIds = new Array();
	var positionNames = new Array();
	$.each(positionArray,function(i,o){
		positionIds.push(o['positionId']);
		positionNames.push(o['fullName']);//存全路径
	});
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!insertPeriodOnduty.ajax',
		param:{positionIds:$.toJSON(positionIds),positionNames:$.toJSON(positionNames)},
		success : function(data) {
			refreshFlag = true;
			_self.close();
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!updatePeriodOnduty.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function updateHandler(id,status){
	var attPeriodOndutyId="";
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		attPeriodOndutyId=row.attPeriodOndutyId;
		status=row.status;
	}else{
		attPeriodOndutyId=id;
	}
	if(status=="1"){
		Public.tip('期间已经结算数据，不允许修改！'); return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/attBaseInfoAction!forwardPeriodOndutyDetail.load', 
			param:{attPeriodOndutyId:attPeriodOndutyId},
			title:'修改上班天数信息',ok:update,init:initDialog,
			close: dialogClose,width:420});
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
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deletePeriodOnduty.ajax', 
		gridManager: gridManager, idFieldName: 'attPeriodOndutyId',
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
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,system';
	var options = { params: selectOrgParams,title : "选择组织",
		parent:window['ajaxDialog'],
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			positionArray.splice(0,positionArray.length);
			$.each(data,function(i,o){
				o['positionId']=o['id'];
				o['positionName']=o['name'];
				positionArray.push(o);
			});
			initShowDivText();
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(positionArray,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

//初始化显示
function initShowDivText(){
	var showDiv=$('#organName');
	var html=new Array();
	$.each(positionArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['name']);
		html.push('</span">;&nbsp;');
	});
	showDiv.html(html.join(''));
}

//清空已选择列表
function clearChooseArray(){
	$('#organName').html('');
	//清空数组
	positionArray.splice(0,positionArray.length);
}
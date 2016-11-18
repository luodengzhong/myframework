var gridManager = null, refreshFlag = false;
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
		manageType:'hrReshuffleManage',
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
	var more=$('#toolbar_menucreateDepartureSettlement').contextMenu({
		width:"120px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"结算全部",icon:'enable',handler:function(){
				createDepartureSettlement('all');
			}},
			{name:"结算30%",icon:'edit',handler:function(){
				createDepartureSettlement('part');
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('离职办理员工');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>离职办理员工');
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
		viewHandler: viewHandler,
		createDepartureSettlement:{id:'createDepartureSettlement',text:'生成离职结算单',img:'page_dynamic.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			   { display: "申请日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "center" },	
			   	{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },		
			   	{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "center" },	
			   	{ display: "离职申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "center" },
			   	{ display: "离职手续办理状态", name: "procesdurestatus", width: 150, minWidth: 60, type: "string", align: "center" },
			   	{ display: "离职结算办理状态", name: "paystatus", width: 120, minWidth: 60, type: "string", align: "center" },
				{ display: "性别", name: "sexTextView", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "center" }

		],
		dataAction : 'server',
		url: web_app.name+'/resignationAction!slicedQueryIsLeavingArchives.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		manageType:'hrReshuffleManage',
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
//type 用于控制是否结算全部工资 type=part 只计算基本工资
function createDepartureSettlement(type){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	type=type||'all';
	var archivesId=row.archivesId;
	var resignationId =row.resignationId||-1;
	Public.ajax(web_app.name + "/resignationSettlementAction!createDepartureSettlement.ajax",
		{archivesId:archivesId,resignationId:resignationId,archivesName:encodeURI(row.staffName),accountsType:type},
	    function(data){
            var url=DataUtil.composeURLByParam('resignationSettlementAction!showUpdate.job',data);//alert(url);
			parent.addTabItem({ tabid: 'createDepartureSettlement'+archivesId, text: '填写离职结算单', url:url});
	    }
	);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function viewHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var archivesId=row.archivesId;
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesView'+archivesId, text: '查看人员 ', url:url});
}


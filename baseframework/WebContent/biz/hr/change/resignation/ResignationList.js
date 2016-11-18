var gridManager = null, refreshFlag = false,resignationTypeData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	resignationTypeData=$('#resignationType').combox('getJSONData');
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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('离职明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>离职明细');
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
		viewHandler: function(){
			updateHandler();
		},
		exportExcelHandler: function(){
				UICtrl.gridExport(gridManager);
			},
		updateResignationTypeHandler:{id:'updateResignationTypeHandler',text:'修改离职类型',img:'page_settings.gif',click:function(){
				updateResignationType();
			}
		}
			
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
				{ display: "单据号码", name: "billCode", width: 100, minWidth: 140, type: "string", align: "left" },
			    { display: "申请日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "center" },		   
		   	    { display: "离职员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "所在体系", name: "systemTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "年龄", name: "age", width: 60, minWidth: 60, type: "string", align: "left" },	
				{ display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "left" },	
				{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "编制状态", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
				{ display: "最高学历", name: "educationTextView", width: 80, minWidth: 60, type: "string", align: "left" },	
				{ display: "员工入职时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "center" },	
				{ display: "集团工龄", name: "CWorkTime", width: 60, minWidth: 40, type: "string", align: "right" },	
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
				{ display: "审批通过时间", name: "resignationDate", width: 80, minWidth: 60, type: "string", align: "center" },
				{ display: "离职原因", name: "resignationReason", width: 200, minWidth: 60, type: "string", align: "left" },
				{ display: "离职类型", name: "typeTextView", width: 80, minWidth: 60, type: "string", align: "left"},
				{ display: "审批通过时间", name: "resignationDate", width: 80, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/resignationAction!slicedQueryResignation.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		manageType:'hrReshuffleManage',
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'auditId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateResignationType(data.auditId,data.type);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
//修改离职类型
function updateResignationType(auditId,type){
	
	if(!auditId){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
		type=row.type;
	}
	
	 UICtrl.showAjaxDialog({url: web_app.name + '/resignationAction!showUpdateResignationType.load', 
			title:"修改离职类型",
		     param:{auditId:auditId,type:type},
		     init:initDialog,
			ok : function(){
		      $('#submitForm').ajaxSubmit({url: web_app.name + '/resignationAction!updateResignation.ajax',
		      success : function() {
			   reloadGrid();
		    }
	        });
		   }, 
		width:400,
		close: this.close()});  
	
}

function initDialog(){ 
       $('#type_text').treebox({treeLeafOnly: true, name: 'resignationTypeChoose',tree:{delay:function(){alert(1);}},onChange:function(values,nodeData){
		 			$('#type_text').val(nodeData.name);
		 			$('#type').val(nodeData.shortCode);
		 	}});
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HRResignationList'+auditId,
		text: '员工离职查询',
		url: web_app.name + '/resignationAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'+'&taskKindId=makeACopyFor'
	}
	);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function reloadGrid(){
	gridManager.loadData();
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}




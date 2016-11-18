var gridManager = null, refreshFlag = false,updateLogGridManager=null;
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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('异动明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>异动明细');
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
		updateEffectDateHandler:{id:'updateEffectDateHandler',text:'修改生效时间',img:'page_settings.gif',click:function(){
				updateEffectDateHandler();
			}
		},
		viewEffectDateUpdateHandler:{id:'viewEffectDateUpdateLogHandler',text:'查看生效时间修改日志',img:'page_settings.gif',click:function(){
				 viewEffectDateUpdateHandler();
			}
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
		//createOnJobAssessTask:{id:'createOnJobAssessTask',text:'生成在岗履职测评通知任务',img:'page_settings.gif',click:function(){
		//		createOnJobAssessTask();
			//}}
	});
    var columns=[
		 			{ display: "填表日期", name: "fillinDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "单据号码", name: "billCode", width: 120, minWidth: 120, type: "string", align: "left" },
		 			{ display: "申请状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left" }
		 	    ];

	    columns.push({ display: "员工", name: "staffName", width: 60, minWidth: 60, type: "string", align: "center" });
	    columns.push({ display: "生效时间", name: "effectiveDate", width:80, minWidth: 100, type: "date", align: "left"});
	    columns.push({ display: "类型", name: "typeTextView", width: 80, minWidth: 60, type: "string", align: "left"});
	    
	    var columnAfter={display: '异动后情况', columns:[]};
	    columnAfter.columns.push({ display: "机构", name: "toOrganName", width: 180, minWidth: 180, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "中心", name: "toCenterName", width: 120, minWidth: 120, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "部门", name: "toDeptName", width: 80, minWidth: 60, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "岗位", name: "toPositionName", width: 80, minWidth: 60, type: "string", align: "left"});
		columnAfter.columns.push({ display: "行政级别", name: "toPosLevelTextView",width: 80, minWidth: 60, type: "string", align: "left"
		});
		columnAfter.columns.push({ display: "职位描述", name: "toPosDesc",width: 150, minWidth: 60, type: "string", align: "left"});
	    var columnBefore={display: '异动前情况', columns:[]};
		columnBefore.columns.push({display: "机构", name: "fromOrganName", width: 180, minWidth: 180, type: "string", align: "left" });
		columnBefore.columns.push({ display: "中心", name: "fromCenterName", width: 120, minWidth: 120, type: "string", align: "left" });
		columnBefore.columns.push({ display: "部门", name: "fromDeptName", width: 80, minWidth: 60, type: "string", align: "left" });
		columnBefore.columns.push({ display: "岗位", name: "fromPositionName", width: 80, minWidth: 60, type: "string", align: "left" });
		columnBefore.columns.push({ display: "行政级别", name: "fromPosLevelTextView", width: 80, minWidth: 60, type: "string", align: "left"
		});
		columnBefore.columns.push({ display: "职位描述", name: "fromPosDesc",width:150, minWidth: 60, type: "string", align: "left"});
		//columnBefore.columns.push({ display: "工资结算单位", name: "fromPayOrganName", width: 80, minWidth: 60, type: "string", align: "left" });
		columns.push(columnBefore);
	   
		columns.push({ display: "异动原因", name: "reason", width:300, minWidth: 200, type: "string", align: "left"});
	
		columns.push(columnAfter);
		  var columnMaker={display: '制表人信息', columns:[]};
	    columnMaker.columns.push({ display: "部门", name: "deptName", width: 100, minWidth:100, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "制表人", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left"} );
	    columns.push(columnMaker);
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryReshuffle.ajax',
		manageType:'hrReshuffleManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'effectiveDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.auditId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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

function  createOnJobAssessTask(){
	 Public.ajax(web_app.name + '/reshuffleAction!createOnJobAssessTask.ajax?', function(data){
	    		 });
	
}

//修改生效时间按钮
function  updateEffectDateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var auditId=row.auditId;
	UICtrl.showAjaxDialog({
		title : "生效时间修改",
		width : 400,
		url : web_app.name + '/reshuffleAction!forwardEffectDateChange.load',
		ok : function(){
			var _self=this;
			$('#effectDateChangeForm').ajaxSubmit({
				url : web_app.name + '/reshuffleAction!insertEffectDateChangeLog.ajax',
				param:{auditId:auditId},
				success : function() {
					_self.close();
					reloadGrid();	
				}
			});
		}
	});

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
		tabid: 'HRReshufleList'+auditId,
		text: '员工异动查询',
		url: web_app.name + '/reshuffleAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}



function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/reshuffleAction!updateReshuffle.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
	}

function viewEffectDateUpdateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var auditId=row.auditId;
	UICtrl.showAjaxDialog({
		title : "查看修改日志",
		width : 715,
		height:450,
		url : web_app.name + '/reshuffleAction!forwardEffectDateChangeLog.load',
		param:{auditId:auditId},
		init:initializeUpdateLogGrid,
		ok:false
		
		
	});
}


function initializeUpdateLogGrid(doc){
	var auditId=$('#auditIdMain').val();
	var param={auditId:auditId};
	updateLogGridManager=UICtrl.grid('#updatemaingrid', {
		 columns: [
		        { display: "修改人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left"
		        },	
		        { display: "修改时间", name: "createTime", width: 120, minWidth: 60, type: "date", align: "left"
		        },	
		        { display: "原因", name: "explain", width: 154, minWidth: 60, type: "string", align: "left"
				},
		        { display: "修改前的生效时间", name: "oldEffectiveDate", width: 124, minWidth: 60, type: "date", align: "left"
				},
				{ display: "修改后的生效时间", name: "newEffectiveDate", width: 120, minWidth: 60, type: "date", align: "left"
				}
				
		],
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryUpdateLog.ajax',
		parms:param,
		width : 715,
		sortName:'createTime',
		sortOrder:'asc',
		height : 450,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		usePager: false,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		onLoadData :function(){
			return !($('#auditIdMain').val()=='');
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}



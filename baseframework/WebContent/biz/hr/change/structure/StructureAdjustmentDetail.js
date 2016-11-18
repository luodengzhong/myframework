var gridManager = null, refreshFlag = false;
var posLevelData=null , unusualChangeTypeData=null,staffingPostsRank=null;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
	};

$(document).ready(function() {
	posLevelData=$('#mainPosLevel').combox('getJSONData');
	unusualChangeTypeData=$('#mainUnusualChangeType').combox('getJSONData');
	staffingPostsRank=$('#staffingPostsRank').combox('getJSONData');
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'batchStaffChangeArchiveSelect',width:535,dataIndex:'archivesId',manageType:'hrReshuffleManage',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);

	    		addRow["archivesId"] = o["archivesId"];
	    		addRow["beforeOrganId"] = o["ognId"];
	    		addRow["beforeOrganName"] = o["ognName"];
	    		addRow["beforeCenterId"] = o["centreId"];
	    		addRow["beforeCenterName"] = o["centreName"];
	    		addRow["beforeDeptId"] = o["dptId"];
	    		addRow["beforeDeptName"] = o["dptName"];
	    		addRow["beforePositionId"] = o["posId"];
	    		addRow["beforePositionName"] = o["posName"];
	    		addRow["beforeJobTitle"] = o["jobTitle"];
	    		addRow["beforePosTier"] = o["posTier"];
	    		addRow["beforePayOrganId"] = o["wageCompany"];
	    		addRow["beforePayOrganName"] = o["companyName"];  
	    		addRow["fromWageOrgId"] = o["wageOrgId"];
	    		addRow["fromWageOrgName"] = o["wageOrgName"]; 
	    		addRow["beforePosLevel"] = o["posLevel"];
	    		addRow["beforePosDesc"] = o["posDesc"];
	    		
	    		addRow["fromStaffingPostsRank"] = o["staffingPostsRank"]; 
	    		addRow["fromResponsibilitiyName"] = o["fromResponsibilitiyName"];
	    		addRow["fromPostsRankSequence"] = o["fromPostsRankSequence"];
	    		
	    		addRow["afterOrganId"] = addRow["beforeOrganId"];
	    		addRow["afterOrganName"] = addRow["beforeOrganName"];
	    		addRow["afterCenterId"] = addRow["beforeCenterId"];
	    		addRow["afterCenterName"] = addRow["beforeCenterName"];
	    		addRow["afterDeptId"] = addRow["beforeDeptId"];
	    		addRow["afterDeptName"] =addRow["beforeDeptName"];
	    		//addRow["afterPositionId"] = addRow["beforePositionId"];
	    		//addRow["afterPositionName"] = addRow["beforePositionName"];
	    		addRow["afterJobTitle"] =addRow["beforeJobTitle"];
	    		addRow["afterPosTier"] = addRow["beforePosTier"];
	    		//addRow["afterPayOrganId"] = addRow["beforePayOrganId"] ;
	    		//addRow["afterPayOrganName"] = addRow["beforePayOrganName"];
	    		//addRow["toWageOrgId"] = addRow["fromWageOrgId"] ;
	    		//addRow["toWageOrgName"] = addRow["fromWageOrgName"];
	    		//addRow["afterPosLevel"] = addRow["beforePosLevel"];
	    		//addRow["afterPosDesc"] = addRow["beforePosDesc"];
	    		addRow["effectiveDate"]=$("#defaultlDate").val();
	    		addRow["reason"]=$("#defaultReason").val();
	    		addRow["isHandoverNeeded"]=$("#defaultIsHandoverNeeded").val();
	    		addRows.push(addRow);
    	    }
	    );
	    gridManager.addRows(addRows);
    	return true;
    }});
	 $('#structureAdjustmentFileList').fileList();
}

//初始化表格
function initializeGrid() {
	var columns=[
	 			//{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" ,align: 'center'},
	 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center',frozen: true}
	 	];
	var columnBefore={display: '调整前情况', columns:[]};
	columnBefore.columns.push({display: "机构", name: "beforeOrganName", width: 80, minWidth: 60, type: "string", align: "left" });
	columnBefore.columns.push({ display: "中心", name: "beforeCenterName", width: 80, minWidth: 60, type: "string", align: "left" });
	columnBefore.columns.push({ display: "部门", name: "beforeDeptName", width: 80, minWidth: 60, type: "string", align: "left" });
	columnBefore.columns.push({ display: "岗位", name: "beforePositionName", width: 80, minWidth: 60, type: "string", align: "left" });
	columnBefore.columns.push({ display: "行政级别", name: "beforePosLevel", width: 80, minWidth: 60, type: "string", align: "left",render: function (item) { 
		return posLevelData[item.beforePosLevel];
	} });
	columnBefore.columns.push({ display: "职级", name: "fromStaffingPostsRank",width:100, minWidth: 60, type: "string", align: "left",
	render:function(item){
	return staffingPostsRank[item.fromStaffingPostsRank];
	}});
	columnBefore.columns.push({ display: "职级序列", name: "fromPostsRankSequence",width:120, minWidth: 60, type: "string", align: "left"});
	columnBefore.columns.push({ display: "职能", name: "fromResponsibilitiyName",width:150, minWidth: 60, type: "string", align: "left"});
	columnBefore.columns.push({ display: "职位描述", name: "beforePosDesc",width:150, minWidth: 60, type: "string", align: "left"});
	columnBefore.columns.push({ display: "工资主体单位", name: "fromWageOrgName", width: 80, minWidth: 60, type: "string", align: "left" });
	columnBefore.columns.push({ display: "工资归属单位", name: "beforePayOrganName", width: 80, minWidth: 60, type: "string", align: "left" });
	var columnAfter={display: '调整后情况', columns:[]};
	columnAfter.columns.push({ display: "机构", name: "afterOrganName", width: 80, minWidth: 60, type: "string", align: "left",
		editor: { type: 'tree', required: true,data:{name : 'org',hasSearch:false,width:250,filter:'ogn',getParam:function(rowData){
			return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn')"};
		}},textField:'afterOrganName',valueField:'afterOrganId'}
	});
	columnAfter.columns.push({ display: "中心", name: "afterCenterName", width: 80, minWidth: 60, type: "string", align: "left", 
		editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'dpt',getParam:function(rowData){
			var ognId=rowData.afterOrganId||'';
			return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
		}},textField:'afterCenterName',valueField:'afterCenterId'}
	});
	columnAfter.columns.push({ display: "部门", name: "afterDeptName", width: 80, minWidth: 60, type: "string", align: "left",
		editor: { type: 'tree', required: true,data:{name : 'org',width:250,hasSearch:false,filter:'dpt',getParam:function(rowData){
			var ognId=rowData.afterOrganId||'';
			var centreId=rowData.afterCenterId||'';
			root='orgRoot';
			if(ognId!=''){
			   root=ognId;
			}
			return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
		}},textField:'afterDeptName',valueField:'afterDeptId'}
	});
	columnAfter.columns.push({ display: "岗位", name: "afterPositionName", width: 80, minWidth: 60, type: "string", align: "left", 
		editor: { type: 'select', required: true,data:{name :'hrPosSelect',type :'hr',
			getParam:function(rowData){
				var ognId=rowData.afterOrganId||'';
				var centreId=rowData.afterCenterId||'';
				var dptId=rowData.afterDeptId||'';
				var root='';
			    if(ognId!=''){
				   root=ognId;
			    }
			    if(centreId!=''){
				  root=centreId;
			    }
			    if(dptId!=''){
				  root=dptId;
			    }
			    return {searchQueryCondition:"full_id like '%"+root+"%'"};
		},back:{
			id:'afterPositionId',
			name:'afterPositionName',
			posLevel:'afterPosLevel'
		}}}
	});
	columnAfter.columns.push({ display: "行政级别", name: "afterPosLevel",width: 80, minWidth: 60, type: "string", align: "left",
		editor: { type:'combobox',data:posLevelData},
		render: function (item) { 
			return posLevelData[item.afterPosLevel];
		}
	});
	columnAfter.columns.push({ display: "职级", name: "toStaffingPostsRank",width:100, minWidth: 60, type: "string", align: "left",
		editor: { type:'combobox',required: true,data:staffingPostsRank,onChange:function(){
		$('#toPostsRankSequence').val('');
	 }},
		render: function (item) { 
			return staffingPostsRank[item.toStaffingPostsRank];
		}
	});
	columnAfter.columns.push({ display: "职级序列", name: "toPostsRankSequence",width:150, minWidth: 60, type: "string", align: "left",
	editor: {type:'select',required: true,
	data:{type:'hr',name:'postsRankSequenceByFullId',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		getParam:function(rowData){
			var organId = rowData.afterOrganId||'';
			var staffingPostsRank=rowData.toStaffingPostsRank||'';
			if(staffingPostsRank!=''){
				return {organId:organId,searchQueryCondition:"staffing_posts_rank='"+staffingPostsRank+"'"};
			}else{
				return {organId:organId,searchQueryCondition:""};
			}
		},
		back:{code:'toPostsRankSequence'}}
	}
	});
	columnAfter.columns.push({ display: "职能", name: "toResponsibilitiyName",width:150, minWidth: 60, type: "string", align: "left",
		editor: {type:'tree',required: true,data:{name:'responsibilitiy',checkbox:true,treeLeafOnly:true},
			textField:'toResponsibilitiyName',valueField:'toResponsibilitiyId'
		}
	});
	columnAfter.columns.push({ display: "职位描述", name: "afterPosDesc",width: 150, minWidth: 60, type: "string", align: "left",
		editor: { type:'text',maxLength:256}
	});
	columnAfter.columns.push({ display: "工资主体单位", name: "toWageOrgName",width: 100, minWidth: 60, type: "string", align: "left",
		editor: { type: 'tree', required: true,beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
				Public.authenticationWageOrg('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是工资主体！');
					}
				});
				return flag;
		},
		data:{name : 'org',width:250,hasSearch:false,filter:'ogn,dpt',
			getParam:function(rowData){
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}
		},textField:'toWageOrgName',valueField:'toWageOrgId'}
	});
	columnAfter.columns.push({ display: "工资归属单位", name: "afterPayOrganName", width: 100, minWidth: 60, type: "string", align: "left",
		editor: { type: 'select', required: true,
			data: { type:"hr", name: "businessRegistrationByOrg",getParam:function(rowData){
				var orgId=rowData['toWageOrgId'];
				if(orgId==''){
					Public.tip('请选择工资主体单位.');
					return false;
				}
				return {orgId:orgId};
			},
			back:{id:"afterPayOrganId",companyName:"afterPayOrganName"}
		}}
	});

	columns.push(columnBefore);	
	columns.push(columnAfter);
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addBatchHandler: function(){}, 
		deleteHandler: deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/structureAdjustmentAction!slicedQueryUnusualChangeDetail.ajax',
		parms:{auditId:$('#auditId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true, 
		autoAddRowByKeydown:false,
		autoAddRow:{beforeOrganId:'',toResponsibilitiyId:'',beforeCenterId:'',beforeDeptId:'',beforePositionId:'',beforePayOrganId:'',afterPayOrganId:'',archivesId:'',afterOrganId:'',afterCenterId:'',afterDeptId:'',afterPositionId:''},
		onLoadData :function(){
			return !($('#auditId').val()=='');
		}
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 


//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'structureAdjustmentAction!deleteUnusualChangeDetails.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/structureAdjustmentAction!showUpdate.load?auditId='+$("#auditId").val(), param:{}, ok: update, close: dialogClose});
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#structureAdjustmentFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}

//批量添加保存 
//function save(){
//	saveHandler();
//}

function saveHandler() {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/structureAdjustmentAction!saveOrUpdateUnusualChanges.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
		}
	});
	
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}




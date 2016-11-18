var gridManager = null, refreshFlag = false, performanceLevelData=null,archivesState=null;
$(document).ready(function() {
	performanceLevelData=$('#mainPerformanceLevel').combox('getJSONData');
	archivesState=$('#tempArchivesState').combox('getJSONData');
	
	UICtrl.autoSetWrapperDivHeight();
	var isCombine=$('#isCombine').val();
	var status=$('#status').val();
	if(isCombine==1){
		//hideButton();
	}
	setEditable();//此项要加在grid初始化之前才会生效
	initializeGrid();
	initializeUI();
	var isArchive=$('#isArchive').val();
	
});


/*
function isApplyProcUnit(){
  return true;
}*/
function setEditable(){
	if(isApproveProcUnit()){//是审核中
		permissionAuthority['maingrid.effectiveScore']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.effectiveRank']={authority:'readwrite',type:'1'};
	}
}

function hideButton(){
		permissionAuthority['maingrid.addBatchHandler']={authority:'noaccess',type:'2'};
		permissionAuthority['maingrid.deleteHandler']={authority:'noaccess',type:'2'};
		permissionAuthority['maingrid.reloadHandler']={authority:'noaccess',type:'2'};
		permissionAuthority['maingrid.definedRankNumHandler']={authority:'noaccess',type:'2'};
		permissionAuthority['maingrid.updateRankNeededHandler']={authority:'noaccess',type:'2'};
	}
	

function initializeUI(){
	 /*$('#staffName').searchbox({ type:"hr",manageType:'hrReshuffleManage', name: "resignationChoosePerson",
			back:{
				ognId:"#organizationId",ognName:"#organizationName",centreId:"#centerId",
				centreName:"#centerName",dptId:"#deptId",dptName:"#deptName",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId"}
	 });*/
	var isCountAsscore=$('#isCountAsscore').val();
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'batchStaffPerformanceRankArchiveSelect',width:535,dataIndex:'archivesId',manageType:'hrReshuffleManage',
		getParam:function(){return {searchQueryCondition:"full_id like '%"+$('#organId').val()+"%'"};},
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["archivesId"] = o["archivesId"];
	    		addRow["organizationId"] = o["ognId"];
	    		addRow["organizationName"] = o["ognName"];
	    		addRow["centerId"] = o["centreId"];
	    		addRow["centerName"] = o["centreName"];
	    		addRow["dptId"] = o["dptId"];
	    		addRow["dptName"] = o["dptName"];
	    		addRow["posId"] = o["posId"];
	    		addRow["posName"] = o["posName"];
	    		addRow["posLevel"] = o["posLevel"];
	    		addRow["score"] = o["score"];
	    		addRows.push(addRow);
    	    }
	    );
	    gridManager.addRows(addRows);
    	return true;
    }});
	
	//$('#effectiveRank').val($('#effectiveRank').val()).combox('setValue');
}

//初始化表格
function initializeGrid() {
	var periodIndex=$('#periodIndex').val();
	var columns=[
	 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
	 			{ display: "分数", name: "score", width: 50, minWidth: 50, type: "string", align: "center" ,align: 'center'	,
	 			 editor: { type:'text'}},
	 			{ display: "等级", name: "rank", width: 50, minWidth: 50, type: "string", align: "center" ,align: 'center',
	 				render: function (item) { 
	 					if(item.rankNeeded==0&&item.rank==4){
	 						return ;
	 					}else{
	 					return performanceLevelData[item.rank];
	 					}
	 			    } 		 				
	 			},
	 			{ display: "最终分数", name: "effectiveScore", width: 100, minWidth: 80, type: "string", align: "center" ,align: 'center',
	 				editor: { type:'text'},
	 				render: function (item) { 
	 					if(item.rankNeeded==0&&item.staffingLevel!=5){
	 						return ;
	 					}else{
	 					return item.effectiveScore;
	 					}
	 			    } 		 				
	 			},
	 			{ display: "最终等级", name: "effectiveRank", width: 100, minWidth: 80, type: "string", align: "center" ,align: 'center',
	 				editor: { type:'combobox',data:performanceLevelData},
	 				render: function (item) { 
	 					if(item.rankNeeded==0&&item.effectiveRank==4){
	 						return ;
	 					}else{
	 					return performanceLevelData[item.effectiveRank];
	 					}
	 			    } 	 		
	 		     },
	 		    { display: "标识", name: "rankNeededTextView", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center',
	 		    render:function(item){
	 		    	if(item.rankNeeded==0){
	 			     return '<div style="background-color:green;width:100%;height:100%">'+item.rankNeededTextView+'</div>';
	 				}else{
	 				return item.rankNeededTextView;
	 				}
	 		    }
	 		    },
	 		    { display: "状态", name: "state", width: 70, minWidth: 60, type: "string", align: "center" ,align: 'center',
	 			   render: function (item) { 
				return archivesState[item.state];
			} },
	 		   { display: "编制状态", name: "staffingLevelTextView", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'},
	 			{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
	 			{ display: "离职时间", name: "departurDate", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
	 			  { display: "机构", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" ,align: 'center'},
	 			{ display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "center" ,align: 'center'}

	 	];
	 	columns.push({display: "第一季度等级", name: "oneRank", width: 80, minWidth: 50, type: "string", align: "center" ,align: 'center',
	 	render:function(item){
	 			return performanceLevelData[item.oneRank];
	 	 }});
	 	columns.push({display: "第二季度等级", name: "twoRank", width: 80, minWidth: 50, type: "string", align: "center" ,align: 'center',
	 	render:function(item){
	 			return performanceLevelData[item.twoRank];
	 	 }});
	 	columns.push({display: "第三季度等级", name: "threeRank", width: 80, minWidth: 50, type: "string", align: "center" ,align: 'center',
	 	render:function(item){
	 			return performanceLevelData[item.threeRank];
	 	 }});
	 	columns.push({display: "第四季度等级", name: "fourRank", width: 80, minWidth: 50, type: "string", align: "center" ,align: 'center',
	 	render:function(item){
	 			return performanceLevelData[item.fourRank];
	 	 }});
	 	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addBatchHandler: {id:'addBatch',text:'增加人员',img:'user1.gif',click:function(){
			addRankPerson();
		}},
    	deleteHandler: {id:'removeBatch',text:'移除人员',img:'user0.gif',click:function(){
			deleteHandler();
		}},
		//reloadHandler:{id:'reload',text:'比例同步',img:'',click:proportionReload},
		savedefinedRankNumHandler:{id:'updateDefinedRankNum',text:'自定义绩效等级个数',img:'edit.png',click:definedRankNum},
		updateRankNeededHandler:{id:'updateRankNeeded',text:'修改排名标识',img:'page_edit.gif',click:updateRankNeeded},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/performanceRankAction!slicedQueryPerformanceRankGroupDeta.ajax',
		parms:{performanceRankGroupId:$('#performanceRankGroupId').val()||$('#id').val()},
		pageSize : 800,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'rankSequence',
		sortOrder : 'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true, 
		autoAddRow:{organizationId:'',centerId:'',dptId:'',posId:'',archivesId:'',performanceRankGroupId:''},
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.formId);
		}
		
	});
	UICtrl.createGridQueryBtn('#maingrid','div.l-panel-topbar',function(param){
		UICtrl.gridSearch(gridManager, {staffName:encodeURI(param)});
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function viewHandler(formId){
	if(!formId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		formId=row.formId;
	}
	parent.addTabItem({
		tabid: 'HRPerformanceRank'+formId,
		text: '员工绩效评分明细查看',
		url: web_app.name + '/performAssessScoreDetailAction!forwardDetail.do?bizId=' 
			+ formId+'&isReadOnly=true'
	}
	);
	
}
//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'performanceRankAction!deletePerformanceRankGroupDeta.ajax',
		gridManager: gridManager,idFieldName:'performanceGroupDetailId',
		onSuccess:function(){
			proportionReload();
		}
	});
}

//自定义排名等级
function  definedRankNum(){
	 var performanceRankGroupId = $('#performanceRankGroupId').val();
	 if(Public.isBlank(performanceRankGroupId)){
	 	performanceRankGroupId=$('#id').val();
	 }
     var status=$('#status').val();
	if(status==0){
	 UICtrl.showAjaxDialog({url: web_app.name + '/performanceRankAction!showUpateDefinedRankNum.load', 
			title:"提示：请填写各等级人数",
			param:{performanceRankGroupId:performanceRankGroupId},
			ok: function (){
			     updatePerformanceRankGroup();
			}, 
			width:400,
			height:100,
			close: dialogClose});  
	}else{
			Public.tip('不是申请状态 不能自定义绩效考核等级个数操作');
	}
	
}

function  updatePerformanceRankGroup(){
	$('#submitForm').ajaxSubmit({url:web_app.name + "/performanceRankAction!updatePerformanceRankGroup.ajax",
			success:function() {
			proportionReload();
	}});
}

function updateRankNeeded(){
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		var performanceGroupDetailId=row.performanceGroupDetailId; 
		var rankNeeded=row.rankNeeded;
		var value=1-rankNeeded;
		Public.ajax(web_app.name + "/performanceRankAction!updateRankNeededValue.load",
			{performanceGroupDetailId:performanceGroupDetailId,rankNeeded:value}, function() {
				proportionReload();
			});
		
	
}




/**
 * 新增排名人员
 * @return {}
 */
function addRankPerson(){
	 var performanceRankGroupId = $('#performanceRankGroupId').val();
	 if(Public.isBlank(performanceRankGroupId)){
	 	performanceRankGroupId=$('#id').val();
	 }
	 var periodIndex=$('#periodIndex').val();
	 var periodCode=$('#periodCode').val();

	/*
	 var selectOrgParams = function(){
	return  {
		filter: "",
		multiSelect: false,
		parentId: "orgRoot",
		manageCodes: "",
		displayableOrgKinds : "ogn,dpt,pos,psm",
	    selectableOrgKinds : "psm",
		showDisabledOrg: 'true',
		listMode: false,
		showCommonGroup: false,
		cascade: true,
		selected: []
   };
};
*/
	var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
   selectOrgparams = jQuery.extend(selectOrgparams, {selectableOrgKinds: "ogn,dpt,pos,psm", showDisabledOrg: true});
	var options = { 
			params: selectOrgparams, 
			confirmHandler: function() {
				insertRankPerson(this,performanceRankGroupId,periodIndex,periodCode);
			},
			closeHandler: dialogClose, title : "选择人员"
	};
    OpmUtil.showSelectOrgDialog(options);
	 
	/* UICtrl.showFrameDialog({
			title : "选择人员",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
				insertRankPerson(this,performanceRankGroupId);
			},
			close : dialogClose
		});
		*/
	
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
function insertRankPerson(_self,performanceRankGroupId,periodIndex,periodCode){
	var data = _self.iframe.contentWindow.selectedData;
	
	Public.ajax(web_app.name + "/performanceRankAction!insertRankPerson.load",
			{performanceRankGroupId:performanceRankGroupId,periodIndex:periodIndex,periodCode:periodCode,data:$.toJSON(data)}, function() {
				proportionReload();
				_self.close();
			});
}

/**
 * 移除人员
 * @return {}
 */

function  proportionReload(){
	var performanceRankGroupId=$('#performanceRankGroupId').val();
	if(Public.isBlank(performanceRankGroupId)){
	 	performanceRankGroupId=$('#id').val();
	 }
	var status=$('#status').val();
	if(status==0){
	Public.ajax(web_app.name + "/performanceRankAction!proportionReload.load",
			{performanceRankGroupId:performanceRankGroupId}, function(data) {
				reloadGrid();
				var tipdiv=$('#tipdiv').show();
				tipdiv.html(data).show();
			});
	}else{
			Public.tip('不是申请状态 不能执行比例同步操作');
	}
}
function getId() {
	return $("#performanceRankGroupId").val() || 0;
}

function setId(value){
	$("#performanceRankGroupId").val(value);
	gridManager.options.parms['performanceRankGroupId'] =value;
}
function afterSave(){
	reloadGrid();
}

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}






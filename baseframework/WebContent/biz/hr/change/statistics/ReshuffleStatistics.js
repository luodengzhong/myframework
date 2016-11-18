var gridManager = null, refreshFlag = false,posLevelData=null,reshuffleTypeData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	reshuffleTypeData=$('#reshuffleType').combox('getJSONData');
	posLevelData=$('#posLevel').combox('getJSONData');
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
		html.push('异动子集查询');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>异动子集查询');
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
		updateReasoneHandler:{id:'updateReasoneHandler',text:'修改变动原因',img:'page_settings.gif',click:function(){
				updateReasoneHandler();
			}
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		saveHandler:saveHandler,
		//updateHandler:updateHandler,
		deleteHandler:deleteHandler
	});
	    var columns=[
		 			{ display: "员工姓名", name: "staffName", width: 80, minWidth: 150, type: "string", align: "center" },
		 			{ display: "生效时间", name: "effectiveDate", width: 120, minWidth: 150, type: "date", align: "center",
		 			editor : {
				   type : 'date'
			        }},
		 			{ display: "异动类型", name: "reshuffleTypeTextView", width: 100, minWidth: 150, type: "string", align: "center"
		 			
		 			},
		 			{ display: "变动前描述", name: "fromPosDesc", width: 200, minWidth: 150, type: "string", align: "center",
		 			editor : {
				    type : 'text'
			        }},
		 			{ display: "变动后描述", name: "posDesc", width: 200, minWidth: 150, type: "string", align: "center",
		 			editor : {
				    type : 'text'
			        }
		 			},
		 			{ display: "变动后职级", name: "posLevel", width: 150, minWidth: 150, type: "string", align: "center",
		 			editor: { type:'combobox',data:posLevelData},
		            render: function (item) { 
			         return posLevelData[item.posLevel];
	               	}},
		 			{ display: "变动原因", name: "reason", width: 250, minWidth: 150, type: "string", align: "center"
		 			}
		 	    ];
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/reshuffleStatisticsAction!slicedQueryStatistics.ajax',
		pageSize : 20,
		autoAddRowByKeydown:false,
		manageType:'hrReshuffleManage',
		enabledEdit : true,
		sortName:'auditId',
		sortOrder:'desc',
		width : '99%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateReasoneHandler(data.auditId,data.tableName,data.reason);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function saveHandler(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	Public.ajax(web_app.name+'/reshuffleStatisticsAction!save.ajax',
			    		{extendedData:$.toJSON(extendedData)},
			    		 function(){
			    		 reloadGrid();}
			    	);
	
}

function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var auditId=row.auditId;
	var tableName=row.tableName;
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/reshuffleStatisticsAction!delete.ajax', 
				{bizId:auditId,tableName:tableName}, function(){
			reloadGrid();
		});
	});
	
	
}
function updateReasoneHandler(auditId,tableName,reason){
	if(!auditId){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
		tableName=row.tableName;
		reason=row.reason;
	}
	
	 UICtrl.showAjaxDialog({url: web_app.name + '/reshuffleStatisticsAction!showInsert.load', 
			title:"修改变动原因",
		     param:{bizId:auditId,tableName:tableName,reason:reason},
			ok : function(){
		      $('#submitForm').ajaxSubmit({url: web_app.name + '/reshuffleStatisticsAction!update.ajax',
		      success : function() {
			   reloadGrid();
		    }
	        });
		   }, 
		width:400,
		height:100,
		close: this.close()});  
    /*parent.addTabItem({
		tabid: 'HRReshuffleApply'+auditId,
		text: '修改员工异动信息',
		url: web_app.name + '/reshuffleStatisticsAction!showUpdate.job?bizId=' 
			+ auditId+'&tableName='+tableName
	  }
	);*/
}

function updateHandler(){
		var row = gridManager.getSelectedRow();
	   if (!row) {Public.tip('请选择数据！'); return; }
	   var auditId=row.auditId;
	   var tableName=row.tableName;
	   parent.addTabItem({
		tabid: 'HRReshuffleApply'+auditId,
		text: '修改员工异动信息',
		url: web_app.name + '/reshuffleStatisticsAction!showUpdate.do?bizId=' 
			+ auditId+'&tableName='+tableName+'&isReadOnly=false'
	  }
	);
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
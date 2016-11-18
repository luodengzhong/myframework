var gridManager = null, refreshFlag = false,periodCodeData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	periodCodeData=$('#periodCode').combox('getJSONData');
});
function initializeUI(){
	  UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('绩效考核结果列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效考核结果列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
	
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
	viewHandler:function(){
		 viewHandler();
	},
	deleteHandler:deleteHandler,
	exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	        	{ display: "生成时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" }, 
		  		{ display: "被考核对象姓名", name: "perfAssessName", width: 100, minWidth: 60, type: "string", align: "left",
		  			render:function(item){
						return '<a href="javascript:showScoreDetail('+item.formId+');" class="GridStyle">'+item.perfAssessName+'</a>';
		  			}},
		  		{ display: "考核排名单位", name: "orgnName", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "考核排名单位路径", name: "fullName", width: 260, minWidth: 60, type: "string", align: "left" },
				{ display: "评分状态", name: "scoreStatusTextView", width: 100, minWidth: 60, type: "string", align: "left" },

		  		{ display: "考核年", name: "year", width: 60, minWidth: 60, type: "string", align: "left" },
		  		{ display: "考核周期", name: "periodCode", width: 60, minWidth: 60, type: "string", align: "left" ,
		  		render: function (item) { 
	 					return periodCodeData[item.periodCode];
	 			        }		},
		  		{ display: "考核索引", name: "periodIndex", width: 60, minWidth: 60, type: "string", align: "left" },
		  		{ display: "考核表名称", name: "perfformname", width: 120, minWidth: 60, type: "string", align: "left" },
		  		{ display: "最后得分", name: "totalScore", width: 100, minWidth: 60, type: "string", align: "left" }
		  		],
		dataAction : 'server',
		url: web_app.name+'/performAssessResultAction!slicedQueryPerformanceAssessScore.ajax',
		pageSize : 20,
		manageType:'hrPerFormAssessManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
		    viewHandler(data.formId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function showScoreDetail(formId){
	parent.addTabItem({ 
		tabid: 'HRAssessResult'+formId,
		text:'员工考评评分情况查看',
		url: web_app.name + '/performAssessScoreDetailAction!forwardList.do?formId='+formId
		}); 
	
}
//对于重复发起的任务执行删除操作  
function deleteHandler(){
		var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }

		var formId=row.formId;
		var status=row.scoreStatus;
		if(status==4){
			Public.tip('选择的数据不能执行删除操作！'); return;
		}
		UICtrl.confirm('确定删除吗?',function(){
			Public.ajax(web_app.name + '/paformMakeAction!deleteAssessFrom.ajax', 
				{formId:formId}, function(){
			     reloadGrid();
		});
		});
		
}
function viewHandler(formId){
	if(!formId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		formId=row.formId;
	}
	parent.addTabItem({ 
		tabid: 'HRScoreReault'+formId,
		text: '绩效考核评分情况查看',
			url: web_app.name + '/performAssessScoreDetailAction!forwardList.do?formId='+formId

		}); 
}


var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			addHandler();
		}, 
		updateHandler:function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "工资类别", name: "wageKindTextView", width: 140, minWidth: 60, type: "string", align: "left"},		   
			{ display: "计算公式", name: "ruleContent", width: 450, minWidth: 60, type: "string", align: "left"},		   
			{ display: "描述", name: "remark", width: 250, minWidth: 60, type: "string", align: "left" },
		    { display: "编辑", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) {
					return '<a href="javascript:updateByOrg('+item.payPerformanceKindRuleId+',\''+item.wageKindTextView+'\');" class="GridStyle">编辑</a>';
				} 
		    }
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedPayPerformanceKindRule.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		checkbox:false,
		autoAddRow:{},
		sortName:'wageKind',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
		}
	});
}



//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function addHandler(){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/paySetupAction!showInsertPayPerformanceKindRule.load',
		title: "添加绩效计算规则",
		ok: save, 
		width:500
	});
}

//编辑按钮
function updateHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/paySetupAction!showPayPerformanceKindRule.load', 
		title: "修改绩效计算规则",
		param:{payPerformanceKindRuleId:data.payPerformanceKindRuleId},width:500,
		ok: save
	});
}
function save(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/paySetupAction!savePayPerformanceKindRule.ajax',
		success : function() {
			_self.close();
			reloadGrid();		  
		}
	});
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'paySetupAction!deletePayPerformanceKindRule.ajax',
		gridManager:gridManager,idFieldName:'payPerformanceKindRuleId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//行编辑按钮
function updateByOrg(id, display){
	UICtrl.showFrameDialog({
		title:'编辑['+display+']规则',
		url: web_app.name + '/paySetupAction!forwardPayPerformanceRuleOrg.do', 
		param:{payPerformanceKindRuleId:id},
		height:290,
		width:650,
		okVal:'保存',
		ok:doSaveRuleByOrg,
		cancel:true
	});
}
function doSaveRuleByOrg(){
	var iframeWindow=this.iframe.contentWindow;
	var fn = iframeWindow.getData;
	if($.isFunction(fn)){
		var data=fn();
		Public.ajax(web_app.name + '/paySetupAction!savePayPerformanceRuleOrg.ajax', data, function(id) {
			iframeWindow.setId(id);
		});
	}
}
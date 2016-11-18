var gridManager = null, refreshFlag = false,welfarePaymentData=null;
$(document).ready(function() {
	welfarePaymentData=$('#payment').combox('getJSONData');
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "编码", name: "code", width: 180, minWidth: 180, type: "string", align: "left" },
		
//		{display: "计发方式", name: "payment", width: 80, minWidth: 80, type: "string", align: "left",
//			render: function (item) { 
//			    return welfarePaymentData[item.payment];
//		    } 	
//	     },		
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "center",
	    	 render: function (item) { 
			     return UICtrl.sequenceRender(item,'welfareTypeId');
      	   }},
			{ display: "编辑", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) {
					return '<a href="javascript:updateRuleHandler('+item.welfareTypeId+',\''+item.name+'\');" class="GridStyle">编辑</a>';
				} 
			},
      	   
		{display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return getStatusInfo(item.status);
			}
	     }
		],
		dataAction : 'server',
		url: web_app.name+'/welfareTypeAction!slicedQueryWelfareType.ajax',
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
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.welfareTypeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}


function getStatusInfo(sts) {
    switch (parseInt(sts)) {
        case -1:
            return "<div class='No' title='禁用'/>";
            break;
        case 0:
            return "<div class='tmp' title='草稿'/>";
            break;
        case 1:
            return "<div class='Yes' title='启用'/>";
            break;
    }
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/welfareTypeAction!showInsertWelfareType.load',
		ok: insert, 
		width:300,
		title:'添加福利类型',
		close: dialogClose});
}

//编辑按钮
function updateHandler(welfareTypeId){
	if(!welfareTypeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		welfareTypeId=row.welfareTypeId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/welfareTypeAction!showUpdateWelfareType.load', 
		param:{welfareTypeId:welfareTypeId}, 
		ok: update, 
		width:300,
		title:'修改福利类型',
		close: dialogClose});
}



//新增保存
function insert() {
	var welfareTypeId=$('#welfareTypeId').val();
	if(welfareTypeId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/welfareTypeAction!insertWelfareType.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#welfareTypeId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/welfareTypeAction!updateWelfareType.ajax',
		success : function() {
			refreshFlag = true;
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

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "welfareTypeAction!updateSequence.ajax";
	DataUtil.updateSequence({
		action : action,
		gridManager : gridManager,
		onSuccess : reloadGrid,
		idFieldName:'welfareTypeId'
});	
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'welfareTypeAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'welfareTypeId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'welfareTypeAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'welfareTypeId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//编辑按钮
function updateRuleHandler(id,display){
	UICtrl.showFrameDialog({
		title:'编辑['+display+']规则',
		url: web_app.name + '/welfareTypeAction!forwardListWelfareRule.do', 
		param:{welfareTypeId:id},
		height:290,
		width:650,
		okVal:'保存',
		ok:doSaveWelfareRule,
		cancel:true
	});
}

function doSaveWelfareRule(){
	var iframeWindow=this.iframe.contentWindow;
	var fn = iframeWindow.getData;
	if($.isFunction(fn)){
		var data=fn();
		Public.ajax(web_app.name + '/welfareTypeAction!saveWelfareRule.ajax', data, function(welfareRuleId) {
			iframeWindow.setId(welfareRuleId);
		});
	}
}
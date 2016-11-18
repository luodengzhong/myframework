var gridManager = null, refreshFlag = false;
var dataSource={
	yesOrNo:{1:'是',0:'否'},
	countingClass:{1:'固定计算',2:'业务计算'}
};
var canNotModif={standardPay:1,taxablePay:1,incomeTax:1,deductAll:1,totalPay:1,netPay:1};//不能修改的栏目
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#mainVisible').combox({data:dataSource.yesOrNo});
	dataSource['payItemKind']=$('#mainPayItemKind').combox('getJSONData');
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		loadArchivesFields:{id:'loadArchivesFields',text:'加载字段',img:'page_extension.gif',click:function(){
			Public.ajax(web_app.name + '/paySetupAction!loadPayItems.ajax', {}, function(data) {
				reloadGrid();
			});
		}},
		saveHandler:saveHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "字段编码", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "显示名称", name: "display", width: 200, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},	   
			{ display: "是否显示", name: "visible", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:dataSource.yesOrNo},
				render: function (item) { 
					return dataSource.yesOrNo[item.visible];
				} 
			},
			{ display: "是否求合", name: "isTotal", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:dataSource.yesOrNo},
				render: function (item) { 
					return dataSource.yesOrNo[item.isTotal];
				} 
			},
			{ display: "控制权限", name: "idAuthority", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:dataSource.yesOrNo},
				render: function (item) { 
					return dataSource.yesOrNo[item.idAuthority];
				} 
			},
			{ display: "栏目分类", name: "payItemKind", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:dataSource.payItemKind},
				render: function (item) {
					return dataSource.payItemKind[item.payItemKind];
				} 
			},
			{ display: "计算类别", name: "countingClass", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:dataSource.countingClass},
				render: function (item) {
					return dataSource.countingClass[item.countingClass];
				} 
			},
			{ display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,max:100,mask:'nnn'}
			},
			{ display: "编辑", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) {
					if(item.name!='standardPay'&&canNotModif[item.name]){
						return;
					}
					return '<a href="javascript:updateHandler('+item.id+','+item.visible+',\''+item.display+'\');" class="GridStyle">编辑</a>';
				} 
			},
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedQueryPayItemDefine.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{},
		onBeforeEdit:function(editParm){
			var c=editParm.column;
			if(c.name=='operationCode'||c.name=='visible'||c.name=='payItemKind'){//一些栏目不能编辑
			   return typeof canNotModif[editParm.record['name']]=='undefined';
			}
			return true;
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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
function saveHandler() {
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/paySetupAction!updatePayItemDefine.ajax', {itemDefineData:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
	return false;
}

//编辑按钮
function updateHandler(id,visible,display){
	UICtrl.showFrameDialog({
		title:'编辑['+display+']规则',
		url: web_app.name + '/paySetupAction!forwardListPayItemRule.do', 
		param:{itemId:id,defVisible:visible},
		height:290,
		width:650,
		okVal:'保存',
		ok:doSaveItemRule,
		cancel:true
	});
}
function doSaveItemRule(){
	var iframeWindow=this.iframe.contentWindow;
	var fn = iframeWindow.getData;
	if($.isFunction(fn)){
		var data=fn();
		Public.ajax(web_app.name + '/paySetupAction!savePayItemRule.ajax', data, function(id) {
			iframeWindow.setId(id);
		});
	}
}
//启用
function enableHandler(){
	DataUtil.updateById({ action: 'paySetupAction!updateItemStatus.ajax',
		gridManager: gridManager, param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'paySetupAction!updateItemStatus.ajax',
		gridManager: gridManager,param:{status:-1},
		onCheck:function(data){
			if(canNotModif[data['name']]===1){
				Public.tip(data.display+'不能被停用!');
				return false;
			}
		},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

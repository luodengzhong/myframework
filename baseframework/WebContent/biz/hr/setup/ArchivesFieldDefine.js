var gridManager = null, refreshFlag = false;
var dataSource={
	status:{'1':'启用','-1':'禁用'},	
	yesOrNo:{1:'是',0:'否'},	
	controlType:{text:'text',date:'date',number:'number',money:'money',select:'select',dictionary:'dictionary'}	
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.HRArchivesFieldGroup,
		onbeforeShowMenu:function(node){
			var id=node.data.id;
			if(id!=CommonTreeKind.HRArchivesFieldGroup){
				this.treeMenu.setDisable("menuAdd");
			}else{
				this.treeMenu.setEnable("menuAdd");
			}
		},
		onClick : onFolderTreeNodeClick
	});
	$('#mainNullable').combox({data:dataSource.yesOrNo});
	$('#mainControlType').combox({data:dataSource.controlType});
	$('#mainStatus').combox({data:dataSource.status});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.HRArchivesFieldGroup){
		parentId="";
		html.push('字段分组');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>字段分组');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{groupId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		loadArchivesFields:{id:'loadArchivesFields',text:'加载字段',img:'page_extension.gif',click:function(){
			Public.ajax(web_app.name + '/hrSetupAction!loadArchivesFields.ajax', {}, function(data) {
				reloadGrid();
			});
		}},
		saveHandler:saveHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		moveHandler:moveHandler,
		previewHandler:{id:'previewHandler',text:'预览',img:'page_video.gif',click:previewHandler}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "字段编码", name: "name", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "显示名称", name: "display", width: 100, minWidth: 60, type: "string", align: "left",frozen: true,
			editor: { type: 'text',required:true}
		},
		{ display: "是否显示", name: "visible", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.visible];
			} 
		},
		{ display: "跨列数", name: "colspan", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',mask:'n'}
		},		   
		{ display: "只读", name: "readOnly", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.readOnly];
			} 
		},		   
		{ display: "允许为空", name: "nullable", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.nullable];
			} 
		},		   
		{ display: "字段长度", name: "fieldLength", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',mask:'nnn'}
		},		   
		{ display: "字段精度", name: "fieldPrecision", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',mask:'n'}
		},		   
		{ display: "控件类型", name: "controlType", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.controlType}
		}, 
		{ display: "数据源", name: "dataSource", width: 160, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',maxLength:100}
		},
		{ display: "新行显示", name: "newLine", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.newLine];
			} 
		},
		{ display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'spinner',min:1,max:100,mask:'nnn'}
		},
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			} 
		},
		{ display: "员工可编辑", name: "staffIsEdit", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.staffIsEdit];
			} 
		},
		{ display: "花名册默认", name: "rosterDisplay", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'spinner',min:1,max:100,mask:'nnn'}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryArchivesFieldDefine.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		autoAddRow:{},
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
    if(!$('#nullParent1').is(':checked')) {
    	param['nullParent']='';
    }
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

function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/hrSetupAction!updateArchivesFieldDefine.ajax', {fieldDefineData:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
	return false;
}


//启用
function enableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateArchivesFieldStatus.ajax',
		gridManager: gridManager,idFieldName:'fieldId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateArchivesFieldStatus.ajax',
		gridManager: gridManager,idFieldName:'fieldId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动到...',kindId:CommonTreeKind.HRArchivesFieldGroup,
		save:function(parentId){
			DataUtil.updateById({action:'hrSetupAction!updateArchivesFieldGroupId.ajax',
				gridManager:gridManager,idFieldName:'fieldId',param:{groupId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}

function previewHandler(){
	UICtrl.showFrameDialog({title:'预览',url:web_app.name + '/hrArchivesAction!showInsert.do?flag=false',ok:false}).max();
}

var gridManager = null, refreshFlag = false,dictDetalGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();

	$('#maintree').commonTree({
		kindId : CommonTreeKind.Dictionary,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.Dictionary){
		parentId="";
		html.push('系统字典列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>系统字典列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: addHandler,
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		moveHandler:moveHandler,
		syncCache:{id:'syncCache',text:'同步缓存',img:'page_dynamic.gif',click:function(){
			Public.ajax(web_app.name + "/sysDictionaryAction!syncCache.ajax");
		}}
	});
	//,exportExcelHandler:function(){UICtrl.gridExport(gridManager,{fileName:'测试'});}
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 150, minWidth: 60, type: "string", align: "left" },				   
		{ display: "类别", name: "kind", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.kind==1?'用户':'系统'; 
			} 
		},	
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			} 
		},
		{ display: "备注", name: "remark", width: 300, minWidth: 60, type: "string", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/sysDictionaryAction!slicedQueryDictionary.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'code',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox: true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
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
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/sysDictionaryAction!showInsertDictionary.load',
		title: "添加系统字典",
		ok: insert, 
		close: dialogClose,
		width:750, 
		init:initDialog
	});
}

//编辑按钮
function updateHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	if(parseInt(data.status)!=0){
		if(parseInt(data.kind)==0){
			Public.errorTip('该类别的字典无法编辑！'); 
			return;
		}
	}
	dictId=data.dictId;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/sysDictionaryAction!showUpdateDictionary.load', 
		title: "修改系统字典",
		param:{dictId:dictId},width:750,
		ok: update, close: dialogClose,init:initDialog
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'sysDictionaryAction!deleteDictionary.ajax',
		gridManager:gridManager,idFieldName:'dictId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.name+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var dictIdDetal=$('#dictIdDetal').val();
	if(dictIdDetal!='') return update();
	var detailData=DataUtil.getGridData({gridManager:dictDetalGridManager});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/sysDictionaryAction!insertDictionary.ajax',
		param:{parentId:$('#treeParentId').val(),detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			$('#dictIdDetal').val(id);
			dictDetalGridManager.options.parms['dictId']=id;
			dictDetalGridManager.loadData();
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	var detailData=DataUtil.getGridData({gridManager:dictDetalGridManager,idFieldName:'detailId'});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/sysDictionaryAction!updateDictionary.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function() {
			refreshFlag = true;
			dictDetalGridManager.loadData();
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

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动数据字典',kindId:CommonTreeKind.Dictionary,
		save:function(parentId){
			DataUtil.updateById({action:'sysDictionaryAction!moveDictionary.ajax',
				gridManager:gridManager,idFieldName:'dictId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}


//启用
function enableHandler(){
	DataUtil.updateById({ action: 'sysDictionaryAction!updateDictionaryStatus.ajax',
		gridManager: gridManager,idFieldName:'dictId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'sysDictionaryAction!updateDictionaryStatus.ajax',
		gridManager: gridManager,idFieldName:'dictId', param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function initDialog(doc){
	var dictId=$('#dictIdDetal').length>0?$('#dictIdDetal').val():'';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: function(){
			//新增时传入detailId -(new Date().getTime())临时主键
			UICtrl.addGridRow(dictDetalGridManager);
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'sysDictionaryAction!deleteDictionaryDetail.ajax',
				gridManager:dictDetalGridManager,idFieldName:'detailId',
				onCheck:function(data){
					if(parseInt(data.status)!=0){
						Public.tip(data.name+'不是草稿状态,不能删除!');
						return false;
					}
				},
				onSuccess:function(){
					dictDetalGridManager.loadData();
				}
			});
		},
		enableHandler: function(){
			enableOrDisableDictDetal(1);
		},
		disableHandler: function(){
			enableOrDisableDictDetal(-1);
		}
	});
	var param={dictId:dictId};
	param[gridManager.options['pagesizeParmName']]=1000;
	dictDetalGridManager=UICtrl.grid('#dictDetalGrid', {
		 columns: [
		        { display: "成员名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left",
		        	editor: { type: 'text',required:true}
		        },	
		        { display: "成员值", name: "value", width: 250, minWidth: 60, type: "string", align: "left",
		        	editor: { type: 'text',required:true}
		        },	
		        { display: "成员类别", name: "type", width: 84, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'text'}
				},
		        { display: "排序号", name: "sequence", width: 64, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'spinner',min:1,max:100,mask:'nnn'}
				},
				{ display: "状态", name: "status", width: 70, minWidth: 60, type: "string", align: "left",
					render: function (item) { 
						return UICtrl.getStatusInfo(item.status);
					}
				},
				{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left",
					editor: { type:'text'}
				}
		],
		dataAction : 'server',
		url: web_app.name+'/sysDictionaryAction!slicedQueryDictionaryDetail.ajax',
		parms:param,
		width : 715,
		sortName:'sequence',
		sortOrder:'asc',
		height : '100%',
		heightDiff : -60,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		autoAddRow:{status:0},
		onBeforeEdit:function(editParm){
			var c=editParm.column;
			if(c.name=='value'){//启用的数据value 不能编辑
			   return editParm.record['status']===0;
			}
			return true;
		},
		onLoadData :function(){
			return !($('#dictIdDetal').val()=='');
		}
	});
}
function enableOrDisableDictDetal(status){
	//判断是否存在新增数据,如果存在则先提示用户保存
	var data=DataUtil.getUpdateAndAddData(dictDetalGridManager);
	if(data.length>0){
		Public.tip("数据已经改变,请执行保存后再执行该操作!");
		return false;
	}
	var message=status==1?'确实要启用选中数据吗?':'确实要禁用选中数据吗?';
	DataUtil.updateById({ action: 'sysDictionaryAction!updateDictionaryDetailStatus.ajax',
		gridManager: dictDetalGridManager,idFieldName:'detailId', param:{status:status},
		message: message,
		onSuccess:function(){
			dictDetalGridManager.loadData();
		}
	});	
}

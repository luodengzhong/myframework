var gridManager = null, refreshFlag = false,lastSelectedId = 0;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'aboutAction!loadTrees.ajax',
		parentId :'0',
		idFieldName: 'helpId',
        textFieldName: "helpName",
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	if(data){
		var helpId=data.helpId;
		if (lastSelectedId != helpId) {
			confirm(function(){
				loadHelp(helpId);
				changeTitle(data.helpName);
			});
		}
	}else{
		clearData('');
	}
}

function loadHelp(helpId){
	Public.ajax(web_app.name + '/aboutAction!loadHelp.ajax', {helpId:helpId}, function(data){
		$.each(data,function(p,v){$('#'+p).val(v);});
		$('#status1').setValue(data['status']);
		if(gridManager){
			//清除表格数据
			gridManager._clearGrid();
		}
		UICtrl.gridSearch(gridManager,{helpId:helpId});
		lastSelectedId=helpId;
	});
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(gridManager);
		},
		deleteHandler: deleteDetail,
		enableHandler: function(){
			enableOrDisableDictDetal(1);
		},
		disableHandler: function(){
			enableOrDisableDictDetal(-1);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
		{ display: "业务编码", name: "bizCode", width: '15%', minWidth: 60, type: "string", align: "left",editor: { type: 'text',required:true}},
		{ display: "标签ID", name: "tagId", width: '70%', minWidth: 60, type: "string", align: "left",editor: { type: 'text'}},
		{ display: "状态", name: "status", width: '5%', minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/aboutAction!slicedQueryHelpDetail.ajax',
		parms :{pagesize:100},
		width : '99%',
		height : '100%',
		heightDiff : -45,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'helpId',
		sortOrder:'asc',
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{status:1},
		onLoadData :function(){
			return canEidt();
		}
	});
}
function canEidt(){
	var helpId=$('#helpId').val();
	return !(helpId=='');
}
//刷新树
function reloadTree(id,type) {
	$("#maintree").commonTree('refresh',id,type);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
}
//删除明细
function deleteDetail(){
	DataUtil.delSelectedRows({action:'aboutAction!deleteHelpDetail.ajax',
		gridManager:gridManager,idFieldName:'helpDetailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
function enableOrDisableDictDetal(status){
	//判断是否存在新增数据,如果存在则先提示用户保存
	if(hasModifDetailData()){
		Public.tip("数据已经改变,请执行保存后再执行该操作!");
		return false;
	}
	var message=status==1?'确实要启用选中数据吗?':'确实要禁用选中数据吗?';
	DataUtil.updateById({ action: 'aboutAction!updateHelpDetailStatus.ajax',
		gridManager: gridManager,idFieldName:'helpDetailId', param:{status:status},
		message: message,
		onSuccess:function(){
			reloadGrid();
		}
	});	
}

//编辑保存
function saveHelp(){
	var detailData=DataUtil.getGridData({gridManager:gridManager,idFieldName:'helpDetailId'});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/aboutAction!saveHelp.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function(id) {
			var type=1;
			if($('#helpId').val()==''){
				type=2;
			}
			$('#helpId').val(id);
			reloadGrid();
			reloadTree($('#parentId').val(),type);
		}
	});
}

//删除按钮
function deleteHelp(){
	if(!canEidt()){
		Public.tip('请选择要删除的节点!');
		return false;
	}
	var helpId=$('#helpId').val();
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/aboutAction!deleteHelp.ajax', {helpId:helpId}, function(){
			reloadTree($('#parentId').val(),1);
			clearData('0');
		});
	});
}

//判断是否存在修改后未保存的数据
function hasModifDetailData(){
	var data=DataUtil.getUpdateAndAddData(gridManager);
	return data.length>0;
}
//数据改变提示
function confirm(fn){
	if(!$.isFunction(fn)){
		return;
	}
	if(hasModifDetailData()){
		UICtrl.confirm("数据已经改变,是否继续该操作!",function(){
			fn.call(window);
		});
	}else{
		fn.call(window);
	}
}
//清除页面数据
function clearData(parentId){
	$('#submitForm').formClean();
	$('#parentId').val(parentId);
	$('#status1').setValue(1);
	//清除表格数据
	if(gridManager){
		gridManager._clearGrid();
	}
}
//改变现实的表头
function changeTitle(title){
	var html=[];
	if(title){
		html.push('<font style="color:Tomato;font-size:13px;">[',title,']</font>');
	}
	html.push('详细信息');
	$('.l-layout-center .l-layout-header').html(html.join(''));
}
function add(no){
	var node=$('#maintree').commonTree('getSelected');
	var parentId='0';
	if(!node){//没有选中节点表示新增根节点
		if(no==1){
			Public.tip('请选择要操作的节点!');
			return false;
		}
	}else{//有选中节点
	   if(no==0){//新增选中节点的同级节点
		   parentId=node.parentId;
	   }else{//新增子级
		   parentId=node.helpId;
	   }
	}
	confirm(function(){
		clearData(parentId);
		changeTitle();
	});
}
function closeWindow(){
	UICtrl.closeCurrentTab();
}
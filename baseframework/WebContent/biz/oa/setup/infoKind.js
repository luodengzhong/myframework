var senderPriorityGridManager = null, permissionGridManager = null,refreshFlag = false,lastSelectedId = 0;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeSenderPriorityGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'infoKindAction!loadTrees.ajax',
		parentId :'0',
		idFieldName: 'infoKindId',
        textFieldName: "name",
		IsShowMenu:false,
		changeNodeIcon:function(data){
			var url=web_app.name + "/themes/default/images/org/";
			var hasChildren=data.hasChildren;
			var status=data.status;
			url += hasChildren>0?'org':'dataRole';
			url += status>0?'.gif':'-disable.gif';
			data['nodeIcon']=url;
		},
		onClick : onFolderTreeNodeClick
	});
	$('#infoKindTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='permission'){
				if(!permissionGridManager){
					//点击再初始化权限设置表格
					initializePermissionGrid();
				}
				permissionGridManager._onResize.ligerDefer(permissionGridManager, 50);
			}else{
				senderPriorityGridManager._onResize.ligerDefer(senderPriorityGridManager, 50);
			}
		}
	});
}

function onFolderTreeNodeClick(data,folderId) {
	if(data){
		var infoKindId=data.infoKindId;
		if (lastSelectedId != infoKindId) {
			confirm(function(){
				loadInfoKind(infoKindId);
				changeTitle(data.name);
			});
		}
	}else{
		clearData('');
	}
}

function loadInfoKind(infoKindId){
	Public.ajax(web_app.name + '/infoKindAction!loadInfoKind.ajax', {infoKindId:infoKindId}, function(data){
		$.each(data,function(p,v){$('#'+p).val(v);});
		$('#isNeedDispatchNo1').setValue(data['isNeedDispatchNo']);
		$('#isCanCreateTask1').setValue(data['isCanCreateTask']);
		$('#isNeedSendMessage1').setValue(data['isNeedSendMessage']);
		$('#isSendClientMessage1').setValue(data['isSendClientMessage']);
		$('#statusTextView').val(data['status']==1?'启用':'停用');
		$('#input_icopath').val(data['imgPath']);
		//清除表格数据
		if(senderPriorityGridManager){
			senderPriorityGridManager._clearGrid();
			UICtrl.gridSearch(senderPriorityGridManager,{infoKindId:infoKindId});
		}
		if(permissionGridManager){
			permissionGridManager._clearGrid();
			UICtrl.gridSearch(permissionGridManager,{infoKindId:infoKindId});
		}
		lastSelectedId=infoKindId;
	});
}

//初始化表格
function initializeSenderPriorityGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name']});
					addRows.push(row);
				});
				senderPriorityGridManager.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'infoKindAction!deleteInfoKindSenderPriority.ajax',
				gridManager:senderPriorityGridManager,idFieldName:'infoKindSenderPriorityId',
				onSuccess:function(){
					senderPriorityGridManager.loadData();
				}
			});
		}
	});
	senderPriorityGridManager = UICtrl.grid('#senderPriorityGrid', {
		columns: [	   
		{ display: "组织单元名称", name: "orgUnitName", width: '140', minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "类型", name: "orgKindId", width: '60', minWidth: 40, type: "string", align: "left",
			render: function (item) {
                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
             }
		},
		{ display: "机构路径", name: "fullName", width: '400', minWidth: 60, type: "string", align: "left"},
		{ display: "优先级系数", name: "priorityCoefficient", width: '80', minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true,mask:'nnn.n'}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/infoKindAction!slicedQueryInfoKindSenderPriority.ajax',
		parms :{pagesize:100,infoKindId:$('#infoKindId').val()},
		width : '99.5%',
		height : '100%',
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
}

function initializePermissionGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name']});
					addRows.push(row);
				});
				permissionGridManager.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'infoKindAction!deleteInfoKindPermission.ajax',
				gridManager:permissionGridManager,idFieldName:'infoKindPermissionId',
				onSuccess:function(){
					permissionGridManager.loadData();
				}
			});
		}
	});
	permissionGridManager = UICtrl.grid('#permissionGrid', {
		columns: [	   
		{ display: "组织单元名称", name: "orgUnitName", width: '140', minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "类型", name: "orgKindId", width: '60', minWidth: 40, type: "string", align: "left",
			render: function (item) {
                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
             }
		},
		{ display: "机构路径", name: "fullName", width: '500', minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/infoKindAction!slicedQueryInfoKindPermission.ajax',
		parms :{pagesize:100,infoKindId:$('#infoKindId').val()},
		width : '99.5%',
		height : '100%',
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
}
//打开机构选择对话框
function showChooseOrgDialog(fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function canEidt(){
	var infoKindId=$('#infoKindId').val();
	return !(infoKindId=='');
}
//刷新树
function reloadTree(id,type) {
	if(id=='0'){
		$("#maintree").commonTree('refresh');
	}else{
		$("#maintree").commonTree('refresh',id,type);
	}
}
//刷新表格
function reloadGrid() {
	if(senderPriorityGridManager){
		senderPriorityGridManager.loadData();
	}
	if(permissionGridManager){
		permissionGridManager.loadData();
	}
}
//功能分类
var functionImgsDirList=[
	{name:'3D',code:'3d'},
	{name:'A',code:'a'},
	{name:'B',code:'b'},
	{name:'blue',code:'blue'},
	{name:'C',code:'c'},
	{name:'D',code:'d'},
	{name:'ginux',code:'ginux'},
	{name:'green',code:'green'},
	{name:'H',code:'h'},
	{name:'index',code:'index'},
	{name:'O',code:'o'},
	{name:'OA',code:'oa'},
	{name:'PM',code:'pm'},
	{name:'stat',code:'stat'},
	{name:'T',code:'t'},
	{name:'INFO',code:'info'}
];
function chooseImg(){
	if(!canEidt()){
		Public.tip('请选择要操作的节点!');
		return false;
	}
	var infoKindId=$('#infoKindId').val();
	var imgUrl = '/desktop/images/functions/';
	var nowChooseImg = $('#input_icopath').val(),display = nowChooseImg == ''? "none": "";
	var html = ['<div id="showImgMain">'];
	html.push('<div id="showFunctionImgDirs">');
	$.each(functionImgsDirList,function(i,o){
		html.push('<a href="#" class="aLink',(i==0?' right_selected':''),'" id="',o['code'],'">',o['name'],'</a>');
	});
	html.push('</div>');
	html.push('<div id="showFunctionImgs"></div>');
	html.push('<div id="showChooseOk">');
	html.push('<input type="hidden" value="',nowChooseImg,'" id="nowChooseValue">');
	html.push('<p><img src="' , web_app.name , nowChooseImg, '" style="display:' , display, '" width="68" height="68" id="nowChooseImg"/></p>');
	html.push('<p><input type="button" value="确 定" class="buttonGray" style="display:',display , '" id="nowChooseBut"/></p>');
	html.push('</div>');
	html.push('</div>');
	Public.dialog({
		title:'选择图片',
		content:html.join(''),
		width: 620,
		opacity:0.1,
		onClick:function($clicked){
			if ($clicked.is('img')) {
				var dirName=$('a.right_selected',$('#showFunctionImgDirs')).attr('id');
				var icon = $clicked.parent().attr('icon');
				$('#nowChooseImg').attr('src',web_app.name + imgUrl +dirName + '/'+ icon).show();
				$('#nowChooseBut').show();
				$('#nowChooseValue').val(imgUrl +dirName + '/'+ icon);
			} else if ($clicked.is('input')) {// 点击按钮
				$('#input_icopath').val($('#nowChooseValue').val());
				this.close();
			}else if ($clicked.is('a.aLink')) {// 类别选择
				var id=$clicked.attr('id');
				$('a.right_selected',$('#showFunctionImgDirs')).removeClass('right_selected');
				$clicked.addClass('right_selected');
				$('#showFunctionImgs').scrollReLoad({params:{dirName:id}});
			}
		}
	});
	setTimeout(function() {
		$('#showFunctionImgs').scrollLoad({
			url : web_app.name+ '/permissionAction!getFunctionImgList.ajax',
			itemClass : 'functionImg',
			params:{dirName:functionImgsDirList[0]['code']},
			size : 20,
			scrolloffset : 70,
			onLoadItem : function(obj) {
				var dirName=$('a.right_selected',$('#showFunctionImgDirs')).attr('id');
				var imgHtml = ['<div class="functionImg" icon="', obj,'">'];
				imgHtml.push('<img src="' , web_app.name, imgUrl,dirName,'/' , obj,'"  width="64" height="64"/>');
				imgHtml.push('</div>');
				return imgHtml.join('');
			}
		});
	},0);
}
//启用or停用
function enableOrDisable(status){
	if(!canEidt()){
		Public.tip('请选择要操作的节点!');
		return false;
	}
	var infoKindId=$('#infoKindId').val();
	//判断是否存在新增数据,如果存在则先提示用户保存
	if(hasModifDetailData()){
		Public.tip("数据已经改变,请执行保存后再执行该操作!");
		return false;
	}
	var message=status==1?'确实要启用选中数据及下级数据吗?':'确实要禁用选中数据及下级数据吗?';
	UICtrl.confirm(message,function(){
		Public.ajax(web_app.name + '/infoKindAction!updateInfoKindStatus.ajax', {infoKindId:infoKindId,status:status}, function(){
			reloadTree($('#parentId').val(),1);
			$('#statusTextView').val(status==1?'启用':'停用');
		});
	});
}

//编辑保存
function saveKind(){
	var senderPriorityData=[],permissionData=[];
	if(senderPriorityGridManager){
		senderPriorityData=DataUtil.getGridData({gridManager:senderPriorityGridManager,idFieldName:'infoKindSenderPriorityId'});
		if(!senderPriorityData) return false;
	}
	if(permissionGridManager){
		permissionData=DataUtil.getGridData({gridManager:permissionGridManager,idFieldName:'infoKindPermissionId'});
		if(!permissionData) return false;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/infoKindAction!saveInfoKind.ajax',
		param:{senderPriorityData:encodeURI($.toJSON(senderPriorityData)),permissionData:encodeURI($.toJSON(permissionData))},
		success : function(id) {
			var infoKind=$('#infoKindId'),parent=$('#parentId');
			var type=1;
			if(infoKind.val()==''){
				type=2;
			}
			if(parent.val()==''){
				parent.val('0');
			}
			infoKind.val(id);
			reloadGrid();
			reloadTree(parent.val(),type);
		}
	});
}

//删除按钮
function deleteKind(){
	if(!canEidt()){
		Public.tip('请选择要删除的节点!');
		return false;
	}
	var infoKindId=$('#infoKindId').val();
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/infoKindAction!deleteInfoKind.ajax', {infoKindId:infoKindId}, function(){
			reloadTree($('#parentId').val(),1);
			clearData('0');
		});
	});
}

//判断是否存在修改后未保存的数据
function hasModifDetailData(){
	var senderPriorityData=[],permissionData=[];
	if(senderPriorityGridManager){
		senderPriorityData=DataUtil.getUpdateAndAddData(senderPriorityGridManager);
		if(senderPriorityData.length>0){
			return true;
		}
	}
	if(permissionGridManager){
		permissionData=DataUtil.getUpdateAndAddData(permissionGridManager);
		if(permissionData.length>0){
			return true;
		}
	}
	return false;
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
	//清除表格数据
	if(senderPriorityGridManager){
		senderPriorityGridManager._clearGrid();
	}
	if(permissionGridManager){
		permissionGridManager._clearGrid();
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
		   parentId=node.infoKindId;
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
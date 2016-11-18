var permissionGridManager = null,refreshFlag = false,lastSelectedId = 0;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializePermissionGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 250,heightDiff : -5});
	
	$('#maintree').commonTree({
		loadTreesAction:'examSetUpAction!loadExaminationTypeTree.ajax',
		parentId :'0',
		idFieldName: 'examQuestionTypeId',
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

	$('#examinationTypeToolBar').toolBar([
		{ id: 'save', name: '保存', icon: 'save', event: saveExamQuestionType },
	    { line: true},
		{ id: 'add0', name: '新增同级', icon: 'add', event: function(){add(0);} },
	    { line: true},
	    { id: 'add1', name: '新增子级', icon: 'edit', event: function(){add(1);} },
	    { line: true},
	    { id: 'delete', name: '删除', icon: 'delete', event: deleteExamQuestionType },
	    { line: true},
	    { id: 'enable', name: '启用', icon: 'enable', event: function(){enableOrDisable(1);} },
	    { line: true},
	    { id: 'disable', name: '停用', icon: 'disable', event: function(){enableOrDisable(-1);} },
	    { line: true},
	    { id: 'move', name: '移动', icon: 'copy', event: moveExamQuestionType },
	    { line: true}
    ]);
}

function onFolderTreeNodeClick(data,folderId) {
	if(data){
		var examQuestionTypeId=data.examQuestionTypeId;
		if (lastSelectedId != examQuestionTypeId) {
			confirm(function(){
				loadExaminationType(examQuestionTypeId);
				changeTitle(data.name);
			});
		}
	}else{
		clearData('');
	}
}

function loadExaminationType(examQuestionTypeId){
	Public.ajax(web_app.name + '/examSetUpAction!loadExaminationType.ajax', {examQuestionTypeId:examQuestionTypeId}, function(data){
		$.each(data,function(p,v){$('#'+p).val(v);});
		$('#examQuestionTypeId').val(examQuestionTypeId);
		$('#statusTextView').val(data['status']==1?'启用':'停用');
		if(permissionGridManager){
			permissionGridManager._clearGrid();
			UICtrl.gridSearch(permissionGridManager,{questionTypeId:examQuestionTypeId});
		}
		lastSelectedId=examQuestionTypeId;
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
			DataUtil.delSelectedRows({action:'examSetUpAction!deleteExamQuestionTypePermission.ajax',
				gridManager:permissionGridManager,idFieldName:'examQuestionPermissionId',
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
		title:'权限设置',
		url: web_app.name+'/examSetUpAction!slicedQueryExamQuestionTypePermission.ajax',
		parms :{pagesize:100,questionTypeId:$('#examQuestionTypeId').val()},
		width : '99.5%',
		height : '100%',
		heightDiff : -20,
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
	var examQuestionTypeId=$('#examQuestionTypeId').val();
	return !(examQuestionTypeId=='');
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
	if(permissionGridManager){
		permissionGridManager.loadData();
	}
}
//启用or停用
function enableOrDisable(status){
	if(!canEidt()){
		Public.tip('请选择要删除的节点!');
		return false;
	}
	var examQuestionTypeId=$('#examQuestionTypeId').val();
	//判断是否存在新增数据,如果存在则先提示用户保存
	if(hasModifDetailData()){
		Public.tip("数据已经改变,请执行保存后再执行该操作!");
		return false;
	}
	var message=status==1?'确实要启用选中数据及下级数据吗?':'确实要禁用选中数据及下级数据吗?';
	UICtrl.confirm(message,function(){
		Public.ajax(web_app.name + '/examSetUpAction!updateExamQuestionTypeStatus.ajax', {examQuestionTypeId:examQuestionTypeId,status:status}, function(){
			reloadTree($('#parentId').val(),1);
			$('#statusTextView').val(status==1?'启用':'停用');
		});
	});
}
//移动
function moveExamQuestionType(){
	if(!canEidt()){
		Public.tip('请选择要移动的节点!');
		return false;
	}
	UICtrl.showDialog({title: "移动到...",width: 350,
		content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul></ul></div>',
        init: function (doc) {
        	$('ul',doc).commonTree({
					loadTreesAction:'examSetUpAction!loadExaminationTypeTree.ajax',
					parentId :'0',
					idFieldName: 'examQuestionTypeId',
			        textFieldName: "name",
					IsShowMenu:false,
					getParam:function(){//不能移动到自己或自己一下的节点
						return {notLikeFullId:$('#typeFullId').val()};//只查询启用的数据
					}
			});
        },
        ok: function(doc){
            var examQuestionTypeId=$('#examQuestionTypeId').val();
            var moveToNode = $('ul',doc).commonTree('getSelected');
		    var moveToId = moveToNode.examQuestionTypeId;
		    if (!moveToId) {
		        Public.tip('请选择移动到的节点！');
		        return false;
		    }
		    var _self=this;
		    var params = {examQuestionTypeId:examQuestionTypeId,moveToId:moveToId};
		    Public.ajax("examSetUpAction!moveExamQuestionType.ajax", params, function (data) {
		    	reloadTree(0,1);//移动后刷新根节点
		       _self.close();
		    });
		    return false;
        }
    });
}
//编辑保存
function saveExamQuestionType(){
	var permissionData=[];
	if(permissionGridManager){
		permissionData=DataUtil.getGridData({gridManager:permissionGridManager,idFieldName:'examQuestionTypeId'});
		if(!permissionData) return false;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/examSetUpAction!saveExamQuestionType.ajax',
		param:{permissionData:encodeURI($.toJSON(permissionData))},
		success : function(id) {
			var examQuestionTypeId=$('#examQuestionTypeId'),parent=$('#parentId');
			var type=1;
			if(examQuestionTypeId.val()==''){
				type=2;
			}
			if(parent.val()==''){
				parent.val('0');
			}
			examQuestionTypeId.val(id);
			reloadTree(parent.val(),type);
			permissionGridManager.options.parms['questionTypeId'] =id;
			permissionGridManager.loadData();
			changeTitle($('#name').val());
		}
	});
}

//删除按钮
function deleteExamQuestionType(){
	if(!canEidt()){
		Public.tip('请选择要删除的节点!');
		return false;
	}
	var examQuestionTypeId=$('#examQuestionTypeId').val();
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/examSetUpAction!deleteExamQuestionType.ajax', {examQuestionTypeId:examQuestionTypeId}, function(){
			reloadTree($('#parentId').val(),1);
			clearData('0');
			changeTitle();
		});
	});
}

//判断是否存在修改后未保存的数据
function hasModifDetailData(){
	var permissionData=[];
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
	var title='';
	if(!node){//没有选中节点表示新增根节点
		Public.tip('请选择要操作的节点!');
		return false;
	}else{//有选中节点
	   if(no==0){//新增选中节点的同级节点
		   parentId=node.parentId;
		   title='新增('+node.name+')同级';
	   }else{//新增子级
		   parentId=node.examQuestionTypeId;
		   title='新增('+node.name+')子级';
	   }
	}
	confirm(function(){
		clearData(parentId);
		changeTitle(title);
		$('#statusTextView').val('启用');
	});
}
function closeWindow(){
	UICtrl.closeCurrentTab();
}
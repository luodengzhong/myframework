var gridManager = null, refreshFlag = false;
var userGroupDetailGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight(function(pageSize){
		$('#groupViewArea').height(pageSize.h - 40);	
	});
	initializeGrid();
	initializeUI();
	bindEvent();
});
function initializeUI(){
	UICtrl.layout("#layout", { leftWidth : 200,rightWidth:250, heightDiff : -5 });
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds: "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : function(data){
			if(!data){
				return;
			}
			var groupId=$('#mainGroupId').val();
			if(groupId==''){
				return;
			}
			var fullId=data.fullId;
			UICtrl.gridSearch(gridManager,{fullId:fullId,groupId:groupId});
		}
	});
}

function bindEvent(){
	$('#groupViewArea').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id');
			$clicked.parent().addClass('divChoose');
			$('#mainGroupId').val(id);
			UICtrl.gridSearch(gridManager,{groupId:id,fullId:''});
			var html=['<font style="color:Tomato;font-size:13px;">[',$clicked.text(),']</font>成员列表'];
			$('.l-layout-center .l-layout-header').html(html.join(''));
		}
	});
}

function doEditGroup(){
	var id='',name='';
	var html=['<form method="post" action="" id="submitGroupForm"><div class="ui-form">'];
	html.push('<dl>');
	html.push('<dt style="width:70px">排序号<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="sequence" id="groupSequence" class="text" required="true" label="序号" value="',1,'" spinner="true" mask="nnnn"></dd>');
	html.push('</dl>');
	html.push('<dl>');
	html.push('<dt style="width:70px">名称<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="name" id="groupName" class="text" required="true" label="名称" value="',name,'"></dd>');
	html.push('</dl>');
	html.push('</div></form>');
	UICtrl.showDialog({title:'用户分组',width:300,top:150,
		content:html.join(''),
		ok:function(){
			var param=$('#submitGroupForm').formToJSON();
			if(!param) return false;
			param['groupId']=id;
			Public.ajax(web_app.name + "/oaSetupAction!saveUserGroupPersonOwner.ajax",param,function(data){
				queryUserOwnerGroup();
			});
			return true;
		}
   });
}

function queryUserOwnerGroup(fn){
	Public.ajax(web_app.name + "/oaSetupAction!getUserOwnerGroupList.ajax",{},function(data){
		var html = [];
		$.each(data, function(i, o){
			html.push('<div class="list_view" style="margin: 5px;">');
			html.push('<a href="javascript:void(0);" id="',o.groupId,'"  class="GridStyle">');
			html.push(o.name);
			html.push('</a>');
			html.push('</div>');
        });
		$('#userGroupEditListDiv').html(html.join(''));
	});
}
function doDelGroup(){
	var groupId=$('#mainGroupId').val();
	if(groupId==''){
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
	 	Public.ajax(web_app.name + '/oaSetupAction!deleteUserGroupPersonOwner.ajax', {groupId:groupId}, function(){
			queryUserOwnerGroup();
			UICtrl.gridSearch(gridManager,{groupId:0,fullId:''});
		});
	});
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteUserGroupDetail
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },	
		{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return '<font color="'+(item.status==1?'green':'red')+'">'+item.statusTextView+'</font>';
			}
		},
		{ display: "路径", name: "fullName", width:380, minWidth: 60, type: "string", align: "left" },
		{ display: "类别", name: "orgKindId", width: 60, minWidth: 60, type: "string", align: "left",
			 render: function (item) {
                  return OpmUtil.getOrgKindDisplay(item.orgKindId);
            }
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaSetupAction!slicedQueryUserGroupDetail.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.groupId);
		},
		onLoadData :function(){
			return !($('#mainGroupId').val()=='');
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
	var groupId=$('#mainGroupId').val();
	if(groupId==''){
		Public.tip('请选择自定义分组！'); 
		return;
	}
	addUserGroupDetail();
}



function addUserGroupDetail(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			var addRows=[],_self=this;;
			$.each(data,function(i,o){
				addRows.push($.extend({},o,{orgId:o['id']}));
			});
			var groupId=$('#mainGroupId').val();
			Public.ajax(web_app.name + '/oaSetupAction!saveUserGroupDetailByCheck.ajax',{groupId:groupId,detailData:encodeURI($.toJSON(addRows))},
				function(data) {
					reloadGrid();
					_self.close();
				}
			);
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function deleteUserGroupDetail(){
	DataUtil.delSelectedRows({action:'oaSetupAction!deleteUserGroupDetail.ajax',
		gridManager:gridManager,idFieldName:'groupDetailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
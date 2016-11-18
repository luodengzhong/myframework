var gridManager = null, refreshFlag = false,fieldType={},fieldAuthority={};
Public.tip.topDiff=7;
$(document).ready(function() {
	initializeUI();
	bindEvent();
	initGroupList();
	fieldType=$('#fieldType').combox('getJSONData');
	fieldAuthority=$('#fieldAuthority').combox('getJSONData');
});
function initGroupList(){
	setTimeout(function(){
		initializeGrid();
		$('#groupList').find('a.GridStyle').eq(0).trigger('click');
	},0);
}
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#typeToolBar').toolBar([
	  {id:'addGroup',name:'新增',icon:'add',event:function(){
		  doEditGroup();
	  }},
	  {line:true},
	  {id:'editGroup',name:'编辑',icon:'edit',event:function(){
		  var item=$('#groupList').find('div.div_select').find('a.GridStyle');
		  if(item.length>0){
			  doEditGroup(item);
		  }
	  }},
	  {line:true},
	  {id:'deleteGroup',name:'删除',icon:'delete',event:function(){
		  var item=$('#groupList').find('div.div_select').find('a.GridStyle');
		  if(item.length==0) return;
		  UICtrl.confirm('确定删除吗?',function(){
			  Public.ajax(web_app.name + '/permissionFieldAction!deleteFunctionFieldGroup.ajax', {functionFieldGroupId:item.attr('groupId')}, function(){
				  gridManager._clearGrid();
				  queryFunctionFieldGroup();
			  });
		  });
	  }},
	  {line:true}
	]);
}
function bindEvent(){
	$('#groupList').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$(this).find('.div_select').removeClass('div_select');
			$clicked.parent().addClass('div_select');
			$('#mainFunctionFieldGroupId').val($clicked.attr('groupId'));
			query();
			return false;
		}
	});
}

function queryFunctionFieldGroup(){
	var functionId=$('#functionId').val();
	Public.ajax(web_app.name + "/permissionFieldAction!queryFunctionFieldGroup.ajax",{functionId:functionId},function(data){
		var html = [];
		$.each(data, function(i, o){
			html.push('<div style="padding-left:10px;padding-top:2px;line-height:22px;">');
			html.push('<a href="javascript:void(null);" class="GridStyle" ');
			html.push('groupId="',o.functionFieldGroupId,'" ');
			html.push('code="',o.code,'">');
			html.push(o.name,'</a>');
			html.push('</span>');
			html.push('</div>');
        });
		$('#mainFunctionFieldGroupId').val('');
		$("#groupList").html(html.join(""));
		initGroupList();
	});
}
function doEditGroup(item){
	var id='',name='',code='';
	if(item){
		id=item.attr('groupId');
		code=item.attr('code');
		name=$.trim(item.text());
	}
	var html=['<form method="post" action="" id="submitGroupForm"><div class="ui-form">'];
	html.push('<dl>');
	html.push('<dt style="width:70px">编码<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="code" id="groupCode" class="text" required="true" label="编码" value="',code,'"></dd>');
	html.push('</dl>');
	html.push('<dl>');
	html.push('<dt style="width:70px">名称<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="name" id="groupName" class="text" required="true" label="名称" value="',name,'"></dd>');
	html.push('</dl>');
	html.push('</div></form>');
	UICtrl.showDialog({title:'编辑分组',width:300,
		content:html.join(''),
		ok:function(){
			var param=$('#submitGroupForm').formToJSON();
			if(!param) return false;
			param['functionFieldGroupId']=id;
			param['functionId']=$('#functionId').val();
			var url=web_app.name + "/permissionFieldAction!insertFunctionFieldGroup.ajax";
			if(id!='') url=web_app.name + "/permissionFieldAction!updateFunctionFieldGroup.ajax";
			Public.ajax(url,param,function(data){
				queryFunctionFieldGroup();
			});
			return true;
		}
   });
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addBatchHandler: function(){
			if($('#mainFunctionFieldGroupId').val()==''){
				return;
			} 
			parent.showAddPermissionField(gridManager);
		},
		saveHandler:savePermissionField,
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'permissionFieldAction!deleteFunctionPermissionfield.ajax',
				gridManager:gridManager,idFieldName:'permissionFieldId',
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "字段编码", name: "fieldCode", width: 150, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   	
			{ display: "字段名称", name: "fieldName", width: 150, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   	   
			{ display: "字段类别", name: "fieldType", width: 80, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:fieldType,required: true},
				render: function (item) { 
					return fieldType[item.fieldType];
				}
			},		   
			{ display: "默认权限", name: "fieldAuthority", width:80, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:fieldAuthority,required: true},
				render: function (item) { 
					return fieldAuthority[item.fieldAuthority];
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/permissionFieldAction!slicedQueryFunctionPermissionfield.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'fieldCode',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		checkbox: true,
		selectRowButtonOnly : true,
		autoAddRow:{},
		onLoadData :function(){
			return !($('#mainFunctionFieldGroupId').val()=='');
		}
	});
}
function savePermissionField(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/permissionFieldAction!saveFunctionPermissionfield.ajax', 
		{
			functionFieldGroupId:$('#mainFunctionFieldGroupId').val(),
			detailData:encodeURI($.toJSON(detailData))
		},
		function(data) {
			reloadGrid();
		}
	);
	return false;
}
// 查询
function query() {
	var param ={functionFieldGroupId:$('#mainFunctionFieldGroupId').val()};
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}
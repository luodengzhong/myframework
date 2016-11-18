var gridManager = null, groupData ={};
var yesOrNo={1:'是',0:'否'};
var controlType={'input':'文本','date':'日期','datetime':'日期时间','textarea':'多行文本','radio':'单选','checkbox':'多选','select':'下拉选择'};
var dataSourceKind={'array':'集合','json':'JSON','dictionary':'数据字典'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	bindEvent();
});

function initializeUI(){
	UICtrl.initDefaulLayout();
    $('#divTreeArea').find('div.list_view>a').each(function(){
    	groupData[$(this).attr('id')]=$(this).attr('title');
    });
}

function bindEvent(){
	$('#divTreeArea').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id'),title=$clicked.attr('title');
			$('#mainKindFieldGroupId').val(id);
			var html=['<font style="color:Tomato;font-size:13px;">[',title,']</font>字段列表'];
			$('#layout>.l-layout-center>.l-layout-header').html(html.join(''));
			UICtrl.gridSearch(gridManager,{kindFieldGroupId:id});
			$clicked.parent().addClass('divChoose');
		}
	});
	$('#toolbar_menuAdd').comboDialog({type:'oa',name:'queryDataCollectionField',
		dataIndex:'columnName',
		checkbox:true,
		title:'字段选择',
		getParam:function(){return {dataCollectionKindId:$('#mainDataCollectionKindId').val()}},
		onShow:function(){
			var id=$('#mainKindFieldGroupId').val();
			if(id==''){
				Public.tip("请选择对应的字段分组！");
				return false;
			}
		},
		onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	if(!rows||rows.length==0){
	    		Public.tip("请选择字段！");
	    		return false;
	    	}
	    	var addRows = [],dataType;
	    	$.each(rows, function(i, o){
	    		dataType=o['dataType'];
	    		addRows.push({
	    			displayName:o['columnName'],
	    			fieldName:o['columnName'].toLowerCase(),
	    			fieldType:dataType,
	    			controlType:dataType=='DATE'?'date':'input',
	    			fieldLength:dataType=='VARCHAR2'?o['length']/2:o['length']
	    		});
	    	});
	    	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	    	var kindFieldGroupId=$('#mainKindFieldGroupId').val();
	    	var url= web_app.name +'/dataCollectionAction!saveDataCollectionFieldDefin.ajax';
			Public.ajax(url,{kindFieldGroupId:kindFieldGroupId,dataCollectionKindId:dataCollectionKindId,detailData:encodeURI($.toJSON(addRows))},function(){
				reloadGrid();
			});
	    	return true;
    }});
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:saveHandler,
		addHandler: function(){}, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'dataCollectionAction!deleteDataCollectionFieldDefin.ajax',
				gridManager: gridManager,idFieldName:'kindFieldDefineId',
				onCheck:function(data){
					if(parseInt(data.status)!=0){
						Public.tip(data.displayName+'不是草稿状态,不能删除!');
						return false;
					}
				},
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		},
		enableHandler: function(){
			enableOrDisableField(1);
		},
		disableHandler: function(){
			enableOrDisableField(-1);
		},
		moveHandler:moveHandler,
		showPreview:{id:'showPreview',text:'预览表单',img:'page_url.gif',click:showPreview},
		showPreviewListPage:{id:'showPreviewListPage',text:'预览列表',img:'page_text.gif',click:showPreviewListPage}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "显示名称", name: "displayName", width: 140, minWidth: 60, type: "string", align: "left",editor: { type: 'text',required:true} },		   
			{ display: "数据库字段名", name: "fieldName", width: 100, minWidth: 60, type: "string", align: "left"},		
			{ display: "状态", name: "status", width: 60, minWidth:40, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				} 
			},
			{ display: "字段类型", name: "fieldType", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "控件类型", name: "controlType", width:80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return controlType[item.controlType];
				} 
			},
			{ display: "字段长度", name: "fieldLength", width: 60, minWidth: 60, type: "string", align: "left",editor: { type:'text',mask:'nnn'} },		
			{ display: "必填", name: "isRequired", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:yesOrNo},
				render: function (item) { 
					return yesOrNo[item.isRequired];
				} 
			},		   
			{ display: "是否显示", name: "visible", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:yesOrNo},
				render: function (item) { 
					return yesOrNo[item.visible];
				} 
			},		   
			{ display: "是否只读", name: "readOnly", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:yesOrNo},
				render: function (item) { 
					return yesOrNo[item.readOnly];
				} 
			},		
			{ display: "查询条件", name: "isCondition", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:yesOrNo},
				render: function (item) { 
					return yesOrNo[item.isCondition];
				} 
			},
			{ display: "条件顺序", name: "conditionSequence", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,max:100,mask:'nnn'}
			},
			{ display: "查询显示", name: "isShow", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:yesOrNo},
				render: function (item) { 
					return yesOrNo[item.isShow];
				} 
			},	
			{ display: "显示顺序", name: "showSequence", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,max:100,mask:'nnn'}
			},
			{ display: "显示宽度", name: "showWidth", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,max:100,mask:'nnn'}
			},
			{ display: "序号", name: "sequence", width: 80, minWidth: 60, type: "string", align: "left",
				editor: { type:'spinner',min:1,max:100,mask:'nnn'}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/dataCollectionAction!slicedQueryDataCollectionFieldDefin.ajax',
		parms:{dataCollectionKindId:$('#mainDataCollectionKindId').val()},
		pageSize : 10,
		width : '99.5%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		enabledEdit: true,
		onLoadData :function(){
			return !($('#mainKindFieldGroupId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.kindFieldDefineId);
		}
	});
}
function queryForm(obj){
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
function resetForm(obj){
	$(obj).formClean();
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function enableOrDisableField(status){
	var message=status==1?'确实要启用选中数据吗?':'确实要禁用选中数据吗?';
	DataUtil.updateById({ action: 'dataCollectionAction!updateDataCollectionFieldStatus.ajax',
		gridManager: gridManager,idFieldName:'kindFieldDefineId', param:{status:status},
		message: message,
		onSuccess:function(){
			reloadGrid();
		}
	});	
}

function moveHandler(){
	var data = gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择数据！');
		return false;
	}
	var html=['<div class="ui-form" >'];
	html.push('<dl><dt style="width:70px">字段分组&nbsp;:</dt><dd style="width:150px">');
	html.push('<input	 type="text" id="moveKindFieldGroupId" class="text"/>');
    html.push('</dd></dl>');
	html.push('</div>');
	var getDispatchNoDialog=UICtrl.showDialog({
		title:'移动字段到...',width:280,okVal:'确定',
		content:html.join(''),
		ok:function(){
			var kindFieldGroupId=$('#moveKindFieldGroupId').val();
			if(kindFieldGroupId==''){
				Public.tip('请选择字段分组！');
				return false;
			}
			var _self=this;
			DataUtil.updateById({ action: 'dataCollectionAction!updateDataCollectionFieldGroup.ajax',
				gridManager: gridManager,idFieldName:'kindFieldDefineId', param:{kindFieldGroupId:kindFieldGroupId},
				onSuccess:function(){
					reloadGrid();
					_self.close();
				}
			});	
			return false;
		},
		init:function(){
			$('#moveKindFieldGroupId').combox({data:groupData});
		}
	});
}
//保存数据
function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/dataCollectionAction!updateDataCollectionFieldDefin.ajax', {detailData:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
	return false;
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.kindFieldDefineId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/dataCollectionAction!showUpdateDataCollectionFieldDefin.load',
		title:'编辑字段',
		width:600,
		param:{kindFieldDefineId:id},
		init:function(){
			$('#controlType').combox({data:controlType});
			$('#dataSourceKind').combox({data:dataSourceKind});
		},
		ok: function(){
			var _self=this;
			$('#submitForm').ajaxSubmit({
		        url: web_app.name + '/dataCollectionAction!updateDataCollectionField.ajax',
		        success: function () {
		            _self.close();
		            reloadGrid();
		        }
		    });
		}
	});
}

function showPreview(){
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	var url=web_app.name + '/dataCollectionAction!showPreview.do?dataCollectionKindId='+dataCollectionKindId;
	parent.addTabItem({ tabid: 'dataCollectionShowPreview'+dataCollectionKindId, text:'字段设置预览 ', url:url});
}
function showPreviewListPage(){
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	var url=web_app.name + '/dataCollectionAction!showPreviewListPage.do?dataCollectionKindId='+dataCollectionKindId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'dataCollectionShowList'+dataCollectionKindId, text:'查询列表预览 ', url:url});
}
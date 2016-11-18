var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$.getFormButton(
		[
	      {id:'saveDetail',name:'保 存',event:insert},
	      {id:'loadFields',name:'加载字段',event:loadDetailFieldDefine},
	      {id:'previewField',name:'预 览',event:previewFieldDefine},
	      {name:'关 闭',event:closeWindow}
	    ]
	);
}
//初始化表格
function initializeGrid() {
	var id=$('#detailDefineID').length>0?$('#detailDefineID').val():'';
	var param={parentId:id,pagesize:1000};
	var dataYesOrNo={1:'是',0:'否'};
	gridManager=UICtrl.grid('#detailFieldDefineGrid', {
		 columns: [
		        { display: "字段名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},	
		        { display: "显示名称", name: "display", width: 150, minWidth: 60, type: "string", align: "left",frozen: true,
		        	editor: { type: 'text',required:true}
		        },	
		        { display: "显示宽度", name: "width", width: 74, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'text',mask:'nnn'}
				},
		        { display: "对齐方式", name: "align", width: 64, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'combobox',data:{left:'left',right:'right',center:'center'}}
				},
				{ display: "是否显示", name: "visible", width: 60, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:dataYesOrNo},
					render: function (item) { 
						return dataYesOrNo[item.visible];
					} 
				},
				{ display: "只读", name: "readOnly", width: 60, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:dataYesOrNo},
					render: function (item) { 
						return dataYesOrNo[item.readOnly];
					} 
				},
				{ display: "允许为空", name: "nullable", width: 60, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:dataYesOrNo},
					render: function (item) { 
						return dataYesOrNo[item.nullable];
					} 
				},
				{ display: "字段长度", name: "fieldLength", width:60, minWidth: 60, type: "string", align: "left",
					editor: { type:'text',mask:'nnn'}
				},
				{ display: "字段精度", name: "fieldPrecision", width: 60, minWidth: 60, type: "string", align: "left",
					editor: { type:'text',mask:'n'}
				},
				{ display: "控件类型", name: "controlType", width:80, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:{text:'text',date:'date',dateTime:'dateTime',number:'number',money:'money',combobox:'combobox',textarea:'textarea'}}
				},
				{ display: "数据源", name: "dataSource", width: 170, minWidth: 60, type: "string", align: "left",
					editor: { type:'text'}
				},
				{ display: "新行显示", name: "newLine", width: 60, minWidth: 60, type: "string", align: "left",
					editor: { type:'combobox',data:dataYesOrNo},
					render: function (item) { 
						return dataYesOrNo[item.newLine];
					} 
				},
				{ display: "排序号", name: "sequence", width: 64, minWidth: 60, type: "string", align: "left",
		        	editor: { type:'spinner',min:1,max:100,mask:'nnn'}
				}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryDetailFieldDefine.ajax',
		parms:param,
		width : '99%',
		sortName:'sequence',
		sortOrder:'asc',
		height : '100%',
		heightDiff : -42,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		usePager: false,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		autoAddRow:{},
		onLoadData :function(){
			return !($('#detailDefineID').val()=='');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//新增保存
function insert() {
	var id=$('#detailDefineID').val();
	if(id!='') return update();
	var parentId=$('#detailDefineParentId').val();
	parentId=parentId==''?11:parentId;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!insertDetailDefine.ajax',
		param:{parentId:parentId},
		success : function(id) {
			$('#detailDefineID').val(id);
			gridManager.options.parms['parentId']=id;
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!updateDetailDefine.ajax',
		param:{fieldDefineData:encodeURI($.toJSON(detailData))},
		success : function() {
			refreshFlag = true;
			if(detailData.length>0){
				reloadGrid();
			}
		}
	});
}

function loadDetailFieldDefine(){
	var id=$('#detailDefineID').length>0?$('#detailDefineID').val():'';
	if(id==''){
		Public.tip('请先保存子集定义!');
		return false;
	}
	Public.ajax(web_app.name + '/hrSetupAction!loadDetailFieldDefine.ajax', {id:id}, function(data) {
		reloadGrid();
	});
	return false;
}
function previewFieldDefine(){
	var id=$('#detailDefineID').length>0?$('#detailDefineID').val():'';
	if(id==''){
		Public.tip('请先保存子集定义!');
		return false;
	}
	Public.ajax(web_app.name + '/hrSetupAction!queryFieldDefine.ajax', {id:id}, function(data) {
		UICtrl.showDialog({title:'预览子集定义',width:700,
			content:'<div style="overflow: hidden;width:680;height:305px;"><div class="testClass"></div></div>',
			ok:false,
			init:function(doc){
				var div=$('div.testClass',doc);
				DetailUtil.getDetailGrid(div,data,{width:670});
			}
		});
	});
	return false;
}

function closeWindow(){
	if(refreshFlag){
		UICtrl.closeAndReloadParent('hrDetailDefine');
	}else{
		UICtrl.closeCurrentTab();
	}
}

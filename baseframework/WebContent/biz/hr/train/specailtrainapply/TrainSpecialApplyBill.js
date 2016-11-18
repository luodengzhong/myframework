var gridManager = null, refreshFlag = false;
var teacherLevelMap = null;
$(document).ready(function() {
	$('#TrainingSpecialApplyFileList').fileList();
	teacherLevelMap = $("#TLevel").combox("getJSONData");
//选择机构
  var  $el=$('#applyCompany');
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:'hrBasePersonquatoData',
		onChange:function(){
			$('#applyDept').val('');
		   $('#applyDeptId').val('');
		},
		needAuth:false,
		back:{
			text:$el,
			value:'#applyCompanyId',
			id:'#applyCompanyId',
			name:$el
		}
	});
	var $cl=$('#applyCenter');
	    $cl.orgTree({filter:'dpt',
			manageType:'hrBasePersonquatoData',
			getParam:function(){
				var ognId=$('#applyCompanyId').val();
				var mode=this.mode;
				if(mode=='tree'){//更改树的根节点
					return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				}else{
					var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
					if(ognId!=''){//增加根查询参数
						condition.push(" and full_id like '%/"+ognId+"%'");
					}
					param['searchQueryCondition']=condition.join('');
					return param;
				}
			},
			back:{
				text:$cl,
				value:'#applyCenterId',
				id:'#applyCenterId',
				name:$cl
			}
		});
	var $al=$('#applyDept');
		$al.orgTree({filter:'dpt',
			manageType:'hrBasePersonquatoData',
			getParam:function(){
				var ognId=$('#applyCompanyId').val();
				var mode=this.mode;
				if(mode=='tree'){//更改树的根节点
					return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				}else{
					var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
					if(ognId!=''){//增加根查询参数
						condition.push(" and full_id like '%/"+ognId+"%'");
					}
					param['searchQueryCondition']=condition.join('');
					return param;
				}
			},
			back:{
				text:$al,
				value:'#applyDeptId',
				id:'#applyDeptId',
				name:$al
			}
		});
	initializeGrid();
	
});
function initializeGrid(){
	var trainSpecialApplyId=$("#trainSpecialApplyId").val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
	    addBatchHandler:{id:'AddBatch',text:'批量添加内部讲师',img:'page_extension.gif',click:addInnerTeacher},
		addOuterHandler: {id:'addOuterTeacher',text:'添加外部讲师',img:'page_user.gif',click:addOuterTeacher},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "讲师姓名", name: "staffName", width: 150, minWidth: 60, type: "string", align: "center"},		   
		{ display: "讲师级别", name: "TLevel", width: 150, minWidth: 60, type: "string", align: "left",
		 render: function (item) {
					return teacherLevelMap[item.TLevel];
		}},
		{ display: "讲师类别", name: "teacherTypeTextView", width: 150, minWidth: 60, type: "string", align: "left"},
		{ display: "所在机构", name: "ognName", width: 200, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/specailtrainapplyAction!slicedQueryTrainingTeacherSpecial.ajax',
		pageSize : 20,
		manageType:'hrBasePersonquatoData',
		parms:{trainSpecialApplyId:trainSpecialApplyId},
		width : '100%',
		height : 350,
		enabledEdit : true,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#trainSpecialApplyId').val() == '');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function deleteHandler(){
	DataUtil.delSelectedRows({action:'specailtrainapplyAction!deleteTrainingTeacherSpecial.ajax',
		gridManager:gridManager,idFieldName:'id',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addInnerTeacher(){
   $("#toolbar_menuAddBatch").comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'archivesId',
		checkbox:true,onChoose:function(){
			var rows=this.getSelectedRows();
			var addRows = [], addRow;
			$.each(rows, function(i, o){
				addRow = {};
				addRow["id"]='';
				addRow["archivesId"]=o["archivesId"];
				addRow["staffName"] = o["staffName"];
				addRow["ognName"] = o["ognName"];
				addRow["TLevel"] = 'LECTURER';
		        addRow["teacherType"] = 'inner';
				addRows.push(addRow);
			});
			gridManager.addRows(addRows);
			return true;
		}});
}



function addOuterTeacher(){
		UICtrl.showAjaxDialog({url: web_app.name + '/trainingTeacherArchiveAction!showInsert.load',
		width:400,title:"新增外部讲师",
		ok: insertOutTeacher, close: dialogClose})
}

function insertOutTeacher(){
	var data=$('#submitForm').formToJSON({encode:false});
	if(!data) return;
	gridManager.addRows(data);
	Public.successTip('添加成功!');
}

function getExtendedData() {
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	if (!extendedData) {
		return false;
	}
	return {
		detailData : encodeURI($.toJSON(extendedData))
	};
}
function getId() {
	return $("#trainSpecialApplyId").val() || 0;
}

function setId(value){
	$("#trainSpecialApplyId").val(value);
      gridManager.options.parms['trainSpecialApplyId'] =value;
     $('#TrainingSpecialApplyFileList').fileList({bizId:value});
}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function afterSave(){
	 reloadGrid();
}
// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}
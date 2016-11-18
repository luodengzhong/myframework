var infoFeedbackGridManager=null;
var dataTypeData={'text':'文本','number':'数值','date':'时间'};
var editStyleData={'text':'文本','number':'数值','date':'时间','radio':'单项选择','checkbox':'多项选择'};
var yesOrNo={'1':'是','0':'否'};
var modifFlag=false;
$(document).ready(function() {
	modifFlag=$('#modifFlag').val()=='true';
	initFeedbackGridManager();
	initUI();
});
function initUI(){
	$('#toolbar_menuchooseByTemplate').comboDialog({type:'oa',name:'feedbackTemplate',
		checkbox:false,
		title:'反馈模板选择',
		onChoose:function(){
			var row=this.getSelectedRow();
			var infoFeedbackTemplateId=row.infoFeedbackTemplateId;
	    	Public.ajax(web_app.name + '/oaSetupAction!queryTemplateItem.ajax', {infoFeedbackTemplateId:infoFeedbackTemplateId}, function(data){
	    		$.each(data,function(i,o){
	    			o['sequence']=infoFeedbackGridManager.getData().length+1+i;
	    		});
				infoFeedbackGridManager.addRows(data);
			});
	    	return true;
    }});
}

function initFeedbackGridManager(){
	var toolbarOptions = {};
	var columns=[
		{ display: "名称", name: "itemName", width: 260, minWidth: 60, type: "string", align: "left",frozen: true,
			editor: { type: 'text',required:true,maxLength:100}
		},
		{ display: "排序号", name: "sequence", width: 60, minWidth: 40, type: "string", align: "left",
		     editor: { type:'spinner',min:1,max:100,mask:'nn',required: true}
		},
		{ display: "数据类型", name: "dataType", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataTypeData,required: true},
			render: function (item) { 
				return dataTypeData[item.dataType];
			}
		},
		{ display: "显示类型", name: "editStyle", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:editStyleData,required: true},
			render: function (item) { 
				return editStyleData[item.editStyle];
			}
		},
		{ display: "选择范围", name: "valueRange", width:190, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:300}
		},
		{ display: "默认值", name: "defaultValue", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:300}
		},
		{ display: "必填", name: "required", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:yesOrNo,required: true},
			render: function (item) { 
				return yesOrNo[item.required];
			}
		},
	    { display: "填写说明", name: "remark", width: 160, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:100}
		}
	];
	if(modifFlag){//判断可编辑的字段，处理按钮显示
		var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			chooseByTemplate:{id:'chooseByTemplate',text:'选择反馈模板',img:'page_dynamic.gif',click:function(){}},
			addHandler: function(){
				UICtrl.addGridRow(infoFeedbackGridManager,{sequence:infoFeedbackGridManager.getData().length+1});
			}, 
			deleteHandler: function(){
				DataUtil.delSelectedRows({action:'oaInfoAction!deleteFeedBackItem.ajax',
					gridManager:infoFeedbackGridManager,idFieldName:'infoFeedbackItemId',
					onSuccess:function(){
						infoFeedbackGridManager.loadData();
					}
				});
			}
		});
	}else{
		$.each(columns,function(i,o){
			if(o.name=='dataType'||o.name=='editStyle'){
				//删除可编辑标志
				delete o['editor'];
			}
		});
	}
	infoFeedbackGridManager = UICtrl.grid('#infoFeedbackTemplateItemGrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryInfoFeedback.ajax',
		parms:{infoPromulgateId:$('#infoPromulgateId').val(),pagesize:200},
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		usePager: false,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onLoadData :function(){
			return !($('#infoPromulgateId').val()=='');
		}
	});
}
//获取修改的数据
function getDetailData(){
	var detailData = DataUtil.getGridData({gridManager: infoFeedbackGridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
//判断是否村子修改的数据
function isChangedDetail(){
	var data=infoFeedbackGridManager.getChanges();
	if(data.length>0){
		return true;
	}
	return false;
}
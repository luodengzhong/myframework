var gridManager = null, personGridManager = null, refreshFlag = false, scorePersonLevel = null;
var templetIdFull = null;
var mainContentValue={'岗位业务——季度常规重点工作':'岗位业务——季度常规重点工作','岗位业务——季度专项重点工作':'岗位业务——季度专项重点工作'};
$(document).ready(function() {
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	periodMap=$('#periodMapQuery').combox('getFormattedData');
	initUI();
	initializeGridManager();
	initializepersonManager();
	initializeBatchBtn();
    var jxassessType=$('#jxassessType').val();
    var isEditTemplet=$('#isEditTemplet').val();
  
    changeIndexDataHide(isEditTemplet);
      $('#jxassessTempletTypeName').searchbox({type:'hr',name:'performTempletSelect',
    	back:{templetId:'#jxassessType',templetName:'#jxassessTempletTypeName',isEditTemplet:'#isEditTemplet',
    	lineMax:'#lineMax',lineMin:'#lineMin',minScore:'#minScore',isCountQuarterGrade:'#isCountQuarterGrade',total:'#total'},
    	onChange:function(){
    		var isEditTemplet=$('#isEditTemplet').val();
    		changeIndexData(isEditTemplet);
    	 }
     });
     
       var isScreenStartAssessButton=$('#isScreenStartAssessButton').val();
    
    if(isScreenStartAssessButton==1){
    	//屏蔽发起考评按钮
    		$('#toolbar_menustartPerformAssess,#separator_linestartPerformAssess').hide();
    }
});
function initUI(){
   $('#detailPeriodCode').combox({data:periodMap});
	$('#detailOrgnName').orgTree({filter:'ogn,dpt',
			getParam:function(){
			  return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			},
			manageType:'noControlAuthority',//不进行权限过滤
			back:{
				text:'#detailOrgnName',
				value:'#detailOrgnId',
				id:'#detailOrgnId',
				name:'#detailOrgnName'
			},
		    showVirtualOrg: true,
			beforeChange:function(data){
				//考核主体验证
				var flag=false,fullId=data.fullId;
				if(!fullId){
					fullId=$('input[name="fullId"]',data).val();
				}
				if(!fullId){
					return false;
				}
				Public.authenticationAssessSubject('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是考核主体！');
					}
				});
				return flag;
			}
	});
}

function changeIndexDataHide(value){
	if(value>0&&value!=''){
		hideButton();
	
	}else{
		$('#selfDefinePersonDiv').show();
		  $('#specialDefinePersonDiv').hide();
		   	var columns=getDefineGridColumns();
        personGridManager.set('columns', columns); 
	}
}
function changeIndexData(value){
	var jxassessTypeId=$('#jxassessType').val();
	if(value>0 &&value!=''){
		hideButton();
	   var param = $.extend({}, {
		jxassessTempletType:jxassessTypeId
	});
	   UICtrl.gridSearch(gridManager, param);
	   	var columns=getGridColumns();
        personGridManager.set('columns', columns); 
        //personGridManager.reRender();
	}else{
		showButton();
		  $('#selfDefinePersonDiv').show();
         $('#specialDefinePersonDiv').hide();
         var url=web_app.name+'/performassessAction!queryAssessTempletByType.ajax';
					Public.ajax(url,{jxassessTempletType:jxassessTypeId},function(data){
						if(data.length>0){
						gridManager.addRows(data);
						}else{
							Public.tip("所选择的模板无任何指标明细,请维护");
						}
					});
		  /*   var param = $.extend({}, {
		        jxassessTempletType:value
	          }); 
			 UICtrl.gridSearch(gridManager, param);*/
	    //personGridManager.options.parms['jxassessType'] =value;
	    var columnsDefine=getDefineGridColumns();
        personGridManager.set('columns', columnsDefine); 
        //personGridManager.reRender();
	}
}
function getGridColumns(){
	var columns=new Array();
	columns=[ {
			display : "评分人姓名",
			name : "scorePersonName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "打分顺序",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'n'
			}
		
		}];
		return columns;
	
}

function getDefineGridColumns(){
	var columns=new Array();
	columns=[ {
			display : "评分人姓名",
			name : "scorePersonName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "打分顺序",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'n'
			}
		
		},
		{display : "所占权重(%)",
			name : "proportion",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				mask : 'nnn'}}
		
		];
		return columns;
}
function hideButton(){
	$('#advance,#advance_line').hide();
	$('#abort,#abort_line').hide();
	$('#print,#print_line').hide();
	$('#taskCollect,#taskCollect_line').hide();
	$('#makeACopyFor,#makeACopyFor_line').hide();
	$('#showChart,#showChart_line').hide();
	$('#showApprovalHistory,#showApprovalHistory_line').hide();
	$('#toolbar_menuAdd,#separator_lineAdd').hide();
	$('#toolbar_menuAddBatch,#separator_lineAddBatch').hide();
	$('#toolbar_menuDelete,#separator_lineDelete').hide();
	$('#toolbar_menuUpdate,#separator_lineUpdate').hide();
	$('#toolBar').toolBar('changeEvent','save',function(){
	    specialSave();
	})
		$('#selfDefinePersonDiv').hide();
		$('#specialDefinePersonDiv').show();

}

function showButton(){
	$('#advance,#advance_line').show();
	$('#abort,#abort_line').show();
	$('#print,#print_line').show();
	$('#taskCollect,#taskCollect_line').show();
	$('#makeACopyFor,#makeACopyFor_line').show();
	$('#showChart,#showChart_line').show();
	$('#showApprovalHistory,#showApprovalHistory_line').show();
	$('#toolbar_menuAdd,#separator_lineAdd').show();
	$('#toolbar_menuAddBatch,#separator_lineAddBatch').show();
	$('#toolbar_menuDelete,#separator_lineDelete').show();
	$('#toolbar_menuUpdate,#separator_lineUpdate').show();
	$('#toolBar').toolBar('changeEvent','save',function(){
	    save();
	})
}

function specialSave(){
	var extendedData=getExtendedData();
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/paformMakeAction!specialSave.ajax',
		param : $.extend({}, extendedData),
		success : function(data) {
			$('#status').combox('setValue',1);
			$('#total').val(data);
			reloadGrid();
		}
	});
}
// 初始化表格
function initializeGridManager() {
	var templetId = $('#templetId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: addIndexHandler,
		updateHandler:function(){
			updateIndexHandler();
		},
		addBatchHandler:{id:'AddBatch',text:'批量添加指标项',img:'page_extension.gif'},
		deleteHandler:deleteIndexHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		startPerformAssess: {
            id: 'startPerformAssess',
            text: '【发起考评】',
            img: '86.gif',
            click: startPerformAssess
        }
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [ {
			display : "排序号",
			name : "sequence",
			width : 40,
			minWidth : 40,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}, {
			display : "主分类",
			name : "mainContent",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			render: function (item) { 
				return '<div title="'+item.mainContent+'">'+item.mainContent+'</div>';
			}
		  
		}, {
			display : "指标名称",
			name : "partContent",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			},
			render: function (item) { 
				return '<div title="'+item.partContent+'">'+item.partContent+'</div>';
			}
		},
		{
			display : "个人季度关键指标",
			name : "keyContent",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			}
		},
		{
			display : "权重",
			name : "scoreNum",
			width : 60,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn.nn'
			}},
			{
			display : "衡量标准",
			name : "desption",
			width : 500,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			},
			render: function (item) { 
				return '<div title="'+item.desption+'">'+item.desption+'</div>';
			}
			},
			{
			display : "目标值",
			name : "goalContent",
			width : 200,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true
			}
		}
			
			],
		dataAction : 'server',
		url : web_app.name
				+ '/performassessAction!slicedQueryPerformAssessTempletDeta.ajax',
		width : '99%',
		parms:{totalFields:'scoreNum',templetId : templetId,pagesize:1000},
		usePager:false,
		height : 500,
		heightDiff : -5,
		enabledEdit : true,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'sequence',
		sortOrder : 'asc',
		toolbar : toolbarOptions,
		checkbox : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onBeforeEdit:function(){
			if( $('#isEditTemplet').val() <=0 ){
				return true;
			}
			return false;
		},
		onLoadData : function() {
			return !($('#templetId').val() == '');
		},
		totalRender: function(data){
			if(!data) return '';
			if(!data['Rows']) return '';
			if(!data['totalFields']) return '';
			var totalFields=data['totalFields'];
			var html=['权重合计:'];
			if(!Public.isBlank(totalFields['scoreNum'])){
				html.push('&nbsp;',totalFields['scoreNum']);
			}
			return html.join('');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function addIndexHandler(){
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showIndexTempletIndex.load', 
		ok: insertFormIndex, 
		param:{paType:1},
		okVal:'保存/新增',
		width:600,
		title:"新增考核指标"});
}

function initializeBatchBtn(){
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'performAssessIndexSelect',width:600,dataIndex:'indexId',
		title:'请选择指标',checkbox:true,
		onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["indexId"] = o["indexId"];
	    		addRow["mainContent"] = o["mainContent"];
	    		addRow["partContent"] = o["partContent"];
	    		addRow["desption"] = o["desption"];
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);sss
	    	return true;
    }});
}
//编辑按钮
function updateIndexHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择指标数据！'); return; }
	var detailId=row.detailId;
	if(!detailId){
		Public.tip('未保存数据，不能修改,请先点击保存按钮！'); return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showUpdateTempletIndex.load', 
		param:{detailId:detailId,paType:1}, 
		width:600,
		title:"修改考核指标",
		ok: updateIndex
	});
}

//编辑保存
function updateIndex(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!updateTempletIndex.ajax',
		param:{templetId:$('#templetId').val()},
		success : function() {
			_self.close();
			reLoaddetailGrid();
			updateMainStatus();
		}
	});
}
//删除模板指标
function deleteIndexHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessTempletDeta.ajax',
		gridManager:gridManager,idFieldName:'detailId',
		param:{templetId:$('#mainTempletId').val()},
		onSuccess:function(){
			reLoaddetailGrid();	
		}
	});
}

function startPerformAssess(){
	var status=$('#status').val();
	if(status!=1){
		Public.tip("考核表状态不是【已审核】状态,不能发起考评!");
        return;
	}
	var underAssessmentId=$('#underAssessmentId').val();
	 var underAssessmentIds = new Array();
     underAssessmentIds.push(underAssessmentId);
	 var fn=function(){Public.successTip("考评已成功发起!");
	 		UICtrl.closeAndReloadTabs("TaskCenter", null);
	 };
      UICtrl.confirm('您确定开始发起绩效考核评分吗?',function(){
    		Public.ajax(web_app.name + '/performassessAction!startPerformAssess.ajax',{ids:$.toJSON(underAssessmentIds)},fn);
    	});
}
// 初始化表格
function initializepersonManager() {
	var underAssessmentId = $('#underAssessmentId').val();
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addPersonHandler : {
            id: 'addPerson',
            text: '增加评分人',
            img: 'page_new.gif',
            click: addPersonHandler
        },
		deletePersonHandler:{
            id: 'deletePerson',
            text: '删除评分人',
            img: 'page_delete.gif',
            click: deletePersonHandler
        }
	});
	
	columns=[ {
			display : "评分人姓名",
			name : "scorePersonName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "打分顺序",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'n'
			}
		}];
		if($('#jxassessType').val()<=0){
			columns.push({display : "所占权重(%)",
			name : "proportion",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				mask : 'nnn'}});
		}
	personGridManager = UICtrl.grid('#personid', {
		columns : columns,
		dataAction : 'server',
		url : web_app.name + '/performassessAction!slicedQueryPerformAssessPerson.ajax',
		pageSize : 20,
		parms : {
			underAssessmentId : underAssessmentId
		},
		width : '99%',
		height : 200,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar : toolbarOptions,
		sortName : 'sequence',
		sortOrder : 'asc',
		checkbox : true,
		enabledEdit : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#underAssessmentId').val() == '');
		}
	});
	UICtrl.setSearchAreaToggle(personGridManager);
}

function addPersonHandler() {
	var underAssessmentId=$('#mainUnderAssessmentId').val();
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	UICtrl.showFrameDialog({
		title : "选择评分名单",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name');
			_self.close();
		}
	});

}
//删除评分名单
function deletePersonHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessPerson.ajax',
		gridManager:personGridManager,idFieldName:'assessPersonId',
		param:{underAssessmentId:$('#mainUnderAssessmentId').val()},
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addPersons(data,idName,name){
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		// 绩效考核全部默认为上级
		addRow = $.extend({}, o);
		addRow["assessPersonId"]='';
		addRow["underAssessmentId"]='';
		addRow["scorePersonId"] = o[idName];
		addRow["scorePersonName"] = o[name];
		addRow["proportion"] = 100;
		addRow["scorePersonLevel"] = 'superior';
		addRow["sequence"] =i+1;
		addRows.push(addRow);
	});
	personGridManager.addRows(addRows);
}
function reLoaddetailGrid(){
	gridManager.loadData();
}


// 刷新表格
function reloadGrid() {
	personGridManager.loadData();
}

// 新增保存 考核表的指標
function insertFormIndex() {
	var data=$('#submitForm').formToJSON({encode:false});
	if(!data) return;
	gridManager.addRows(data);
	$('#submitForm').formSet({
		sequence:(parseInt(data['sequence'],10)+1)+'',
		partContent:'',
		desption:'',
		scoreNum:''
	});
	Public.successTip('添加成功!');
	/*$('#submitForm')
			.ajaxSubmit(
					{
						url : web_app.name
								+ '/paformMakeAction!insertPerformAssessFormIndex.ajax',
						success : function(data) {
							// 將新增的数据add到gridManager中
							gridManager.addRows(data);
							refreshFlag = true;

						}
					});
	*/
}


// 提交
function advance() {
	var status=$('#status').val();
	var message=null;
	if(status==1){
		 message="当前绩效考核表已审核，你是否确认再次提交表审核？若需开始绩效评分任务,请先点击取消,然后点击红色字体下方的【发起考评】按钮";
	}else{
		message="您是否提交当前任务？";
	}
	UICtrl.confirm(message, function() {
		switch (taskKindId){
		case TaskKind.TASK:
			if (isApproveProcUnit()) {
				var approvalParams = getApprovalParams();
				if (!approvalParams.handleResult) {
					Public.errorTip("没有选择处理意见，不能提交！");
					return;
				}
			}else{
				if (!checkConstraints())
					return;
			}
			doAdvance();
		    break;
		case TaskKind.NOTICE:
		case TaskKind.MAKE_A_COPY_FOR:
			doCompleteTask();		
			break;
		case TaskKind.MEND:
		    doCompleteMendTask();		
		    break;
		 case TaskKind.REPLENISH:
		   doCompleteReplenishTask();
		   break;
		}
	});
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value) {
	$("#auditId").val(value);
}

function getExtendedData() {
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	var personExtendedData = DataUtil.getGridData({
		gridManager : personGridManager
	});
	if (!extendedData) {
		return false;
	}
	if (!personExtendedData) {
		return false;
	}
	return {
		detailData : encodeURI($.toJSON(extendedData)),
		personDetailData : encodeURI($.toJSON(personExtendedData))
	};
}
function afterSave(data){
      $("#underAssessmentId").val(data.underAssessmentId);
      $("#templetId").val(data.templetId);
      $('#status').combox('setValue',0);
      gridManager.options.parms['templetId'] =data.templetId;
      personGridManager.options.parms['underAssessmentId'] =data.underAssessmentId;
      reLoaddetailGrid();
      reloadGrid();
}
// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

/*
 * function save() { insertForm(); }
 */

var outboundTrain = 1, educationUpTrain = 2, getCertificationTrain = 3;
$(document).ready(function() {
		$('#trainingOutboundApplyFileList').fileList();
			$('#staffName').searchbox({
						type : "hr",
						name : "resignationChoosePerson",
						back : {
							ognId : "#ognId",
							ognName : "#ognName",
							centreId : "#centreId",
							centreName : "#centreName",
							dptId : "#dptId",
							dptName : "#dptName",
							employedDate : "#employedDate",
							posId : "#posId",
							posName : "#posName",
							staffName : "#staffName",
							archivesId : "#archivesId",
							fullId:"#outTrainPersonFullId",
							jobTitleName : '#jobTitleName'
						}
					});
			hideTrAndDiv();
			$("#outboundApplyType").combox({
						onChange : function() {
							hideTrAndDiv();
						}
					});
		initializeGrid();
		initializeUI();			

	});

	
function hideTrAndDiv() {
	var value = $('#outboundApplyType').val();
	var tr1 = $('#educationApplyTypeTr');
	var tr2 = $('#applyPropertyTr');
	if (value == '') {
		$('div,span', tr1).add(tr1).hide();
		$('div,span', tr2).add(tr2).hide();
		$('#zxDiv').hide();
		$('#educationTrainDiv').hide();
		$('#getCertificationTrainDiv').hide();
	} else if (value == outboundTrain) {
		//外送培训
		$('div,span', tr1).add(tr1).hide();
		$('div,span', tr2).add(tr2).hide();
		$('#zxDiv').show();
		$('#educationTrainDiv').hide();
		$('#getCertificationTrainDiv').hide();
		//attrRemoveEducationUpRequired();
		//attrRemoveGetCertificationRequired();
	} else if (value == educationUpTrain) {
		//学历提升培训
		$('div,span', tr1).add(tr1).show();
		$('div,span', tr2).add(tr2).show();
		// $('#applyProperty').attr('required',true);
		$('#zxDiv').hide();
		$('#educationTrainDiv').show();
		$('#getCertificationTrainDiv').hide();
		attrRemoveZXRequired();
		//attrRemoveGetCertificationRequired();
	} else if (value == getCertificationTrain) {
		//专业技术资格证获得
		$('div,span', tr1).add(tr1).hide();
		$('div,span', tr2).add(tr2).show();
		// $('#applyProperty').attr('required',true);
		$('#zxDiv').hide();
		$('#educationTrainDiv').hide();
		$('#getCertificationTrainDiv').show();
		attrRemoveZXRequired();
	    //attrRemoveEducationUpRequired();
	}
}

//移除专项培训必填字段
function attrRemoveZXRequired(){
	    $('#course').removeAttr('required');      
        $('#place').removeAttr('required');
        $('#teacherName').removeAttr('required');
        $('#teacherDesc').removeAttr('required');
        $('#trainingOrgName').removeAttr('required');
}

//移除学历提升培训必填字段
function attrRemoveEducationUpRequired(){
	 $('#educationOrgan').removeAttr('required');      
     $('#educationPlace').removeAttr('required');
}

//移除专业技术资格认证培训必填字段
function attrRemoveGetCertificationRequired(){
	 $('#certificationName').removeAttr('required');      
     $('#certificationOrgan').removeAttr('required');
     $('#hostTrainOrgan').removeAttr('required');      
     $('#certificationPlace').removeAttr('required');
}

// 打印功能
function print() {
	var trainingOutboundApplyId = $('#trainingOutboundApplyId').val();
	window
			.open(web_app.name
					+ '/trainingOutboundApplyAction!createPdf.load?trainingOutboundApplyId='
					+ trainingOutboundApplyId );
}

function initializeGrid(){
	var trainingOutboundApplyId=$('#trainingOutboundApplyId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){}, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位名称", name: "ognName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "dptName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "posName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "预计培训费用/元", name: "predictFee", width: 200, minWidth: 60, type: "string", align: "left",
					editor: { type:'text',mask:'nnnnnnn',required: true}
         },		   
		{ display: "差旅费/元", name: "travelExpenses", width: 200, minWidth: 60, type: "string", align: "left",
		editor: { type:'text',mask:'nnnnnnn',required: true}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingOutboundApplyAction!slicedQueryDetail.ajax',
		parms:{trainingOutboundApplyId: trainingOutboundApplyId},
		pageSize : 20,
		usePager: false,
		width : '99%',
		height : 300,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'personName',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData: function(){
			return !($('#trainingOutboundApplyId').val()=='');
		}
	});
  if (!getId()){
		initDefaultTrainingOutPersonDetail();
	}
}
function getId() {
	return $("#trainingOutboundApplyId").val() || 0;
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function setId(value) {
	$("#trainingOutboundApplyId").val(value);
	gridManager.options.parms['trainingOutboundApplyId'] =value;
    $('#trainingOutboundApplyFileList').fileList({bizId:value});
}


function initDefaultTrainingOutPersonDetail(){
	if (procUnitId == "Apply" && activityModel == "do" &&  gridManager.getData().length == 0){
	    var operator = ContextUtil.getOperator();
	    gridManager.addRow({ 
		    ognId: operator["orgId"],
			ognName: operator["orgName"],
			centreId: operator["centerId"],
			centreName: operator["centerName"],
			dptId: operator["deptId"],
			dptName: operator["deptName"],
			posName: operator["positionName"],
			personId: operator["id"],
			personName: operator["personMemberName"]
        });
	}
}

function initializeUI(){
	$('#toolbar_menuAdd').comboDialog({type:'sys',name:'orgSelect',width:480,
		dataIndex:'id',
		getParam: function(){
			 return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm' and instr(full_id, '.prj') = 0 " };
		},
		title:'外送培训人员选择',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["ognId"] = o["orgId"];
	    		addRow["ognName"] = o["orgName"];
	    		addRow["centreName"] = o["centerName"];
	    		addRow["centreId"] = o["centerId"];
	    		addRow["dptName"] = o["deptName"];
	    		addRow["dptId"] = o["deptId"];
	    		addRow["posName"] = o["positionName"];
	    		addRow["personId"] = o["personId"];
	    		addRow["personName"] = o["name"];
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
}
function deleteHandler(){
	DataUtil.delSelectedRows({ action:'trainingOutboundApplyAction!deleteTrainingOutboundDetail.ajax', 
		gridManager: gridManager, idFieldName: 'detailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}


function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}

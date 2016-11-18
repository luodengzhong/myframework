var checkTimes={"onDuty":'上午上班', "offDuty":'下午下班'},notCardKindList=null,levelsAll={};
var detailEmptyTip = "请添加未打卡证明。";
var isBusLateFlag=false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	isBusLateFlag=$('#isBusLate').val()==='1';
	notCardKindList=$('#notCardKindId').combox('getJSONData');
	delete notCardKindList['Other'];
	delete notCardKindList['ForgetCard'];
	//排班班次
	getWorkShift();
	//行政班
	levelsAll["onDuty"]="上午上班";
	levelsAll["offDuty"]="下午下班";
	initializeGrid();
	cancelIsReadHandleResult();
});

function getId() {
	return $("#notCardCertificateId").val() || 0;
}

function setId(value){
	$("#notCardCertificateId").val(value);
	gridManager.options.parms['notCardCertificateId'] = value;
}

function getWorkShift(){
	//获取机构排班班次
	 $.ajax({
    	async: false,
			type: "post",
			url: web_app.name+'/attNotCardCertificateAction!queryPersonDuty.ajax',
			data: {orgId:getOrganId,personMemberId:$('#personMemberId').val()},
			success: function (data) {
				var resultData = data.data;
				$.each(resultData, function (index, data) {
					levelsAll[data.id] = data.name;
               });
			},
			dataType: 'json'
    });
}

function initializeGrid() {
	var displayName='未打卡';
	if(isBusLateFlag){
		displayName='';
	}
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: displayName+"日期", name: "fdate", width: 180, minWidth: 60, type: "date", align: "left",
			 editor: { type: 'date', required: true}
		},
		{ display: displayName+"时间", name: "checkTime",width: 180, minWidth: 60, type: "string", align: "left",
            editor: {type: "dynamic", required: true, getEditor: function (row) {
                var fdate = row['fdate'] || "";
                if(fdate==""){
                	Public.tip("请先选择时间");
                	return;
                }
                var levels = {};
                $.ajax({
                	async: false,
					type: "post",
					url: web_app.name+'/attNotCardCertificateAction!queryPersonDuty.ajax',
					data: {fdate:fdate.substr(0,10),personMemberId:$('#personMemberId').val()},
					success: function (data) {
						var resultData = data.data;
						if(resultData!=null&&resultData!=""){
							$.each(resultData, function (index, data) {
								levels[data.id] = data.name;
			                });
						}
						else{
							levels = {"onDuty":'上午上班', "offDuty":'下午下班'};
						}
					},
					dataType: 'json'
                });
                var editor = {type: 'combobox', data: levels};
                return editor;
            }},
            render: function (item) {
                return levelsAll[item.checkTime];
            }
		},
		{ display: displayName+"类别", name: "kindId", width: 180, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:notCardKindList, required: true},
			render: function (item) { 
				return notCardKindList[item.kindId];
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attNotCardCertificateAction!slicedQueryNotCardCertificateDetail.ajax',
		parms:{ notCardCertificateId: getId(),pagesize:1000},
		usePager: false,
		width : '98.8%',
		sortName:"fdate,checkTime",
		sortOrder: "asc",
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{notCardCertificateId:""},
		enabledEdit: true,
		checkbox: true,
		onBeforeEdit:function(editParm){
			var c=editParm.column;
			if(isBusLateFlag){//大巴迟到未打卡时间及未打卡类别不能被修改
				if(c.name=='checkTime'||c.name=='kindId'){
					return false;
				}
			}else{
				if(c.name=='fdate'){
					var checkTime=editParm.record['checkTime'];
					if(checkTime!=null&&checkTime!=""){
						return false;
					}
				}
			}
			return true;
		},
		onLoadData: function(){
			return (getId() > 0);
		}
	});
}

function addHandler() {
	if(isBusLateFlag){
		UICtrl.addGridRow(gridManager,{checkTime:'onDuty',kindId:'busLate'});
	}else{
		UICtrl.addGridRow(gridManager);
	}
}

function reloadGrid() {
	gridManager.loadData();
} 

function getOrganId(){
	return $('#organId').val();
}


/**
 * 检查重复填写
 * @returns {Boolean}
 */
function checkDuplicate() {
	gridManager.endEdit();
    var data = gridManager.getData();
    var list = [];
    var item = {};
    for (var i = 0; i < data.length; i++) {
    	for (var j = 0; j < list.length; j++){
    		if (data[i].fdate.substr(0, 10) == list[j].fdate.substr(0, 10) && data[i].checkTime == list[j].checkTime){
    			Public.tip("日期[" + data[i].fdate.substr(0, 10) + "]，"  + levelsAll[data[i].checkTime] + "重复填写。");
                return false;
    		}
    	}
    	item.fdate = data[i].fdate;
    	item.checkTime = data[i].checkTime;
        list.push(item);
    }
    return true;
}

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attNotCardCertificateAction!deleteNotCardCertsDetail.ajax', 
		gridManager: gridManager, idFieldName: 'detailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
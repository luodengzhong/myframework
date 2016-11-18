var gridManager = null,addressGridManager=null;
var addressCityList={};
var dataSource={yesOrNo:{1:'是',0:'否'}};
var getTotalTimeAction = "/attBusinessTripAction!getTotalDays.ajax";
var detailEmptyTip = "请选择出差人员。";

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	addressCityList=$('#addressCityList').combox('getJSONData');
	initializeGrid();
    //核销时出差地点可编辑 该方法需要再initializeAddressGrid之前执行
    setVerifyProcUnitCityDetailEnable();
	initializeAddressGrid();
	initializeUI();
	bindEvents();
	cancelIsReadHandleResult();
	
	setTimeout(function() {
		setVerifyProcUnitEnable();
	}, 0);

	centreNameSelect($('#feeDeptName'));	
});
function initializeUI(){
	$('#toolbar_menuAdd').comboDialog({type:'sys',name:'orgSelect',width:480,
		dataIndex:'id',
		getParam: function(){
			 return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'  and instr(full_id, '.prj') = 0   " };
		},
		title:'出差人员选择',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["orgId"];
	    		addRow["organName"] = o["orgName"];
	    		addRow["isDriver"] = '0';
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
}
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){}, 
		deleteHandler: deleteHandler
		/*printHandler:{id:'printBill',text:'打印',img:'print.gif',click:function(){ 
			printBill();
		}}*/
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构", name: "organName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心", name: "centerName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		//{ display: "部门名称", name: "deptName", width: 140, minWidth: 60, type: "string", align: "left" },
		{ display: "人员", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'select', required: true, data: { type:"sys", name: "orgSelect", 
				getParam: function(){
//					 return { a: 1, b: 1, searchQueryCondition: " org_id = 'orgRoot'  and  org_kind_id ='psm'" };
					return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm' and instr(full_id, '.prj') = 0 " };
				}, back:{fullId: "fullId", orgId: "organId", orgName: "organName", centerId: "centerId", centerName: "centerName",
					deptId: "deptId", deptName: "deptName", positionId: "positionId", positionName: "positionName",
					personMemberId: "personMemberId", personMemberName: "personMemberName" }
		}}},
		{ display: "是否自驾司机", name: "isDriver", width: 100, minWidth: 60, type: "string", align: "left" ,
			editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.isDriver];
			} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attBusinessTripAction!slicedQueryBusinessTrip.ajax',
		parms:{businessTripId: $('#businessTripId').val() || 0,pagesize:1000},
		//pageSize : 20,
		width : '98.9%',
		height : 250,
		usePager: false,
		heightDiff : -5,
		headerRowHeight : 25,
		autoAddRowByKeydown:false,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{fullId: "", organId:"", centerId:"", deptId:"", positionId: "", personMemberId: ""},
		enabledEdit: true,
		checkbox: true,
		onLoadData: function(){
			return (getId() > 0);
		}
	});
	if (!getId()){
		initDefaultBusinessTripDetail();
	}
}
//添加默认人
function initDefaultBusinessTripDetail(){
	if (procUnitId == "Apply" && activityModel == "do" &&  gridManager.getData().length == 0){
	    var operator = ContextUtil.getOperator();
	    gridManager.addRow({ 
			fullId:  operator["fullId"],
		    organId: operator["orgId"],
			organName: operator["orgName"],
			centerId: operator["centerId"],
			centerName: operator["centerName"],
			deptId: operator["deptId"],
			deptName: operator["deptName"],
			positionId: operator["positionId"],
			positionName: operator["positionName"],
			personMemberId: operator["personMemberId"],
			personMemberName: operator["personMemberName"],
			isDriver: 0
        });
	}
}

function initializeAddressGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addCirys:{id:'addCirys',text:'添加出差地点',img:'page_new.gif',click:function(){
			var startCity='';
			try{
				var datas=addressGridManager.getData();
				var length=datas.length;
				if(length>0){
					//默认出发地
					startCity=datas[length-1]['endCity'];
				}
			}catch(e){}
			UICtrl.addGridRow(addressGridManager,{startCity:startCity});
		}}, 
		deleteHandler: deleteCitysHandler
	});
	addressGridManager = UICtrl.grid('#addressgrid', {
		columns: [
		{ display: "出发地", name: "startCity", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:addressCityList,required: true}
		},		   
		{ display: "到达地", name: "endCity", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:addressCityList,required: true}
		},		  
		{ display: "时间起", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'date',required: true}
		},
		{ display: "时间止", name: "endDate", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'date',required: true}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attBusinessTripAction!slicedQueryBusinessTripCitys.ajax',
		parms:{businessTripId: $('#businessTripId').val() || 0,pagesize:100},
		width : '98.9%',
		height : 250,
		usePager: false,
		heightDiff : -5,
		headerRowHeight : 25,
		autoAddRowByKeydown:false,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
		checkbox: true,
		onLoadData: function(){
			return (getId() > 0);
		}
	});
}

function print(){
	printBill();
}
function printBill(){
	window.open(web_app.name + '/attBusinessTripAction!createPdf.load?businessTripId='+$("#businessTripId").val());	
}

function addHandler() {
	UICtrl.addGridRow(gridManager);
}

function reloadGrid() {
	gridManager.loadData();
	addressGridManager.loadData();
} 

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBusinessTripAction!deleteBusinessTripDetail.ajax', 
		gridManager: gridManager, idFieldName: 'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function deleteCitysHandler(){
	DataUtil.delSelectedRows({ action:'attBusinessTripAction!deleteBusinessTripCitysDetail.ajax', 
		gridManager: addressGridManager, idFieldName: 'citysId',
		onSuccess:function(){
			addressGridManager.loadData();
		}
	});
}
function getId() {
	return $("#businessTripId").val() || 0;
}

function setId(value){
	$("#businessTripId").val(value);
	gridManager.options.parms['businessTripId'] =value;
	addressGridManager.options.parms['businessTripId'] =value;
}

//选择中心
function centreNameSelect($el){
	$el.orgTree({filter:'ogn,dpt',manageType:'noControlAuthority',
		getParam:function(){
			var ognId='orgRoot';
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		onChange:function(values,nodeData){
			$("#feeDeptName").val(nodeData.fullName);
		},
		back:{
			text:$el,
			value:'#feeDeptId',
			id:'#feeDeptId',
			name:$el
		}
	});
}

function getExtendedData(){
	if (!checkDuplicate()){
		return false;
	}
	var extendedData = {};
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if (!detailData){
		return false;
	}
	if (gridManager.getData().length == 0){
		Public.tip(detailEmptyTip);
		return false;
	}
	//在申请环节 或 核销环节使用
	if (isApplyProcUnit()||isVerifyProcUnit()){
		//var citysData = DataUtil.getGridData({gridManager: addressGridManager});
		var citysData = addressGridManager.rows;
		if (!citysData){
			return false;
		}
		if (addressGridManager.getData().length == 0){
			Public.tip('请填写出差地点及时间!');
			return false;
		}
		//出差时间及地点判断
		var main=getCheckData();
		var flag=true,startDate,endDate;
		var detailMinStartDate = null,detailMaxEndDate = null;
		$.each(citysData,function(i,o){
			/*if(o.startCity==o.endCity){
				Public.tip('出发地与到达地不能相同"'+o.endCity+'"!');
				flag=false;
				return false;
			}*/
			startDate=o.startDate;
			if(detailMinStartDate==null){
				detailMinStartDate=o.startDate;
			}
			else{//比较大小，获取较小的值
				if (Public.dateCompare(startDate,detailMinStartDate)<0){
					detailMinStartDate = startDate;
				}
			}
			endDate=o.endDate;
			if(detailMaxEndDate==null){
				detailMaxEndDate=o.endDate;
			}
			else{//比较大小，获取较大的值
				if (Public.dateCompare(detailMaxEndDate,endDate)<0){
					detailMaxEndDate = endDate;
				}
			}
			//判断出差时间
			if(main.startDate&&main.endDate){
				if (Public.dateCompare(startDate,main.startDate)<0){
					Public.tip('时间起"'+startDate+'",与整体时间不匹配!');
					flag=false;
					return false;
				}
				if (Public.dateCompare(main.endDate,endDate)<0){
					Public.tip('时间止"'+endDate+'",与整体时间不匹配!');
					flag=false;
					return false;
				}
			}
		});
		if(detailMinStartDate.substring(0,10)!=main.startDate.substring(0,10)){
			Public.tip('出差开始时间与细项最小时间不匹配!');
			flag=false;
			return false;
		}
		if(detailMaxEndDate.substring(0,10)!=main.endDate.substring(0,10)){
			Public.tip('出差结束时间与细项最大时间不匹配!');
			flag=false;
			return false;
		}
		if(!flag) return false;
		extendedData.citysData = encodeURI($.toJSON(citysData));
	}
	extendedData.detailData = encodeURI($.toJSON(detailData));
	return extendedData;
}

function afterSave(data){
	if (isApplyProcUnit()){
		$('#address').val(data);
	}
}
//获取用于校验的时间
function getCheckData(){
	if(isApplyProcUnit()){
		return {startDate:getStartTime(),endDate:getEndTime()};
	}
	if(isVerifyProcUnit()){
		return {startDate:getVerifyStartTime(),endDate:getVerifyEndTime()};
	}
	return {};
}

function isVerifyProcUnit(){
	return procUnitId == "Verify" && activityModel == "do";
}
//核销时出差地点可编辑
function setVerifyProcUnitCityDetailEnable(){
	if (isVerifyProcUnit()) {
		permissionAuthority['addressgrid.addCirys']={authority:'readwrite',type:'2'};
		permissionAuthority['addressgrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['addressgrid.startCity']={authority:'readwrite',type:'1'};
		permissionAuthority['addressgrid.endCity']={authority:'readwrite',type:'1'};
		permissionAuthority['addressgrid.startDate']={authority:'readwrite',type:'1'};
		permissionAuthority['addressgrid.endDate']={authority:'readwrite',type:'1'};
	}
}
var personGridManager = null, refreshFlag = false,juryTypeMap=null;
$(document).ready(function() {
    juryTypeMap=$('#juryTypeMap').combox('getJSONData');
   $('#talentsChosenDemandFileList').fileList();
   posNameSelect($('#chosenPosName'));
   var needDoTask=$('#needDoTask').val();
   		var tr=$('#chosenedNumTr');

   if(needDoTask==1){
      $('div,span',tr).add(tr).show();
   }else{
   	      $('div,span',tr).add(tr).hide();
   }
   setEditable(); 
	initializeGrid();
	
});

function setEditable(){
	
	if(isApproveProcUnit()){//是审核中
        setTimeout(function(){
				$('#talentsChosenDemandFileList').fileList('enable');

		},0);
	    permissionAuthority['maingrid.addMainPersonHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.addCommonPersonHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.deletePersonHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.juryTypeId']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.sequence']={authority:'readwrite',type:'1'};
	}

}
function posNameSelect($el){
	var organId=$('#organId').val();
	$el.orgTree({filter:'pos',
	    manageType:'hrBaseTalentsChosenData',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#chosenPosId').val()==''){
				$('#posLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/recruitApplyAction!queryPosDeclare.ajax", {posId: $('#chosenPosId').val()}, 
				function(data) {
				$('#inputQueryTable').find('input').val('');
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#posLevel').combox('setValue',id);
						}else{
							$('#'+i).val(id);
						}
					});
				});
			
	        	$('#chosenCenterName').val(nodeData.centerName);
	        	$('#chosenCenterId').val(nodeData.centerId);
	        	$('#chosenDeptName').val(nodeData.deptName);
	        	$('#chosenDeptId').val(nodeData.deptId);
	        	
	        	
			}else{
				$('#posLevel').combox('setValue');
			}
       	   var param = $.extend({}, {
		     posId:$('#chosenPosId').val()
       	   });
       	     UICtrl.gridSearch(personGridManager, param);

		},
		back:{
			text:$el,
			value:'#chosenPosId',
			id:'#chosenPosId',
			name:$el,
			posLevel:'#posLevel',
			centerName:'#chosenCenterName',
			centerId:'#chosenCenterId',
			deptName:'#chosenDeptName',
			deptId:'#chosenDeptId'
		}
	});
}
//初始化表格
function initializeGrid() {

	var chosenPosId=$('#chosenPosId').val();
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addMainPersonHandler : {
            id: 'addMainPerson',
            text: '增加主评委',
            img: 'page_new.gif',
            click: addMainPersonHandler
        },
        addCommonPersonHandler : {
            id: 'addCommonPerson',
            text: '增加平级评委',
            img: 'page_new.gif',
            click: addCommonPersonHandler
        },
         addLowerPersonHandler : {
            id: 'addLowerPerson',
            text: '增加下级评委',
            img: 'page_new.gif',
            click: addLowerPersonHandler
        },
		deletePersonHandler:{
            id: 'deletePerson',
            text: '删除评委',
            img: 'page_delete.gif',
            click: deletePersonHandler
        }

	});
	
	columns=[ {
			display : "评分姓名",
			name : "juryName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center"
		}, {
			display : "评委类别",
			name : "juryTypeId",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center",
			editor : {
				type : 'combobox',
				data : juryTypeMap
			},
			render : function(item) {
				return juryTypeMap[item.juryTypeId];
			}
		},
		{
		display : "序号",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "center",
			editor : {
				type : 'text',
				required : true,
				mask : 'nn'
			}
		}
		
		];
	
	personGridManager = UICtrl.grid('#maingrid', {
		columns : columns,
		dataAction : 'server',
		url : web_app.name + '/talentschosendemandAction!slicedQueryJuryCompose.ajax',
		pageSize : 20,
		parms : {
			posId : chosenPosId
		},
		width : '99%',
		height : 450,
		heightDiff : -5,
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
			return !($('#chosenPosId').val() == '');
		}

	});
	UICtrl.setSearchAreaToggle(personGridManager);

	
}


function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: personGridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}
function addCommonPersonHandler(){
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    var type='2';
	UICtrl.showFrameDialog({
		title : "选择平级评委",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name',type);
			_self.close();
		}
	});
}

function addLowerPersonHandler(){
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    var type='3';
	UICtrl.showFrameDialog({
		title : "选择下级评委",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name',type);
			_self.close();
		}
	});
}
function addMainPersonHandler(){
	
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    var type='1';
	UICtrl.showFrameDialog({
		title : "选择主评委",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name',type);
			_self.close();
		}
	});
}
function addPersons(data,idName,name,type){
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		
		// 绩效考核全部默认为上级
		addRow = $.extend({}, o);
		addRow["juryComposeId"]='';
		addRow["posId"]='';
		addRow["juryPersonId"] = o[idName];
		addRow["juryName"] = o[name];
		addRow["juryTypeId"] = type;
		addRow["sequence"] = i+1;
		addRows.push(addRow);
	});
	personGridManager.addRows(addRows);
}
function deletePersonHandler(){
	
	DataUtil.delSelectedRows({action:'talentschosendemandAction!deleteJuryCompose.ajax',
		gridManager:personGridManager,idFieldName:'juryComposeId',
		param:{juryComposeId:$('#juryComposeId').val()},
		onSuccess:function(){
			reloadGrid();
		}
	});

}

function reloadGrid(){
	personGridManager.loadData();
}
function getId() {
	return $("#talentsChosenDemandId").val() || 0;
}

function setId(value){
	$("#talentsChosenDemandId").val(value);
    $('#talentsChosenDemandFileList').fileList({bizId:value});

}



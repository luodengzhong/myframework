var scorePersonLevel=null,gridManager = null;
$(document).ready(function() {
	   $('#probationPosApplyFileList').fileList();
	    posNameSelect($('#beformalPosName'));
	     $('#staffName').searchbox({ type:"hr",name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",sex:"#sex",birthdate:"#birthday",
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",employedDate:"#employedDate",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId",education:"#education",campus:"#campus",
				specialty:"#specialty",jobTitleName:"#jobTitleName",personId:"#personId"},
		onChange:function(){
			        	 $('#sex').combox('setValue');
			        	 $('#education').combox('setValue');
			        	 gridManager.options.parms['personId'] =$("#personId").val();
	     		         reloadGrid();
		 	          }
		
	 });
   scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
   setEditable(); 
   
   initGrid();
});

function setEditable(){
	
	if(isApproveProcUnit()){//是审核中
        setTimeout(function(){
				$('#probationPosApplyFileList').fileList('enable');

		},0);
	}

}
 function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#beformalPosId').val()}, function(data) {
					$.each(data,function(i,id){
					if(i=='posLevel'){
							$('#posLevel').val(id);
						}});
				});
				$('#beformalOrganName').val(nodeData.orgName);
	        	$('#beformalOrganId').val(nodeData.orgId);
	        	$('#beformalDeptName').val(nodeData.deptName);
	        	$('#beformalDeptId').val(nodeData.deptId);
	        	$('#beformalCenterId').val(nodeData.centerId);
	        	$('#beformalCenterName').val(nodeData.centerName);
			}else{
				$('#posLevel').combox('setValue');
			}
       	 
		},
		back:{
			text:$el,
			value:'#beformalPosId',
			id:'#beformalPosId',
			name:$el,
			posLevel:'#posLevel',
			orgName:'#beformalOrganName',
			orgId:'#beformalOrganId',
			deptName:'#beformalDeptName',
			centerId:'#beformalCenterId',
			centerName:'#beformalCenterName',
			deptId:'#beformalDeptId'
		}
	});
}
function getId() {
	return $("#posBeformalId").val() || 0;
}

function setId(value){
	$("#posBeformalId").val(value);
    $('#probationPosApplyFileList').fileList({bizId:value});

}
function reloadGrid(){
	gridManager.loadData();
}
function initGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(gridManager);
		}, 
		deleteHandler: deleteHandler	
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "测评人", name: "scorePersonName", width: 200, minWidth: 200, type: "string", align: "left",
			editor: { type: 'select',   required: true, data: { type:"sys", name: "orgSelect",
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0" };
				}, back:{personMemberId: "scorePersonId", personMemberName: "scorePersonName" }
		}}},
			
	  { display: "级别", name: "scorePersonLevel", width: 150, minWidth: 150, type: "String", align: "center",
			editor: { type:'combobox',data : scorePersonLevel, required: true},	
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		},		   
		
		 {display : "序号",name : "sequence",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}},
			 {display : "权重",name : "proportion",width : 100,minWidth : 60,type : "string",align : "left"
			
			}
		],
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryPerformAssessPerson.ajax',
		parms:{personId:$('#personId').val(),periodCode:'lzcp'},
		pageSize : 20,
		width : '99%',
		height : 300,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{scorePersonId:'',assessPersonId:'',underAssessmentId:''},
		onLoadData :function(){
			return true;
		}
	});

}

//删除评分人
function deleteHandler(){
	DataUtil.delSelectedRows({ action:'reshuffleAction!deletePerformAssessPerson.ajax',
		gridManager: gridManager,idFieldName:'assessPersonId',
		onSuccess:function(){
			reloadGrid();
		}
	});	
}


function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager,idFieldName:'assessPersonId'});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
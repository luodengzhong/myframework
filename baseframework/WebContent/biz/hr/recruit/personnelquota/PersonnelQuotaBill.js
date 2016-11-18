var gridManager=null;
var fullIdValue=null;
$(document).ready(function() {
	initializeGrid();
	initUI();
	fullIdValue=$('#organCenterId').val();
	
});
function initUI(){
	$('#quatoFileList').fileList();
	 var $el=$('#organCenterName');
	 var organId=$('#organId').val();
    $el.orgTree({filter:'ogn,dpt,pos',
		manageType:'hrBasePersonquatoData',
    	param:{searchQueryCondition:"org_kind_id in('ogn','dpt','pos') "},
    	beforeChange:function(data){
			var fullId=null;
			if($.isPlainObject(data)){
				fullId=data['fullId'];
			}else{
				fullId=$('input[name="fullId"]',data).val();
			}
			$('#fullId').val(fullId);
		},
    	onChange:function(values){
    		if(values.value!=fullIdValue){
    			fullIdValue=values.value;
    			var datas=gridManager.getAdded();
    			$.each(datas,function(i,o){
    				gridManager.deleteRow(o);
    			});
    			gridManager.deletedRows=null;
				var fullId=$('#fullId').val();
				var affirmPersonApplyId=$('#affirmPersonApplyId').val();
				if(fullId!=''){
					var url=web_app.name+'/hRPersonnelQuotaAction!queryOrganNumberByID.ajax';
					Public.ajax(url,{fullId:fullId,affirmPersonApplyId:affirmPersonApplyId},function(data){
						if(data.length>0){
						gridManager.addRows(data);
						}else{
							Public.tip("所选择的组织无任何编制分类,请维护");
						}
					});
					
				}
    		}
	    	return true;
	    
    	},
    	
    	back:{
			text:$el,
			value:'#organCenterId',
			id:'#organCenterId'
		}});
}
function initializeGrid(){
	var fullId=$('#fullId').val();
	var affirmPersonApplyId=$('#affirmPersonApplyId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		/*choiceOrganHandler:{id:'choiceOrgan',text:'选择变更组织',img:'page_user.gif',click:function(){l
			choiceOrganHandler();
		}},*/
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'hRPersonnelQuotaAction!deletePerQuatoDetail.ajax',
				gridManager:gridManager,idFieldName:'affirmPersonDetailId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
          }
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "组织名称", name: "changeOrganName",id:"changeOrganName", width: 400, minWidth: 60, type: "string", align: "left" },
		{ display: "编制类别", name: "staffingLevelTextView", width: 150, minWidth: 60, type: "string", align: "left" },	
		{ display: "原定员人数", name: "orgNumOld", width: 150, minWidth: 60, type: "string", align: "left" },	
		{ display: "已有人数", name: "existNum", width: 150, minWidth: 60, type: "string", align: "left" },	
		{ display: "调整后的定员人数", name: "orgNumNew", width: 150, minWidth: 60, type: "string", align: "left",
			editor:{type: 'text',required:true,mask:'nnnnn'}}		   
		],
		dataAction : 'server',
		url:web_app.name+'/hRPersonnelQuotaAction!sliceOrganNumberById.ajax',
		parms:{fullId:fullId,affirmPersonApplyId:affirmPersonApplyId},
		pageSize : 20,
		width : '100%',
		height : '200',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
        onLoadData :function(){
			return !($('#affirmPersonApplyId').val()=='');
		}
	});

}

function getId() {
	return $("#affirmPersonApplyId").val() || 0;
}

function setId(value){
	$("#affirmPersonApplyId").val(value);
	gridManager.options.parms['affirmPersonApplyId'] =value;
    $('#quatoFileList').fileList({bizId:value});
}


function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}

function choiceOrganHandler(){
	
	
}


/*function save(fn){
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	//先保存到表,并修改status为0 申请 
		$('#submitForm').ajaxSubmit({url: web_app.name + '/hRPersonnelQuotaAction!insertPersonnelQuota.ajax',
			param : $.extend({}, detailData),			
			success : function(data) {
				$('#affirmPersonApplyId').val(data);
				reloadGrid();
			}
		});
}


function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

function advance(){
	var affirmPersonApplyId=$('#affirmPersonApplyId').val();
	if(!affirmPersonApplyId){ 
		$('#submitForm').ajaxSubmit({url: web_app.name + '/hRPersonnelQuotaAction!insertPersonnelQuota.ajax',
			param:{status:1},
			success : function(data) {
				
			}
		});}else{
			$('#submitForm').ajaxSubmit({url: web_app.name + '/hRPersonnelQuotaAction!updatePersonnelQuota.ajax',
				param:{status:1},
				success : function() {
					
				}
			});
		}
	
}
*/

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
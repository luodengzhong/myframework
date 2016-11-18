var gridManager = null, refreshFlag = false;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
});

function initUI(){
	$('#infoDemandIdAttachment').fileList();
	$("#functionName").treebox({
		name: 'funSelect',
		treeLeafOnly: true,
		getParam : function(data) {
			return {};
		},
		back:{text:'#functionName',value:'#functionId'},		
		onChange: function(node){
				
		}
	});
	//审批中可填写
	
		$("#dealPersonName").searchbox({type : "sys", name : "orgSelect", 
			getParam : function() {
				return {a : 1, b : 1,  searchQueryCondition : "org_kind_id ='psm'"};
			},
			back:{personMemberId:"#dealPersonId",personMemberName:"#dealPersonName"}
		});
		$("#selfDeptName").orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}, 
			back:{
				text:'#selfDeptName',
				value:'#selfDeptId',
				id:'#selfDeptId',
				name:'#selfDeptName'
			}
		});
		$('#oaTaskKindName').treebox({
	    	treeLeafOnly: true, name: 'taskKind',width:200,height:230,
	    	beforeChange:function(data){
	    		if(data.nodeType=='f'){
	    			return false;
	    		}
	    		return true;
	    	},
	    	back:{
	    		text:'#oaTaskKindName',
	    		value:'#oaTaskKindId'
	    	}
	    });
   if(isApproveProcUnit()){
	    setTimeout(function(){
	    	UICtrl.enable($("#dealPersonName"));
	    	UICtrl.enable($("#selfDeptName"));
	    	UICtrl.enable($('#oaTaskKindName'));
	    },0);
	}
}

function getId() {
	return $("#infoDemandId").val() || 0;
}

function setId(value){
	$("#infoDemandId").val(value);
	$('#infoDemandIdAttachment').fileList({bizId:value});
}
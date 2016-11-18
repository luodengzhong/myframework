
var handlerArray=new Array();

//打开机构选择对话框
function showChooseOrgDialog(personKind){ 
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system'; 
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']=o['orgKindId'];
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['name']);
		html.push('</span">;&nbsp;');
	});
	showDiv.html(html.join(''));
}

//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}

function initSerchBox(){
	var error= $("#errorinfo").val()
	if(error){
		UICtrl.setReadOnly($('#submitForm'));
		Public.tip(error); 				
	}
	
	$("#dealPersonName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1,  searchQueryCondition : " dept_id = '"+$("#selfDeptId").val()+"' and org_kind_id ='psm'"};
		},back:{personMemberId:"#dealPersonId",personMemberName:"#dealPersonName",fullId:"#dealPersonFullId"}
	});
	$("#selfDeptName").orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}, 
		back:{
			text:'#selfDeptName',
			value:'#selfDeptId',
			id:'#selfDeptId',
			name:'#selfDeptName'
		}
	});

}

$(document).ready(function() {
	initializeUI();
	initQueryInfoPushRange();
});
function getId() {
	return $("#webPushAuditId").val() || 0;
}
function setId(value){
	$("#webPushAuditId").val(value);
}

function initializeUI(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#effectiveTime');
			UICtrl.enable('#invalidTime');
			UICtrl.enable('#priority');
			$('#choosePushRangeTR').show();
		},0);
	}
}
//预览
function previewInfo(){
	var id=$('#infoPromulgateId').val();
	if(id==''){
		return;
	}
	var url=web_app.name + '/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&isReadOnly=true&infoPromulgateId='+id;
	parent.addTabItem({ tabid: 'previewInfo'+id, text: '信息预览', url:url});
}
//弹屏范围选择
var personArray=new Array();
function initQueryInfoPushRange(){
	var id=$('#webPushAuditId').val();
	if(id==''){
		return;
	}
	clearChooseArray();
	Public.ajax(web_app.name + '/infoWebPushAuditAction!queryInfoPushRange.ajax', {webPushAuditId:id}, function(data){
		$.each(data,function(i,d){
			personArray.push(d);
		});
		initShowDivText();
	});
}
function showChooseOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
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
			var flag=true
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']='infoPushRange';
				personArray.push(o);
			});
			if(!flag) return false;
			initShowDivText();
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
function initShowDivText(){
	var showDiv=$('#pushRangeShowDiv');
	var html=new Array(),fullId=null;
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['name']);
		html.push('</span">;');
	});
	showDiv.html(html.join(''));
}
//清空已选择列表
function clearChooseArray(){
	$('#pushRangeShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}
function getExtendedData(){
	return {detailData:encodeURI($.toJSON(personArray))};
}
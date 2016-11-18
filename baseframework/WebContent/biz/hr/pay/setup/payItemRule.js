$(document).ready(function() {
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],id='',fullName='';
	if(!data){
		html.push('计算规则');
	}else{
		id=data.id,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>计算规则');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#organId').val(id);
	loadPayItemRule();
}
function getData(){
	return $('#submitForm').formToJSON();
}
function loadPayItemRule(){
	var data=getData();
	Public.ajax(web_app.name + '/paySetupAction!loadPayItemRule.ajax', data, function(data) {
		var visible=data['visible'];
		var defVisible=$('#defVisible').val();
		visible=Public.isBlank(visible)?defVisible:visible;
		$('#id').val(data['id']||'');
		$('#ruleContent').val(data['ruleContent']||'');
		$('#visible1').setValue(visible);
	});
}
function setId(id){
	$('#id').val(id);
}
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
	$('#organizationId').val(id);
	loadWelfareRule();
}
function getData(){
	return $('#submitForm').formToJSON();
}
function loadWelfareRule(){
	var data=getData();
	Public.ajax(web_app.name + '/welfareTypeAction!loadWelfareRule.ajax', data, function(data) {
		$('#welfareRuleId').val(data['welfareRuleId']||'');
		$('#ruleContent').val(data['ruleContent']||'');
	});
}
function setId(id){
	$('#welfareRuleId').val(id);
}
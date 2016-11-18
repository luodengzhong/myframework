var operateCfg = {}, parentId = -1, item, templateKindId;
$(function() {
	getQueryParameters();
	loadTree();

	function getQueryParameters() {
		item = parseInt(Public.getQueryStringByName("item")) || 1;
		templateKindId = parseInt(Public.getQueryStringByName("templateKindId"))
				|| 0;
	}

	function getLoadActionUrl() {
		var url = web_app.name;
		switch (item) {
			case EBaseDataItem.TransactionDefine :
				url += "/transactionDefineAction!queryAllTransactionDefine.ajax";
				break;
			case EBaseDataItem.EventDefine :
				url += "/eventDefineAction!queryAllEventDefine.ajax";
				break;
			case EBaseDataItem.VariableDefine :
				url += "/variableDefineAction!queryAllVariableDefine.ajax";
				break;
			case EBaseDataItem.ContractClassification :
				url += "/contractClassificationAction!queryAllContractClassification.ajax";
				break;
			case EBaseDataItem.DocumentClassification :
				url += "/documentClassificationAction!queryAllDocumentClassification.ajax";
				break;
			case EBaseDataItem.FileTemplate :
				url += "/fileTemplateAction!queryAllFileTemplate.ajax";
				break;
			case EBaseDataItem.FunctionDefine :
				url += "/functionDefineAction!queryAllFunctionDefine.ajax";
				break;
		}

		return url;
	}

	function loadTree() {
		PACommonTree.createTree({
					loadAction : getLoadActionUrl(),
					isShowMenu : false,
					treeId : "#maintree",
					parentId : parentId,
					templateKindId : templateKindId
				});
	}

});

function getSelectedTreeNodeData() {
	var node = PACommonTree.treeManager.getSelected();
	if (!node) {
		parent.Public.tip('请选择分类!');
		return;
	}
	if (!node.data.nodeId) {
		parent.Public.tip('不能选择根节点!');
		return;
	}
	return node.data;
}
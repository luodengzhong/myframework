<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 380px;">

		<x:hidden name="parentId" />
		<x:hidden name="reProcdefTreeId" />
		<x:hidden name="fullId" />
		<x:hidden name="fullName" />

		<div class="row">
			<x:inputL name="code" required="true" label="编码" maxLength="60"
				width="250" labelWidth="100" />
		</div>
		<div class="row">
			<x:inputL name="name" required="true" label="名称" maxLength="60"
				width="250" labelWidth="100" />
		</div>
		<x:selectL name="nodeKindId" required="true" label="类别" maxLength="50"
			list="#{'folder':'文件夹', 'proc':'流程', 'procUnit': '流程环节'}" width="250"
			labelWidth="100" />
		<div class="row">
			<x:radioL list="#{'1':'是','0':'否'}" name="needTiming" value="1"
				label="是否计时" labelWidth="100" />
		</div>
		<div class="row">
			<x:radioL list="#{'1':'启用','0':'禁用'}" name="status" value="1"
				label="状态" labelWidth="100" />
		</div>
		<div class="row">
			<x:radioL list="#{'1':'是','0':'否'}" name="showQueryHandlers" value="1"
				label="预览处理人" labelWidth="100" />
		</div>
		<div class="row">
			<x:inputL name="sequence" required="false" label="排序号" maxLength="22"
				spinner="true" mask="nnnn" dataoptions="min:1" labelWidth="100"
				width="250" />
		</div>
		<div class="row">
			<x:inputL name="approvalRuleProcDefKey" required="false"
				label="审批规则ProcID" maxLength="60" width="250" labelWidth="100" />
		</div>
		<div class="row">
		<x:hidden name="appModelId" />
			<x:inputL name="appModelName" required="false"
				label="App模型名称" maxLength="60" width="250" labelWidth="100" wrapper="select"/>
		</div>
		<div class="row">
			<x:textareaL name="description" label="描述" maxLength="256" rows="3"
				labelWidth="100" width="250" />
		</div>
	</div>
</form>

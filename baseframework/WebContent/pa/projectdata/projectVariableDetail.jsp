<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="projectVariableId" id="projectVariableId" />
	<x:hidden name="variableDefineId" id="variableDefineId" />
	<x:hidden name="bizKindId" id="bizKindId" />
	<x:hidden name="bizId" id="bizId" />
	<x:hidden name="parentId" id="parentId" />
	<x:hidden name="kindId" id="kindId" />
	<div class='ui-form' id='queryTable'>
		<x:inputL name="variableValue" id="variableValue" required="ture"
			label="编码" readonly="false" labelWidth="60" width="260" />
		<x:inputL name="variableText" id="variableText" required="ture"
			label="名称" readonly="false" labelWidth="60" width="260" />
		<x:inputL name="sequence" id="sequence" required="ture" label="排序号"
			readonly="false" spinner="true" mask="nnn" dataoptions="min:1"
			labelWidth="60" width="85" />
	</div>
</form>

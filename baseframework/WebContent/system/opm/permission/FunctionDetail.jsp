<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id" />
	<x:hidden name="parentId" />
	<x:hidden name="operationMapId" />
	<div class='ui-form' id='queryTable'>
		<x:inputL name="code" required="true" label="编码" readonly="false" labelWidth="60" width="280"/>
		<x:inputL name="name" id="name" required="true" label="名称"
			readonly="false" labelWidth="60" width="280"/>
		<x:inputL name="description" required="false" label="描述"
			readonly="false" labelWidth="60" width="280"/>
		<x:inputL name="operationMapName" label="业务导图" readonly="false" labelWidth="60" width="280" wrapper="tree"/>
		<x:inputL name="url" label="Url" readonly="false" labelWidth="60" width="280"/>
	
		<div class="row">
			<x:inputL name="icon" id="input_icopath" label="图标" readonly="false" labelWidth="60" width="235" required="true"/>
			<x:button value="..." onclick="chooseImg()"
				cssStyle="min-width:30px;" />
		</div>
		<x:inputL name="sequence" required="false" label="排序号"
			readonly="false" spinner="true" mask="nnn" dataOptions="min:1" labelWidth="60" width="60"/>
		<x:radioL list="#{'1':'启用','0':'禁用'}" name="status" value="1"
			label="状态" labelWidth="60" width="130"/>
		<x:textareaL name="remark" label="备注" readonly="false" labelWidth="60" width="280" rows="3"></x:textareaL>
	</div>
</form>
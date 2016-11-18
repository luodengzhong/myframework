
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 300px;">
		<x:hidden name="institutionTreeId" />
		<x:hidden name="parentId" />
		<x:hidden name="kind" />
		<div class="row">
			<x:inputL name="name" required="true" label="名称" maxLength="64"/>
		</div>
		<div class="row">
			<x:selectL name="opfunctionCode" required="false" label="系统模块" list="opfunctionList"/>
		</div>
		<div class="row">
			<x:inputL name="sequence" required="true" label="序列号" mask="nnn"/>
		</div>
		<div class="row">
			<x:selectL name="status" readonly="true" label="是否启用" dictionary="yesOrNo" />
		</div>
	</div>
</form>

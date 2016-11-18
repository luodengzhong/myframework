<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:300px;">
		<x:inputL name="empNo" required="true" label="人员编号" maxLength="16" readonly="true" cssClass="text textReadonly"/>
		<x:inputL name="empName" required="true" label="人员名称" maxLength="28" />
		<x:inputL name="idCardNo" required="false" label="身份证号" maxLength="20" />
		<x:textareaL name="remark" required="false" label="备注" maxLength="100"  height="80" rows="5"/>
	</div>
</form>

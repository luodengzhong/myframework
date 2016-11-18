<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="payPerformanceKindRuleId"/>
		<div class="row">
		<x:selectL name="wageKind" required="true" label="工资类别" labelWidth="60"/>	
		<%-- <x:selectL list="wageKindList" id="wageKind" name="wageKind" label="工资类别" labelWidth="60"/> --%>	
		</div>
		<div class="row">
		<x:textareaL name="ruleContent" required="true" label="公式" maxLength="1000" labelWidth="60" width="380" rows="14"/>		
		</div>
		<div class="row">
		<x:inputL name="remark" required="true" label="描述" maxLength="100" labelWidth="60" width="380"/>		
		</div>
	</div>
</form>

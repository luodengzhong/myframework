<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:280px;">
		<x:hidden name="evaluateOrgId" id="detailEvaluateOrgId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="orgUtilId" id="detailOrgUtilId"/>
		<x:inputL name="orgUtilName" required="true" label="组织"  id="detailOrgUtilName" labelWidth="65" width="180" wrapper="select"/>		
		<x:selectL name="evaluateOrgKind" required="true" label="类别"  labelWidth="65" width="180" id="detailEvaluateOrgKind"/>
		<x:selectL name="isEvaluate" required="true" label="参与评价"  labelWidth="65" width="180"  dictionary="yesorno" id="detailIsEvaluate"/>
		<x:textareaL name="remark" required="false" label="备注" maxLength="200" labelWidth="65" height="80" rows="5" width="180"/>	
	</div>
</form>

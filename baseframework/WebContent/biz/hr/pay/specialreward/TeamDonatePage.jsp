<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="teamDonateForm">
	<div class="ui-form" style="width:300px;">
		<x:hidden name="teamDonateId"/>
		<x:inputL  name="proportion" label="捐赠比例(%)" required="true" mask="999"  id="detailTeamDonateProportion"/>
		<x:hidden name="personId" id="teamDonatePagePersonId"/>		
		<x:inputL name="personName" required="true" label="捐赠责任人" maxLength="64" id="teamDonatePagePersonName" wrapper="select"/>
		<x:textareaL name="remark" required="false" label="备注" maxLength="100" height="60" rows="4"/>
	</div>
</form>

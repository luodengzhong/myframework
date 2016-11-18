<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="addDocumentForm">
	<div class="ui-form" >
		<x:inputL name="documentName" required="true" label="标  题" maxLength="120" labelWidth="80" width="200" id="addDocumentName"/>		
		<x:textareaL name="remark" required="false" label="描述/关键字" maxLength="100" rows="3" labelWidth="80" width="200"/>	
	</div>
</form>
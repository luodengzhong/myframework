<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:300px;">
		<x:hidden name="responsibilitiyDefineId" id="detailResponsibilitiyDefineId"/>
		<x:inputL name="code" required="true" label="编码" maxLength="16"  labelWidth="60" width="200"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="16" labelWidth="60" width="200"/>	
		<x:inputL name="sequence" required="true" label="序号" mask="999" labelWidth="60" width="80" id="detailSequence"/>	
		<div class="clear"></div>	
		<x:textareaL name="description" required="false" label="描述"  labelWidth="60" width="200" rows="4" maxlength="100"/>	
	</div>
</form>

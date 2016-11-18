<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="dictId" id="dictIdDetal"/>
		<x:inputL name="code" required="true" label="编码" maxLength="50" labelWidth="60"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="50" labelWidth="60"/>
		<x:radioL name="kind"  label="类别" list="#{'1':'用户','0':'系统'}" value="1" labelWidth="40" width="120"/>	
		<x:inputL name="remark" required="false" label="备注" maxLength="200" width="635" labelWidth="60"/>	
	</div>
</form>
<div id="dictDetalGrid" style="margin: 2px;"></div>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="id" id="parameterID"/>
		<div class="row">
		<x:inputL name="code" required="true" label="编码" maxLength="32" labelWidth="80" width="260"/>		
		</div>
		<div class="row">
		<x:inputL name="name" required="true" label="名称" maxLength="30" labelWidth="80" width="260"/>		
		</div>
		<div class="row">
		<x:inputL name="value" required="true" label="参数值" maxLength="4000" labelWidth="80" width="260"/>
		</div>
		<div class="row">
		<x:inputL name="remark" required="false" label="备注" maxLength="100" labelWidth="80" width="260"/>		
		</div>
	</div>
</form>

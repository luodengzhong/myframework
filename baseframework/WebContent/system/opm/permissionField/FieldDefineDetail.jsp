<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm" style="width:320px">
	<div class="ui-form">
		<x:hidden name="fieldId"/>
		<x:hidden name="parentId"/>
		<x:inputL name="fieldCode" required="true" label="字段编码" maxLength="32" labelWidth="80"/>
		<x:inputL name="fieldName" required="true" label="字段名称" maxLength="64" labelWidth="80"/>	
		<x:selectL name="fieldType" required="true" label="字段类别" labelWidth="80" emptyOption="false"/>
		<x:radioL name="fieldAuthority" label="默认权限" labelWidth="80" dictionary="fieldAuthority" value="readonly" width="200"/>
	</div>
</form>

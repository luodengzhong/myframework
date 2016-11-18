<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="15%,35%,15%,35%" />
		<tr>
			<x:hidden name="id" id="templetIdDetail" />
			<x:inputTD name="templetName" required="true" label="模板名称" maxLength="50" />
			<x:inputTD name="templetCode" required="true" label="模板编码" maxLength="32" />
		</tr>
		<tr>
			<x:inputTD name="tableName" required="true" label="中间表名称" maxLength="50" />
			<x:inputTD name="procedureName" required="true" label="存储过程名" maxLength="180" />
		</tr>
	</table>
</form>
<div id="exptempletid" style="margin-top: 2px;"></div>


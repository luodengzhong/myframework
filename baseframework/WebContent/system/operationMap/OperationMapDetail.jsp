<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="20%,30%,20%,30%" />
		<tr>
			<x:hidden name="operationMapId" id="detailOperationMapId" />
			<x:inputTD name="mapName" required="true" label="类别名称" maxLength="30" />
			<x:inputTD name="mapCode" required="true" label="类别编码" maxLength="16" />
		</tr>
		<tr>
			<x:textareaTD name="remark" required="false" label="描述" maxLength="120" colspan="3" rows="2"/>
		</tr>
	</table>
</form>
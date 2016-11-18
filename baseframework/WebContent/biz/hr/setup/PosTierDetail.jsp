<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="90px,140px,90px,140px"/>
		<tr>
			<x:hidden name="posId" />
			<x:inputTD name="fullName" required="false" label="岗位路径" disabled="true" colspan="3"/>
		</tr>
		<tr>
			<x:selectTD name="posTier" required="false" label="层级"/>
			<x:selectTD name="posLevel" required="false" label="行政级别"/>
		</tr>
		<tr>
			<x:selectTD name="posType" required="false" label="管理岗位类别"/>
			<x:selectTD name="systemType" required="false" label="体系分类"/>
		</tr>
			<x:textareaTD name="posExplain" required="false" label="岗位说明" maxLength="512" colspan="3" rows="7"/>
		</tr>
	</table>
</form>

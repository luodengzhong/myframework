<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="120px,240px" />
		<tr>
			<x:hidden name="indexId" />
			<tr>
			<x:inputTD name="sequence" required="true" label="序号" spinner="true" mask="nnn"/>
		</tr>
			<x:inputTD name="mainContent" required="true" label="主项目" maxlength="32" />
		</tr>
		<tr>
			<x:inputTD name="partContent" required="true" label="指标名称" maxlength="32"/>
		</tr>
		
		<tr>
			<x:textareaTD name="desption" required="false" label="指标说明" rows="4" maxlength="200"/>
		</tr>
	</table>
</form>

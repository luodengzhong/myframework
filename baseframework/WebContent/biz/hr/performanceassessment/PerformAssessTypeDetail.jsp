<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="100px,180px"/>
		<tr>	
		<x:inputTD name="sequence" required="true" label="序号" maxLength="22"/>
	     </tr>
	     <tr>
		<x:inputTD name="name" required="true" label="名称" maxLength="32"/>	
		</tr>
	     <tr>
		<x:hidden name="typeId"/>
		<x:inputTD name="code" required="true" label="编码" maxLength="32"/>		
		</tr>
		<tr>
			<x:selectTD name="paType"  required="true"  label="所属类别" />
	</tr>
	</table>
</form>

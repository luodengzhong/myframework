<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="120px,240px"/>
	     <tr>
		
		<x:hidden name="levelId"/>
		<x:inputTD name="sequence" required="true" label="序号" labelWidth="70" />
		</tr>
		<tr>
		<x:inputTD name="name" required="true" label="名称" />		
		</tr>
		<tr>
		<x:inputTD name="code" required="false" label="编码" labelWidth="70"/>		
			</tr>
		<tr>
		<x:inputTD name="value" required="true" label="值"  mask="nnn" />		
	     </tr>
	</table>
</form>

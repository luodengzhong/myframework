<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	 <tr>
		<x:hidden name="handoverDetailId"/>
		<x:inputTD name="desption" required="false" label="资料完备情况" maxLength="128"/>	
     </tr>
	<tr>	
	<x:inputTD name="receivingNameSign" required="false" label="接收人签名(本人姓名)" maxLength="65"/>		
	 </tr>
	</table>
</form>

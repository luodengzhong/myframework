<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="90px,100px,90px,100px"/>
	    <tr>
		<x:hidden name="detailId"/>
		<x:selectTD name="isSignProtocols" required="false" label="签订培训协议"  dictionary="yesorno"  colspan="3"/>		
	    </tr>
	</table>
	<x:fileList bizCode="isSignProtocolsFile" bizId="detailId" id="isSignProtocolsFileList" />
</form>

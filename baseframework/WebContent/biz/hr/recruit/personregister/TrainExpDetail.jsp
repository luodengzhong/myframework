<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	 <table class='tableInput' id='queryTable' >
	    <x:layout proportion="180px,180px,180px,180px" />
		<x:hidden name="trainId"/>
		<x:hidden name="writeId"/>
		<tr>
		<x:inputTD name="forCompany" required="true" label="举办单位" maxLength="15"/>		
		<x:inputTD name="trainContent" required="false" label="培训内容"  maxLength="30"/>	
		</tr>
		<tr>
		<x:inputTD name="writeTime" required="true" label="起始时间"  wrapper="date"/>		
		<x:inputTD name="endTime" required="true" label="终止时间" wrapper="date"/>		
		</tr>
		<tr>
		 <x:inputTD name="getCertificate" required="false" label="获得证书" maxLength="12"/>		
		 <x:inputTD name="sequence" required="false" label="序号"  mask="nnn"/>
		</tr>
	    <tr>
	     <x:textareaTD name="remark" required="false" label="备注"  rows="6" colspan="3"/>		
	    </tr>
	</table>
</form>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	 <table class='tableInput' id='queryTable' >
	     <x:layout proportion="180px,180px,180px,180px" />
		<x:hidden name="workId"/>
		<x:hidden name="writeId"/>
		<tr>
		<x:inputTD name="resumeBeginDate" required="true" label="工作起始时间" wrapper="date"/>		
		<x:inputTD name="resumeEndDate" required="true" label="工作结束时间" wrapper="date"/>	
		</tr>
		
			<tr>
			<x:inputTD name="resumeCompany" required="true" label="工作单位"  maxLength="20"/>		
		    <x:inputTD name="resumePos" required="true" label="担任职务"  maxLength="16"/>		
		    </tr>
			
			<tr>
			<x:inputTD name="linkmainPerson" required="false" label="证明人"  maxLength="16"/>		
		    <x:inputTD name="linkmainPhone" required="false" label="证明人联系电话" />		
		   </tr>
	       
	</table>
</form>

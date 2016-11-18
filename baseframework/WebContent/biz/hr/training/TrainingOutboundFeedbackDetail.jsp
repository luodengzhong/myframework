<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout  proportion="80px,160px,80px,160px"/>
		<tr>
		<x:hidden name="trainingOutboundFeedbackId"/>
		<x:inputTD name="course" required="false" label="培训课程" maxLength="64"/>		
		<x:inputTD name="teacherName" required="false" label="培训讲师" maxLength="32"/>		
		</tr>
		<tr>	
		<x:inputTD name="orgName" required="false" label="培训机构" maxLength="128"/>	
		<x:inputTD name="orgContact" required="false" label="联系人" maxLength="16"/>		
		</tr>
		<tr>
		<x:inputTD name="orgTel" required="false" label="联系电话" maxLength="16"/>	
		<x:inputTD name="place" required="false" label="培训地点" maxLength="128"/>		
		</tr>
		<tr>		
		<x:inputTD name="startTime" required="false" label="开始时间" wrapper="dateTime" maxLength="7"/>
		<x:inputTD name="endTime" required="false" label="结束时间" wrapper="dateTime" maxLength="7"/>
		</tr>
		<tr>	
		<x:inputTD name="trainingFee" required="false" label="培训实际费用"  maxLength="22"/>
		<x:inputTD name="travelExpenses" required="false" label="差旅费" maxLength="22"/>	
		</tr>
		<tr>
		<x:inputTD name="trainingType" required="false" label="培训方式" maxLength="32"  colspan="3"/>		
		</tr>
		<tr>		 
		<x:textareaTD name="trainingContent" required="false" label="培训内容" maxLength="512"  colspan="3"/>
		</tr>
		<tr>	
		<x:inputTD name="staffName" required="false" label="员工姓名" maxLength="64" wrapper="select"  colspan="3"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="ognId"/>
		<x:hidden name="ognName"/>
		<x:hidden name="centreId"/>
		<x:hidden name="centreName"/>
		<x:hidden name="dptId"/>
		<x:hidden name="dptName"/>
		</tr>
	</table>
</form>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="90px,200px,100px,200px"/>
	     <tr>
		
		<x:hidden name="competePositionId"/>
		<x:hidden name="chosenPosId"/>
				<x:hidden name="chosenOrganId"/>
				<x:hidden name="chosenCenterId"/>
				<x:hidden name="chosenDeptId"/>
				<x:hidden name="status"  value="1"/>
				<x:inputTD name="chosenOrganName" required="true" label="竞聘单位"  wrapper="select" />		
				<x:inputTD name="chosenCenterName" required="true" label="竞聘中心"  wrapper="select" />		
		</tr>
		<tr>
		<x:inputTD name="chosenDeptName" required="true" label="竞聘部门" wrapper="select" />		
		<x:inputTD name="chosenPosName" required="true" label="竞聘岗位" wrapper="select" />		
		</tr>
		<tr>
		<x:inputTD name="chosenNum" required="true" label="拟选拨人数"  mask="nn"/>
		<x:selectTD name="posLevel" required="true" label="岗位行政级别" />

		</tr>
		<tr>
		<x:textareaTD name="desption" required="false" label="说明"  rows="3"  colspan="3"  maxLength="512"/>
					
		
	     </tr>
	</table>
</form>

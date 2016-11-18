
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	 <table class='tableInput' id='queryTable' >
	     <x:layout proportion="180px,180px,180px,180px" />
		<x:hidden name="companyId"/>
		<x:hidden name="writeId"/>
		<tr>
		<x:inputTD name="resumeCompanyLast" required="true" label="所在企业全称" maxLength="32"/>		
		<x:inputTD name="fellowStaffNumLast" required="false" label="本人下属员工数量" maxLength="22" mask="nnnn"/>	
		</tr>	
		<tr>
		<x:inputTD name="firstPos" required="true" label="最初岗位" maxLength="10"/>	
		<x:inputTD name="firstWage" required="false" label="最初岗位工资" maxLength="10"/>		
		</tr>
		<tr>
		<x:inputTD name="lastPos" required="false" label="最终岗位" maxLength="10"/>
		<x:inputTD name="lastWage" required="false" label="最终岗位工资" maxLength="10"/>		
		</tr>
		<tr>
		<x:inputTD name="telephoneLast" required="false" label="人力资源部办公电话" maxLength="22"/>	
		<td  class="title"  colspan="2"></td>	
		</tr>
		<tr>
		<x:textareaTD name="leaveReasonLast" required="true" label="离职原因"  rows="3"  colspan="3" maxLength="200"/>	
		</tr>	
		<tr>
		
		<x:textareaTD name="mainDetailLast" required="false" label="主要工作经历及业绩" rows="10"  colspan="3" maxlength="450"/>		
		</tr>
	</table>
</form>

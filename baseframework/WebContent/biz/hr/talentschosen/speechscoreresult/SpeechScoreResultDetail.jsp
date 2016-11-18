
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="120px,140px,120px,140px"/>
	     <tr>
		<x:hidden name="resultId"/>
		<x:hidden name="resultAduitId"/>
		<x:hidden name="formId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="posId"/>
		<x:hidden name="ognId"/>
		<x:hidden name="centreId"/>
		<x:hidden name="chosenPosId"/>
		<x:hidden name="chosenOrganId"/>
		<x:hidden name="chosenCenterId"/>
	    <x:hidden name="candidateAduitId"/>
	   <x:hidden name="speechType"/>
	    
		
		<x:hidden name="yesorno"  value="0"/>
		<x:inputTD name="staffName" required="true" label="员工姓名" wrapper="select"   colspan="3" />	
				</tr>
		<tr>
		<x:inputTD name="ognName" required="true" label="所属机构"  readonly="true"/>		
		<x:inputTD name="centreName" required="true" label="所属中心"  readonly="true"/>	
				</tr>
				<tr>
				  <x:inputTD name="posName" required="true" label="所属岗位" readonly="true"/>		
				  <td class="title" colspan="2"></td>
				
				</tr>
		<tr>	
		<x:inputTD name="chosenPosName" required="true" label="选拨岗位"   wrapper="select"   colspan="3" />		
				</tr>
		<tr>	
		<x:inputTD name="chosenOrganName" required="true" label="选拨机构" readonly="true"/>	
		
		<x:inputTD name="chosenCenterName" required="true" label="选拨中心" readonly="true"/>		
				</tr>
		<tr>		
		<x:inputTD name="mainJuryAvgscore" required="true" label="主评委平均分" mask="nnnn.nn"/>	
		<x:inputTD name="commonJuryAvgscore" required="false" label="平级评委平均分" mask="nnnn.nn"/>		
		
		</tr>
		<tr>
		<x:inputTD name="lowerAvgscore" required="false" label="下級评委平均分" mask="nnnn.nn"/>		
		<x:inputTD name="sumAvgscore" required="true" label="合计平均分" mask="nnnn.nn"/>	
				</tr>
		 <tr>	
		<x:textareaTD name="title" required="true" label="标题" maxLength="512"  colspan="3"  rows="3"/>		
				</tr>
		<tr>
		<x:textareaTD name="remark" required="false" label="备注" maxLength="512"  colspan="3"  rows="4"/>		
	     </tr>
	</table>
</form>

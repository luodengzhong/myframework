<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/biz/hr/talentschosen/talentschosendemand/applyCompetitionPositionDetail.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
	
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
		<div class="subject">人才选拨需求表</div>
		  <form method="post" action="" id="submitForm">
		  	 <x:title title="基本信息" name="group"/>
		  
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	    
		
		<x:hidden name="competePositionId"/>
		<x:hidden name="talentsChosenDemandId"/>
		<x:hidden name="chosenOrganId"/>
		<x:hidden name="chosenCenterId"/>
		<x:hidden name="chosenDeptId"/>
		<x:hidden name="chosenPosId"/>
		<x:hidden name="status"/>
		<x:hidden name="chosenDeptName"/>
		<x:select name="juryTypeMap" list="juryType" cssStyle="display:none;"/>
      
		
		<tr>	
		<x:inputTD name="chosenOrganName" required="true" label="拟选拔中心"  disabled="true"/>		
		<x:inputTD name="chosenCenterName" required="true" label="拟选拔中心" disabled="true"/>		
		<x:inputTD name="chosenPosName" required="true" label="拟选拔职位"   disabled="true"/>	
		
		</tr>
		<tr>	
		<x:inputTD name="chosenNum" required="true" label="拟选拨人数" disabled="true"/>		
		<x:selectTD name="posLevel" required="true" label="岗位行政级别" disabled="true"/>	
		<td colspan=2 class='title'></td>	
	     </tr>
	   
	     </table>
	     <table  class='tableInput'   id="inputQueryTable">
	     	<x:layout/>
	     	<x:title title="岗位描述" name="group"/>
		
		<tr>
		<x:hidden name="posDeclareId"/>
		<x:textareaTD name="posDesReq" required="true" label="职位说明及工作内容"
						rows="13" colspan="5" disabled="true"/>
					
		</tr>
		<tr>
			<x:textareaTD name="takeJobReq" required="true" label="任职条件"
						rows="13" colspan="5" disabled="true"/>
		</tr>
		
		
	</table>
	
			</form>
		</div> 
		
  </body>
</html>

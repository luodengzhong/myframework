<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,attachment"/>
  	<script src='<c:url value="/biz/hr/talentschosen/talentschosendemand/TalentsChosenDemandBill.js"/>' type="text/javascript"></script>
	
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
		<div class="subject">人才选拨需求表</div>
		  <form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>
		
		<x:hidden name="talentsChosenDemandId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="chosenCenterId"/>
		<x:hidden name="chosenDeptId"/>
		<x:hidden name="chosenPosId"/>
		<x:hidden name="status"/>
		<x:hidden name="procUnitId"/>
		<x:hidden name="needDoTask"/>
		<x:select name="juryTypeMap" list="juryType" cssStyle="display:none;"/>

		<x:inputTD name="organName" required="false" label="机构名称" disabled="true"/>	
		<x:inputTD name="fillinDate" required="false" label="填表日期"   wrapper="date" disabled="true"  />		
		<x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>	
		<x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>		
		<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>		
		<x:inputTD name="personMemberName" required="false" label="申请人" disabled="true"/>	
		</tr>
		<tr>	
		<x:inputTD name="chosenPosName" required="true" label="拟选拔职位名称"   wrapper="select"/>	
		<x:inputTD name="chosenDeptName" required="true" label="拟选拔部门名称" maxLength="64"/>		
		<x:inputTD name="chosenCenterName" required="true" label="拟选拔中心名称" maxLength="64"/>		
		
		</tr>
		<tr>	
		<x:inputTD name="chosenNum" required="true" label="拟选拨人数" mask="nnn"/>		
		<x:selectTD name="posLevel" required="true" label="行政级别" maxLength="22"/>	
		<x:selectTD name="staffingPostsRank" required="true" label="职级" maxLength="22"/>	
	     </tr>
	     <tr  id="chosenedNumTr">
	     <x:inputTD name="chosenedNum" required="false" label="已选拨人数" mask="nnn"/>		
	     <td colspan=4 class='title'></td>	
	     
	     </tr>
	     </table>
	     <table  class='tableInput'   id="inputQueryTable">
	     	<x:layout/>
	     	<x:title title="岗位描述" name="group"/>
		
		<tr>
		<x:hidden name="posDeclareId"/>
		<x:textareaTD name="posDesReq" required="true" label="职位说明及工作内容"
						rows="10" colspan="5" maxLength="512"/>
					
		</tr>
		<tr>
			<x:textareaTD name="takeJobReq" required="true" label="任职条件"
						rows="10" colspan="5" maxLength="512"/>
		</tr>
		<tr>
			<x:textareaTD name="chosenWaySuggest" required="true" label="选拔方式建议"
						rows="2" colspan="5" maxLength="128"/>
		</tr>
	</table>
			</form>
		</div> 
			<x:fileList bizCode="talentsChosenDemand" bizId="talentsChosenDemandId" id="talentsChosenDemandFileList" />
			<div class="blank_div"></div>
			 <x:title title="评委组成列表"  name="group"/>
			<div id="maingrid"  style="margin: 2px;"></div>
  </body>
</html>

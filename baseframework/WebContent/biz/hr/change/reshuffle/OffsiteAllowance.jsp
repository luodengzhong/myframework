<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/change/reshuffle/OffsiteAllowance.js"/>'   type="text/javascript"></script>
  </head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">异地津贴调整申请表</div>
	        <form method="post" action="" id="submitForm">
	        		<x:hidden name="offsiteAllowanceId" />
			       
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        
			        <x:hidden name="archivesId" />
			        <x:hidden name="toOrganId" />
			        <x:hidden name="toCenterId" />
			        <x:hidden name="toDeptId" />
			        <x:hidden name="toPositionId" />
			        
			        <x:hidden name="fromOrganId" />
			        <x:hidden name="fromCenterId" />
			        <x:hidden name="fromDeptId" />
			        <x:hidden name="fromPositionId" />  
			        <x:hidden name="status" value="0"/>
			        <x:hidden name="flowFlag" value="2"/>
	  	<div class="bill_info">
		   <span style="float:right;">
			          单据号码：<strong><c:out value="${billCode}"/></strong>&nbsp;&nbsp;&nbsp;
			          填表日期：<strong><x:format name="fillinDate" type="date"/></strong>&nbsp;&nbsp;
			         经办人:<strong><c:out value="${personMemberName}"/></strong>
		   </span>
		 </div>
		<div  style="display: none;">
	<table>
	  		<tr>
				<x:inputTD name="organName" required="false" label="单位名称"  disabled="true" />
				<x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true" />
				<x:inputTD name="billCode" required="false" label="单据号码" disabled="true" />
			</tr>
			<tr>
				<x:inputTD name="deptName" required="false" label="部门名称" disabled="true" />
				<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true" />
				<x:inputTD name="personMemberName" required="false" label="制表人" disabled="true" />
			</tr>
	</table>	
			</div>			        
		 
		<x:title name="group" title="异动前信息" needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="staffName" required="false" label="姓名" wrapper="select" />	
		      <x:inputTD name="employedDate" required="false" label="入职时间" readonly="true"  mask="date" wrapper="date"/>		
		      <x:inputTD name="residence" required="false" label="家庭所在地" readonly="true" cssClass="textReadonly"/>		
		</tr>
		<tr>	
		      <x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>					
		      <x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly" />			
		      <x:inputTD name="fromDeptName" required="false" label="部门"  readonly="true" cssClass="textReadonly"/>
		</tr>
		<tr>
		      <x:inputTD name="fromPositionName" required="false" label="岗位"  wrapper="select" />	
		      <x:selectTD name="fromPosLevel" dictionary="posLevel"  required="false" label="行政级别" readonly="true"/>	
		      <td colspan="2" class="title"></td>
		      
		</tr>
		</table>
		<x:title name="group" title="异动后信息" needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="12%,21%,12%,21%,10%" />

		<tr>
		      <x:inputTD name="toOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>	
		      <x:inputTD name="toCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		      <x:inputTD name="toDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>	
		</tr>
		<tr>
		      <x:inputTD name="toPositionName" required="true" label="岗位" wrapper="select" />	
		      <x:selectTD name="toPosLevel"  dictionary="posLevel" required="false" label="行政级别" readonly="true" />
		      <td colspan="2" class="title"></td>
		</tr>
		</table>
		<x:title name="group" title="津贴信息" needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_03">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		<x:selectTD name="offsiteAllowanceNeeded"  required="true"   filter="a" label="申请异地津贴"/>
		 <x:inputTD name="allowanceStandard" required="true" label="津贴标准/月" mask="nnnnnn"/>
		 <td class="title" colspan="2"></td>
		</tr>
		<tr>
			  <x:inputTD name="beginDate" required="false" label="开始时间" wrapper="date" />
			  <x:inputTD name="endDate" required="false" label="结束时间" wrapper="date" />
			   <td class="title" colspan="2"></td>
		</tr>
		<tr>
		    <x:selectTD name="selfDriving"  required="false"  dictionary="yesOrNo" emptyOption="true"  label="是否自驾驶车"/>
		    <x:selectTD name="arrangeAccommodation"  required="false" emptyOption="true" dictionary="yesOrNo"  label="是否享受住宿补贴"/>
		    <td class="title" colspan="2"></td>
		</tr>		
		<tr>		
		      <x:textareaTD name="systemBasis" required="true" label="享受(/取消)津贴依据说明" colspan="5" rows="3" maxLength="256" />	
		</tr>
		</table>
			</form>
			<div class="blank_div"></div>
			<x:fileList bizCode="HROffsiteAllowance" bizId="offsiteAllowanceId" id="OffsiteAllowanceFileList"/>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
  </body>
	
	

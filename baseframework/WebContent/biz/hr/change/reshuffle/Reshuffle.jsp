<%@ page contentType="text/html; charset=utf-8" language="java"%> 
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/change/reshuffle/Reshuffle.js"/>'   type="text/javascript"></script>
  </head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">异动审批表</div>
	  	<form method="post" action="" id="submitForm">
			        <x:hidden name="auditId" />
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			            <x:hidden name="appFlowFlag"/> 
			        <x:hidden name="toOrganId" />
			        <x:hidden name="toCenterId" />
			        <x:hidden name="toDeptId" />
			        <x:hidden name="toPositionId" />
			        <x:hidden name="toPayOrganId" />
			        <x:hidden name="fromOrganId" />
			        <x:hidden name="fromCenterId" />
			        <x:hidden name="fromDeptId" />
			        <x:hidden name="fromPositionId" />
			        <x:hidden name="fromPayOrganId" />
			        <x:hidden name="archivesId" />
			        <x:hidden name="personId" />
			        <x:hidden name="fromPersonMemberId" />
			        <x:hidden name="status" value="0"/>
			        <x:hidden name="fromPosLevelTemp" />
			        <x:hidden name="toPosLevelTemp" />
			        <x:hidden name="staffKind" />
			        <x:hidden name="staffingLevel" />
			        <x:hidden name="flowFlag" value="2"/>
			        <x:hidden name="employedDate" />
			        <x:hidden name="personFullId" />
			        <x:hidden name="resultTask"/>
			        <x:hidden name="taskId"/>
			        <x:hidden name="isReshuffleEffectBill"/>
			        
			<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>				        
	 <div  style="display: none;">
	 <table>		        
		<tr>
		     <x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		     <x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true"/>					
		     <x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		      <x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		      <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		      <x:inputTD name="personMemberName" required="false" label="制表人" disabled="true"/>	
		</tr>
		</table>
     </div>		
		<x:title name="group" title="异动前信息"  needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="staffName" required="true" label="异动员工"  wrapper="select"/>	
		      <x:selectTD name="type" dictionary="reshuffleType" required="true" label="异动类型" />
		      <x:inputTD name="effectiveDate" required="false" label="生效日期"  wrapper="date"/>				
		</tr>
		<tr>	
		      <x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>					
		      <x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		      <x:inputTD name="fromDeptName" required="false" label="部门" readonly="true"  cssClass="textReadonly"/>
		</tr>
		<tr>
		      <x:inputTD name="fromPositionName" required="true" label="岗位"  wrapper="select"/>	
		      <x:selectTD name="fromPosLevel" dictionary="posLevel"  required="true" label="行政级别" />	
		      <td colspan="2" class="title">&nbsp;</td>
		</tr>
		<tr>
		 <x:selectTD name="fromStaffingPostsRank" required="false"  dictionary="staffingPostsRank" label="职级" />
		 <x:inputTD name="fromPostsRankSequence" required="false" label="职级序列"  maxLength="20" labelWidth="70"   cssClass="textReadonly" />
		 <x:hidden name="fromResponsibilitiyId"/>
		 <x:inputTD name="fromResponsibilitiyName" required="false" label="职能"  maxLength="20" labelWidth="60"  readonly="true"  cssClass="textReadonly"/>
		</tr>
		<tr>
			<x:hidden name="fromWageOrgId" />
			<x:inputTD name="fromWageOrgName" required="false" label="工资主体单位" readonly="true" cssClass="textReadonly"/>
			<x:inputTD name="fromPayOrganName" required="false" label="工资归属单位" readonly="true" cssClass="textReadonly"/>
			<td colspan="2" class="title">&nbsp;</td>
		</tr>
		<tr id="rankTR">
               <x:selectTD name="rank" dictionary="performanceLevel"   required="false" label="近期绩效考核等级" readonly="true" cssClass="textReadonly"/>		
               <td colspan="4" class="title"></td>
		</tr>
		</table>
		<x:title name="group" title="异动后信息"  needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="toOrganName" required="true" label="单位" readonly="true" cssClass="textReadonly"/>	
		      <x:inputTD name="toCenterName" required="true" label="中心" readonly="true" cssClass="textReadonly"/>			
		      <x:inputTD name="toDeptName" required="true" label="部门" readonly="true" cssClass="textReadonly"/>	
		</tr>
		<tr>
		      <x:inputTD name="toPositionName" required="true" label="岗位" wrapper="select" />	
		      <x:selectTD name="toPosLevel"  dictionary="posLevel" required="false" label="行政级别" />
		      <x:selectTD name="isAboveLevel" dictionary="yesorno" required="true" label="是否跨级" value="0"/>
		</tr>
		<tr>
		 <x:selectTD name="toStaffingPostsRank" required="true" label="职级"  dictionary="staffingPostsRank"/>
		 <x:inputTD name="toPostsRankSequence" required="true" label="职级序列"  maxLength="20" labelWidth="70"  wrapper="select" />
		 <x:hidden name="toResponsibilitiyId"/>
		 <x:inputTD name="toResponsibilitiyName" required="true" label="职能"  maxLength="20" labelWidth="60"  wrapper="select"/>
		</tr>
		<tr>
			<x:hidden name="toWageOrgId" />
			<x:inputTD name="toWageOrgName" required="true" label="工资主体单位" wrapper="select"/>
			<x:inputTD name="toPayOrganName" required="true" label="工资归属单位" wrapper="select"/>
		    <x:selectTD name="isChangeContract"  dictionary="yesorno" required="false"    label="是否换签劳动合同"/>
			
		</tr>
		<tr>
		      <x:selectTD name="isHandoverNeeded"  required="true"  dictionary="yesOrNo"  label="办理交接手续 "/>
		      <x:selectTD name="payAdjustmentNeeded"  required="false"  dictionary="yesOrNo"  label="调整薪酬 "/>
		      <x:selectTD name="offsiteAllowanceNeeded"  required="true"    label="申请异地津贴"/>
		</tr>
		<tr>		
		      <x:textareaTD name="reason" required="true" label="异动原因" colspan="5" rows="3" maxLength="256" />	
		</tr>
		</table>
			</form>
			<div id="assessResultText">
			<div class="blank_div"></div>
			<x:title name="group"  title="测评结果" needLine="false"/>
			<div  style="margin-left: 30px" align="left" id="personAnalyze"> 
			</div>
			<div id="maingrid" style="width: 99%;"></div>
			</div>
			<div class="blank_div"></div>
			<div  style="color: red;font-size:16px" align="left"> 
		   (注:请根据实际情况上传异动相关文件)
		  </div>
			<x:fileList bizCode="HRReshuffle" bizId="auditId" id="reshuffleFileList"/>

		</div> 
  </body>
	
	

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/change/reshuffle/Promotion.js"/>'   type="text/javascript"></script>
</head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">晋升申请表</div>
	  	<form method="post" action="" id="submitForm">
			        <x:hidden name="auditId" />
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        <x:hidden name="appFlowFlag"/>
			        <x:hidden name="toOrganId" />
			        <x:hidden name="toOrganName" />
			        <x:hidden name="toCenterId" />
			        <x:hidden name="toCenterName" />
			        <x:hidden name="toDeptId" />
			        <x:hidden name="toDeptName" />
			        <x:hidden name="toPositionId" />
			        <x:hidden name="toPayOrganId" />
			        <x:hidden name="fromOrganId" />
			        <x:hidden name="fromCenterId" />
			        <x:hidden name="fromDeptId" />
			        <x:hidden name="fromPositionId" />
			        <x:hidden name="fromPayOrganId" />
			        <x:hidden name="archivesId" />
			        <x:hidden name="status" value="0"/>
			        <x:hidden name="fromPosLevelTemp" />
			        <x:hidden name="toPosLevelTemp" />
			        <x:hidden name="staffKind" />
			        <x:hidden name="personId" />
			        <x:hidden name="fromPersonMemberId" />
			        <x:hidden name="staffingLevel" />
			        <x:hidden name="flowFlag" value="1"/>
			        <x:hidden name="underAssessmentId" />
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
					<x:inputTD name="organName" required="false" label="单位名称"  disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码" disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称" disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="制表人" disabled="true" />
				</tr>
				<x:selectTD name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>
		</table>	
			</div>			        
		<x:title name="group" title="晋升前信息"  needLine="false" />
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="11%,11%,11%,11%,11%,17%,11%,17%" />
		<tr>
		      <x:inputTD name="staffName" required="true" label="晋升员工"  wrapper="select" />	 
		      <x:selectTD name="education" required="false" label="学历" dictionary="education" readonly="true" />
		      <x:inputTD name="specialty" required="false" label="专业" readonly="true" cssClass="textReadonly"/>
		      <x:inputTD name="age" required="false" label="年龄" readonly="true" cssClass="textReadonly"/>
		</tr>
		<tr>
		      <x:inputTD name="employedDate" required="false" label="入职日期" mask="date"  readonly="true" cssClass="textReadonly"/> 
		      <x:selectTD name="rank" dictionary="performanceLevel"   required="false" label="近期绩效考核等级" readonly="true" cssClass="textReadonly"/>
		       <x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>					
		      <x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/> 
		</tr>
		<tr>	
		      <x:inputTD name="fromDeptName" required="false" label="部门" readonly="true"  cssClass="textReadonly"/>
		      <x:inputTD name="fromPositionName" required="false" label="岗位" readonly="true" cssClass="textReadonly"/>	
		      <x:selectTD name="fromPosLevel" dictionary="posLevel"  required="false" label="行政级别" readonly="true"/>
		      <td colspan="2" class="title">&nbsp;</td>
		</tr>
		<tr>
		 <x:selectTD name="fromStaffingPostsRank" required="false"  dictionary="staffingPostsRank" label="职级"  readonly="true"/>
	     <x:inputTD name="fromPostsRankSequence" required="false" label="职级序列"   readonly="true"   cssClass="textReadonly"/>
		 
		  <x:hidden name="fromResponsibilitiyId"/>
		   <x:hidden name="fromResponsibilitiyName"/>
		<td colspan="6" class="title">&nbsp;</td>
		</tr>
		</table>
		<x:title name="group" title="晋升后信息" needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="11%,11%,11%,19%,11%,17%,11%,11%" />
		<tr>
		      <x:selectTD name="type" dictionary="promotionType" required="true" label="晋升类型" />
		      <x:inputTD name="toPositionName"  required="true" label="岗位" wrapper="select"/>	
		      <x:selectTD name="toPosLevel"  dictionary="posLevel" required="false" label="行政级别" />
		      <x:selectTD name="isAboveLevel" dictionary="yesorno" required="true" label="是否跨级" value="0"/>
		</tr>
		<tr>
		 <x:selectTD name="toStaffingPostsRank" required="true" label="职级"  dictionary="staffingPostsRank"/>
		 <x:inputTD name="toPostsRankSequence" required="true" label="职级序列"  maxLength="20" labelWidth="70"  wrapper="select" />
		 <x:hidden name="toResponsibilitiyId"/>
		 <x:inputTD name="toResponsibilitiyName" required="true" label="职能"  maxLength="20" labelWidth="60"  wrapper="select"/>
		 <td colspan="2" class="title">&nbsp;</td>
		</tr>
		
		<tr>		
		      <x:textareaTD name="reason" required="true" label="晋升原因" colspan="7" rows="5"  maxLength="256" />	
		</tr>
		</table>
		<x:title name="group" title="就职演讲信息"  needLine="false" />
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="11%,11%,11%,19%,11%,17%,11%,1%" />
		<tr>
		      <x:selectTD name="isInaugural"  dictionary="yesorno"   required="true" label="是否参与就职演讲" />
		      <td colspan="6" class="title">&nbsp;</td>
		</tr>
		<tr id="judgesComposeTr">		
		      <x:textareaTD name="judgesCompose" required="true" label="评委组成" colspan="7" rows="6"  maxLength="512" />	
		</tr>
		</table>
			</form>
			<div class="blank_div"></div>
			<x:title name="group" title="测评名单" needLine="false"/>
			<div  style="color: red" align="left"> 
			      参与测评人员名单拟定原则：<br/>
			      1、原则上参与测评人员不少于10人（不含自评人员）；<br/>
			      2、原则上测评人员中上级、平级、下级均应有人参与测评 ；<br/>
			      3、若上级或下级只有一个人，请将其归入平级<br/>
			      上级是指拟任岗位中心第一负责人、直线上级、中心本部与拟任岗位业务强相关领导<br/>
			      平级是指中心内业务强相关部门的经理级、副经理级人员<br/>
			      下级是指拟任岗位直接下级所有人员    
			</div>
			<div id="maingrid"></div>
			<div class="blank_div"></div>
		  <div  style="color: red;font-size:16px" align="left"> 
		   (注:请根据实际情况上传晋升相关文件)
		  </div>
			<x:fileList bizCode="HRReshuffle" bizId="auditId" id="reshuffleFileList"/> 
		</div>	
  </body>
	
	

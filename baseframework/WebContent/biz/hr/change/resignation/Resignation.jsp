<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/biz/hr/change/resignation/Resignation.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">离职审批表</div>
		<form method="post" action="" id="submitForm">
				<x:hidden name="auditId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="taskKindId"/>
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="fullName" />
                <x:hidden name="procUnitId"/>
				<x:hidden name="orgnizationId" />
				<x:hidden name="centerId" />
				<x:hidden name="departmentId" />
				<x:hidden name="posId" />
				<x:hidden name="archivesId" />
				<x:hidden name="status" value="0" />
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
		</table>	
			</div>			        
			
			<x:title name="group" title="基本信息" needLine="false"/>
			<table  class='tableInput' style="width: 99%;"  id="table_01">
             <x:layout proportion="73px,160px,100px,160px,100px,160px" />
				<tr>
					<x:inputTD name="staffName" required="false" label="离职员工" wrapper="select" readonly="true"/>
					<x:inputTD name="employedDate" required="false" label="入职日期" wrapper="date" readonly="true" />
					<x:inputTD name="orgnizationName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>

				</tr>
				<tr>
					<x:inputTD name="centerName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="departmentName" required="false" label="部门" maxLength="32" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="posName" required="false" label="岗位" readonly="true" cssClass="textReadonly"/>
				</tr>
				<tr>
				    <x:selectTD name="posLevel" required="false" label="行政级别" readonly="true"/> 
				    <x:selectTD name="sex" required="false" label="性别" readonly="true" />
					<x:selectTD name="education" required="false" label="学历" dictionary="education" readonly="true" />
				</tr>
				<tr>
				  <x:selectTD name="staffingPostsRank" required="false" label="职级" readonly="true"/>
				   <x:inputTD name="postsRankSequence" required="false" label="职级序列"   readonly="true"   cssClass="textReadonly"/>
				   
				  <x:selectTD name="operationLevel" required="false" label="业务级别" readonly="true"/> 
				</tr>
              </table>	
              <div id="personalResume">
              <c:if test="${resumeList!= null && fn:length(resumeList) > 0}">
              <x:title name="group" title="个人简历" needLine="false"/>	
              <table  class='tableInput' style="width: 99%;"  id="table_01">	
              <x:layout proportion="100px,100px,120px,100px" />
                <tr>
                  <td class="title">起始时间</td>
                  <td class="title"> 终止时间</td>
                  <td class="title">所在单位</td>
                  <td class="title">最终岗位</td>
                </tr>
                <c:forEach var="resume" items="${resumeList}">
                   <tr>
                       <td  class="disable">${resume.resumeBeginDate}</td>
                       <td  class="disable">${resume.resumeEndDate}</td>
                       <td  class="disable">${resume.resumeCompany}</td>
                       <td  class="disable">${resume.lastPos}</td>   
                   </tr>
                </c:forEach>
			</table>
			</c:if>
              </div>
			<div id="companyResume">
			  <c:if test="${reshuffleList!= null && fn:length(reshuffleList) > 0}">
              <x:title name="group" title="公司履历" needLine="false"/>	
             <table  class='tableInput' style="width: 99%;"  id="table_01" >	
              <x:layout proportion="73px,100px,100px,100px,200px,200px" />
                   <tr >
                      <td class="title">变动时间</td>
                      <td class="title">变化前行政级别</td>
                      <td class="title">变化后行政级别</td>
                      <td class="title">变动类型</td>
                      <td class="title">变动前描述</td>
                      <td class="title">变动后描述</td>
                   </tr>
                <c:forEach var="reshuffle" items="${reshuffleList}">
                   <tr>
                       <td class="disable">${reshuffle.effectiveDate}</td>
                       <td class="disable">${reshuffle.fromPosLevel}</td>
                       <td class="disable">${reshuffle.toPosLevel}</td>
                       <td class="disable">${reshuffle.type}</td>   
                       <td class="disable">${reshuffle.fromPosDesc}</td> 
                       <td class="disable">${reshuffle.posDesc}</td>                                                                   
                   </tr>
                </c:forEach>
			</table>
			</c:if>
			</div>			              
              <x:title name="group" title="离职分析" needLine="false"/>	
              <div  style="color: red;font-size: 15px;" align="left"> 
                  请员工或单位负责人注明该员工OA系统帐号注销时间，若未注明注销时间，将在该员工辞职申请审批完成后立即注销。
              </div>
             <div  style="color: red;font-size: 15px;" align="left"> 
                 请离职员工所在部门负责人对员工可能的罚款情况进行预估，在本流程中明确预扣金额并与员工提前沟通。
              </div>    
             <table  class='tableInput' style="width: 99%;"  id="table_01">	
              <x:layout proportion="100px,160px,100px,160px,100px,160px" />
				<tr id="typeSelectTr">
				<x:selectTD name="type" required="true" label="离职类型" dictionary="resignationType"/>
			 	<td colspan="2" class="title"><a href="javascript:queryResignationInterview(this.form);" class="ALink"> 查看部门离职面谈表</a> </td>
				 <td colspan="2" class="title"></td>
				</tr>
				<tr>
					<x:inputTD name="attendanceDeadlineDate" required="true" label="考勤预计截止日期" wrapper="date" />
					<x:inputTD name="accountDeadlineDate" required="true" label="系统账号注销时间" wrapper="date"  />
					 <td colspan="2" class="title"></td>
				</tr>
				<tr>
					<x:textareaTD name="resignationReason" rows="3" colspan="5" maxLength="256" required="true" label="离职原因" />
				</tr>
			</table>
		</form>
		<div class="blank_div"></div>
		<x:fileList bizCode="HRResignation" bizId="auditId" id="resignationFileList" />
	</div>
</body>
</html>

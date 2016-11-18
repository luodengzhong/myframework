<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/TaskReportDetail.js"/>'type="text/javascript"></script>
<style>
html {overflow: hidden;}
</style>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height:30px;">计划任务进度汇报</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 
				汇报单号：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
				汇报日期：<strong><x:format name="fillinDate" type="date"/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				汇报人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99%;">
				<x:layout />
				<tr>
					<x:hidden name="taskReportId" />
					<%-- <c:if test="${!taskFlag}"> --%>
					<x:hidden name="planTaskId" />
					<%-- </c:if> --%>
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="organName" />
					<x:hidden name="fillinDate" type="date" />
					<x:hidden name="billCode" />
					<x:hidden name="deptName" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberName" />
					<x:hidden name="documentList" />
					<x:hidden name="fullName" />
				    <x:inputTD name="taskName" required="false" label="任务名称"  readonly="true" cssClass="textReadonly" colspan="3"/>
					<x:inputTD name="taskKindName" required="false" label="任务类别"  readonly="true" cssClass="textReadonly" />
				</tr>
				<tr>
				
					<td class="title"><span class="labelSpan">计划路径&nbsp;:</span></td>
					<td  colspan="5" >
					<c:if test="${not empty fullName}">
					<a href='##'  id="openPlanDetail"  onclick='openPlanDetail()'>${fullName}</a>&nbsp;&nbsp;
					</c:if>
					<c:if test="${empty fullName}">
					<a href='##'  id="openPlanDetail"  onclick='openPlanDetail()'>${taskName}:任务汇报。</a>&nbsp;&nbsp;
					</c:if>
											
					</td>			
				</tr>
				<tr>
					<x:selectTD name="taskLevel" required="false" label="任务级别"  list="taskLevelKind" readonly="true"/>
			   		<x:radioTD dictionary="yesorno" name="isFinish" required="true" label="是否完成"/>
			   		<x:inputTD name="percentComplete" required="true" label="完成进度(%)" spinner="true" dataOptions="min:1,max:100" mask="999"/>
			   	</tr>
			   	<tr>
			   		<x:inputTD name="startDate" required="false" label="计划开始日期" mask="date" readonly="true" cssClass="textReadonly" />
					<x:inputTD name="finishDate" required="false" label="计划完成日期" mask="date" readonly="true" cssClass="textReadonly" />
					<td colspan="2" class="title">&nbsp;</td>
			   	</tr>
			   	<tr>
			   		<x:inputTD name="actualStart" required="true" label="实际开始日期" wrapper="date"/>
					<x:inputTD name="actualFinish" required="true" label="实际完成日期" wrapper="date"/>
					<x:inputTD name="estimatedFinish" required="true" label="预计完成时间" mask="date"/>
			   	</tr> 
			   	<tr>
			   		<x:textareaTD name="reportContent" maxLength="500"  required="true" label="完成情况说明" colspan="5" rows="3"/>
			   	</tr>
			   	<tr id="analyzeCauseTR" style="display: none">
					<x:textareaTD name="analyzeCause" required="false" label="未完成工作对后续工作影响分析" maxLength="500" colspan="5" rows="3"/>
				</tr>
			</table>
		</form>
		
		<div style="overflow: auto;width:100%; height:200px;">
		<div class="blank_div"></div>
		<x:fileList bizCode="taskRepor" bizId="taskReportId"	id="taskReporAttachment" />
		<div class="blank_div"></div>
			<c:forEach items="${documentList}" var="planDocument" >	
			<c:if test="${not empty planDocument && not empty planDocument['planDocumentId']  }">
			成果文档:${planDocument['name'] }
			<div class="blank_div"></div>	
			<x:fileList bizCode="${planDocument['planDocumentId'] }" bizId="planTaskId"	id="${planDocument['planDocumentId'] }" />
			<div class="blank_div"></div>	
			</c:if>
			</c:forEach>
	</div>
	</div>
</body>
</html>

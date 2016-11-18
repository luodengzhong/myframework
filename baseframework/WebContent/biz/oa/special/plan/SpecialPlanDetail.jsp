
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/special/plan/SpecialPlan.js"/>' type="text/javascript"></script>

<link href='<c:url value="/themes/default/fullcalendar/fullcalendar.css"/>' rel='stylesheet' type='text/css'/>
<link href='<c:url value="/themes/default/fullcalendar/fullcalendar.print.css"/>' rel='stylesheet' type='text/css' />
<link href='<c:url value="/themes/default/fullcalendar/theme.css"/>' rel='stylesheet' type='text/css'/>
<link href='<c:url value="/system/personOwn/workcalendar/style.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/ui/jquery.ui.core.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.widget.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.mouse.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.draggable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.resizable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/fullcalendar.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/special/plan/workcalendar.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/special/plan/year.calendar.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<b style="font-size: 24px;">&lt;</b> <span id="editSubject"
				style="font-size: 20px; cursor: pointer;"> <c:choose>
					<c:when
						test="${null==requestScope.title||requestScope.title==''}">
					专项计划报审表
				</c:when>
					<c:otherwise>
						<c:out value="${title}" />
					</c:otherwise>
				</c:choose>
			</span> <b style="font-size: 24px;">&gt;</b>
		</div>
		<form method="post" action="" id="submitForm">
			<x:hidden name="organId" />
			<x:hidden name="organName" />
			<x:hidden name="fillinDate" type="date" />
			<x:hidden name="billCode" />
			<x:hidden name="deptId" />
			<x:hidden name="deptName" />
			<x:hidden name="positionId" />
			<x:hidden name="positionName" />
			<x:hidden name="personMemberName" />
			<x:hidden name="personMemberId" />
			<x:hidden name="fullId" />
			
			<x:hidden name="title" />
			<x:hidden name="technologyKindName" />
			<x:hidden name="procUnitId" />
			<x:hidden name="processDefinitionKey" />
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="10%,21%,10%,21%" />

				<tr>
					<x:inputTD name="organName" disabled="true" required="true"
						label="公司名称" maxLength="64" />
					<x:inputTD name="billCode" disabled="true" required="true"
						label="单据号码" maxLength="32" />
					<x:inputTD name="fillinDate" disabled="true" required="true"
						label="填表日期" maxLength="32" wrapper="dateTime" />
				</tr>
				<tr>
					<x:inputTD name="deptName" disabled="true" required="true"
						label="发起部门名称" maxLength="64" />

					<x:inputTD name="personMemberName" disabled="true" required="true"
						label="发起人名称" maxLength="65" />
					<x:hidden name="ownerId" />
					<x:inputTD name="ownerName" required="true" label="责任人" maxLength="128" wrapper="select"/>	
				</tr>
				<tr>
					<x:hidden name="dutyDeptId" />
					<x:inputTD name="dutyDeptName" required="true" label="责任人部门" maxLength="128" wrapper="select"/>		
					<x:hidden name="beManageredId" />
					<x:inputTD name="beManageredName" required="true" label="组织" maxLength="128" wrapper="select"/>
				
					<x:hidden name="specialPlanId" />
					<x:textareaTD name="planDesc" required="true"
						label="计划描述" maxLength="1024" rows="2"/>
				</tr>
				<tr class="calReceiverClass">
					<td class='title'><span class="labelSpan">计划执行功能<font color='red'>*</font>&nbsp;:</span></td>
					<td class="title" colspan="4"><div id="functionShowDiv" style="min-height:25px;line-height:25px;">
						
					</div></td>
					<td class="title">
						
					</td>
				</tr>
				<tr class="calReceiverClass">
					<td class='title'><span class="labelSpan">执行人&nbsp;:</span></td>
					<td class="title" colspan="4">
						<div id="receiverShowDiv" style="min-height:25px;line-height:25px;">
							请指定计划执行人，若不指定执行人，将根据你指定的组织 通过基础管理权限匹配到执行人
						</div>
					</td>
					<td class="title">
						<a href='##' class="GridStyle" id="receiverChooseLink" onclick='showChooseOrgDialog("receiver")'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle" id="receiverClearLink" onclick='clearChooseArray("receiver")'>清空</a>
					</td>
				</tr>
				
				
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<div class="calReceiverClass">
			选择视图： 月视图<input id="monthViewRadio" name="planview" value="month" type="radio" checked>  
						年视图<input id="yearViewRadio" name="planview" value="year" type="radio">
			</div>
			<div id='calendarMain22'>
				<div id='calendar'></div>
				<table style="width:90%; height:80%;" id='yearCalendarMain'>
					<tr>
					<td>
					<div style="float:left;">
						<span id="preYear"><image style="cursor:pointer" src='<c:url value="/biz/oa/special/plan/image/preYear.jpg"/>'/></span>
						<span id="nextYear"><image style="cursor:pointer;position:relative;right:5px;" src='<c:url value="/biz/oa/special/plan/image/nextYear.jpg"/>'/></span>
						<%--
						<input type="button" value="输出ycData长度" onclick="printYcData();"/>--%>
					</div>
					<div id="curYearDiv" ><b><div id="curYear"></div></b></div>
					<div id="yearMonthPart" style="float:right;" class="calReceiverClass">
						开始时间:&nbsp;
						上旬<input name="monthPart" value="top" type="radio" checked> 
						中旬<input name="monthPart" value="middle" type="radio"> 
						下旬<input name="monthPart" value="down" type="radio"> </div>
					</td>
					</tr>
					<tr><td>
					<div id="yearTable"></div>
					</td></tr>
				</table>
			</div>
			
			<div id="calHiddenDiv"><x:hidden name="calDatas" /><x:hidden name="calYearDatas" /></div>

			<x:hidden name="functionId" />
			<x:hidden name="functionName" />
			<x:hidden name="authorityCode" />
			<x:hidden name="authorityName" />
			
		</form>
		<x:hidden name="status" />
	</div>
</body>
</html>


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
<script src='<c:url value="/biz/oa/askReport/meetingSummary/ReviewMeetingSummary.js"/>' type="text/javascript"></script>
<style>
	.input_text{
	background-color: #efefef;
	border-color:#000000; 
	border-style:solid; 
	border-top-width:0px; 
	border-right-width:0px; 
	border-bottom-width:1px; 
	border-left-width:0px;
	background:#ffffff;
	width:30px;
	height:20px;
	font-size:12px;
}
</style>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					评审会议纪要（装饰类）
				</c:when>
					<c:otherwise>
						<c:out value="${defaultTitle}" />
					</c:otherwise>
				</c:choose>
			</span>
		</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 单据号码：<strong><c:out
						value="${billCode}" /></strong> &nbsp;&nbsp; 制单日期：<strong><x:format
						name="fillinDate" type="date" /></strong>
			</span> <span style="float: right; margin-right: 10px;"> 发送人：<strong><c:out
						value="${organName}" />.<c:out value="${deptName}" />.<c:out
						value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="17%,15%,17%,17%,17%,17%" />
				<tr>
					<x:hidden name="reviewMeetingSummaryId" />
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
					<x:hidden name="subject" />
					<x:hidden name="procUnitId" />
					<x:hidden name="processDefinitionKey" />
					
					<x:hidden name="meetingCompereId" />
					
					<td class="title">
						<span class="labelSpan" style="line-height:25px;">
							文件编号<font color="#FF0000">*</font>&nbsp;:&nbsp;&nbsp;
							<a href='##' class="GridStyle"  style="display:none" id="getDispatchNoBtn"  onclick='getDispatchNo()'>获取</a>
						</span>
						<x:hidden name="dispatchKindId" />
					    <x:hidden name="dispatchKindName" />
					</td>
					<td class="disable">
						<x:input name="dispatchNo" required="false" label="文件编号" readonly="true" cssClass="textReadonly"/>
					</td>	
					<x:inputTD name="reviewMeetingSummaryCode" required="false" label="编号" maxLength="64"/>
					<x:inputTD name="versionCode" required="true" label="版本编号" maxLength="64"/>		
				</tr>
				<tr>
					<x:inputTD name="meetingCompereName" required="true" label="主持人" maxLength="64" wrapper="select"/>		
					<x:inputTD name="meetingTime" required="true" label="会议时间" maxLength="7" wrapper="dateTime" />		
					<x:inputTD name="meetingLocation" required="true" label="会议地点" maxLength="256"/>		
				</tr>
				<tr>
					<x:inputTD name="reviewSponsorName" required="true" label="评审提出单位" maxLength="128"/>		
					<x:inputTD name="meetingTitle" required="true" label="评审会议议题" maxLength="256"  colspan="3"/>		
				</tr>
				<tr>
					<x:inputTD name="reportFileName" required="true" label="报审文件名称" maxLength="256"/>		
					<x:inputTD name="meetingDataList" required="true" label="会议资料清单" maxLength="256"  colspan="3"/>		
				</tr>
				<tr>
					<td class="title"><span class="labelSpan reviewTimes" >评审次数<font color="#FF0000">*</font>:</span> </td>
					<td class="edit" colspan="5" style="height:32px">
						<input type="hidden" id="review_times" value="${reviewTimes }" />
						<input type="radio" name="reviewTimes" value="1" id="reviewTimes_1" />
						<label for="reviewTimes_1" style="margin-right:10px">初次评审</label>
						<input type="radio"  name="reviewTimes" value="2" id="reviewTimes_2" />
						<label for="reviewTimes_2" style="margin-right:10px">第二次评审</label>
						<input type="radio"   name="reviewTimes" value="3" id="reviewTimes_3" />
						<label for="reviewTimes_3">第</label><x:input  name="times" cssClass=' input_text' mask="nn"/><label for="reviewTimes_3" style="margin-right:10px">次评审</label>
						<input type="radio"  name="reviewTimes" value="0" id="reviewTimes_0" />
						<label for="reviewTimes_0">复评</label>
					</td>		
				</tr>
				<tr>
					<x:textareaTD name="meetingPeople" required="true" label="参会人员" maxLength="1024"  colspan="5"/>
				</tr>
				<tr>
					<x:textareaTD name="meetingAgendaDecision" required="true" label="会议主要议程及决议" maxLength="1024" colspan="5"/>		
				</tr>
				<tr>
					<td class="title"><span class="labelSpan meetingConclusion" >评审结论<font color="#FF0000">*</font>:</span> </td>
					<td class="edit" colspan="5" style="height:32px">
						<input type="hidden" id="meeting_conclusion" value="${meetingConclusion }"/>
						<input type="radio"  name="meetingConclusion" value="1" id="meetingConclusion_1" />
						<label for="meetingConclusion_1">同意该方案，通过评审；</label><br/>
						<input type="radio"  name="meetingConclusion" value="2" id="meetingConclusion_2" />
						<label for="meetingConclusion_2">原则上同意该方案，局部修订后通过评审；</label><br/>
						<input type="radio" name="meetingConclusion"  value="3" id="meetingConclusion_3" />
						<label for="meetingConclusion_3">不同意该方案，修改后再次评审。</label>
					</td>
				</tr>
				<tr>
					<x:textareaTD name="leaveEvent" required="false" label="会议遗留事项" maxLength="1024" colspan="5"/>		
				</tr>
				<tr>
					<x:textareaTD name="workableEvent" required="false" label="会后落实事项" maxLength="1024" colspan="5"/>		
				</tr>
				<tr>
					<x:textareaTD name="workPlan" required="false" label="后续工作安排" maxLength="1024" colspan="5"/>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="reviewMeetingSummary"
				bizId="reviewMeetingSummaryId" id="reviewMeetingSummaryIdAttachment" />
			<div class="blank_div"></div>
		</form>
		<div style="margin-bottom:10px">
		备注：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;1、本表为产品类成果评审申请表，由评审提出单位填报；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;2、本表适用于售楼部、示范区、公共区域、酒店类、商业类空间的室内装饰概念方案、深化方案、软装方案等产品类成果。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		</div>
	</div>
</body>
</html>

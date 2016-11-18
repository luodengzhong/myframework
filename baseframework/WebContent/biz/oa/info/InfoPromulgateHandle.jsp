<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/biz/oa/info/InfoManagerUtil.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoPromulgateHandle.js"/>' type="text/javascript"></script>
</head>
<body>
	<x:hidden name="infoPromulgateId" />
	<x:hidden name="isAllowMultiFeedback" />
	<x:hidden name="infoFeedbackId" />
	<x:hidden name="feedBackStatus" />
	<x:hidden name="hasFeedBack" />
	<x:hidden name="isInfoManager" />
	<x:hidden name="feedbackWidth" />
	<c:choose>
		<c:when test="${requestScope.hasFeedBack=='1'}">
			<div id="InfoPromulgateHandleLayout">
				<div position="center" title="消息内容" id="infoPromulgateHandleCenter" style="overflow-x: hidden; overflow-y: auto;">
					<c:import url="/biz/oa/info/previewInfo.jsp"/>
				</div>
				<div position="right" title="反馈栏目" id="infoPromulgateHandleFeedBackContent" style="overflow-x: hidden; overflow-y: auto;padding-left:3px;padding-top:3px;">
					<div id="feedBackContentShowDiv">
						这个信息要求发送反馈，请填写下面的反馈信息
						<div style="margin:5px"><x:textarea name="feedBackContent" rows="5" maxlength="200"/></div>
						<c:if test="${requestScope.hasFeedBackAttachment=='1'}">
							<x:fileList bizCode="feedBackPersonAttachment" bizId="feedBackAttachmentBizId" id="feedBackPersonAttachment"/>
						</c:if>
						<div class="blank_div"></div>
						<c:if test="${infoFeedbackItems!= null && fn:length(infoFeedbackItems) > 0}">
						请根据实际情况填写:
						<c:import url="/biz/oa/setup/InfoFeedbackItems.jsp"/>
						</c:if>
					</div>
				</div>
			</div>
		</c:when>
		<c:otherwise>
			<c:import url="/biz/oa/info/previewInfo.jsp"/>
		</c:otherwise>
	</c:choose>
</body>
</html>

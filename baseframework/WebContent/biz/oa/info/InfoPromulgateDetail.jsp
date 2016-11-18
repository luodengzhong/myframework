<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.color.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoManagerUtil.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoPromulgateDetail.js?a=1"/>'	type="text/javascript"></script>
<style>.ui-attachment-list{width:99.9%;}</style>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height:30px;">&lt;<span id="editSubject" style="font-size: 20px;cursor: pointer;">请在此处录入标题</span>&gt;</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 
				单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
				制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				制单人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout />
				<tr>
					<x:hidden name="infoPromulgateId" />
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
					<x:hidden name="status" />
					<x:hidden name="isInfoManager" />
					<x:hidden name="infoKindId" />
					<x:inputTD name="kindName" required="true" label="信息类别"	wrapper="tree" />
					<x:hidden name="isNeedDispatchNo" />
					<x:hidden name="isCanCreateTask" />
					<x:hidden name="isNeedSendMessage" />
					<x:hidden name="isSendClientMessage" />
					<x:hidden name="isExceedTimeLimit" />
					<x:selectTD name="priority" required="true" label="优先级"  list="infoPriority" emptyOption="false"/>
					<x:inputTD name="ownOrganName" required="true" label="发布机构" />
				</tr>
				<tr>
					<x:inputTD name="effectiveTime" required="true" label="生效时间"  wrapper="date"/>
					<x:inputTD name="invalidTime" required="false" label="截止时间" wrapper="date"/>
					<x:selectTD name="isFinalize" required="false" label="是否定稿" dictionary="yesorno" />
					<x:hidden name="kindPriorityCoefficient" />
					<x:hidden name="senderPriorityCoefficient" />
				</tr>
				<tr>
					<x:inputTD name="keywords" required="false" label="主题词"	maxLength="60" colspan="5" />
				</tr>
				<tr>
					<x:hidden name="receiverName" />
					<td class='title'><span class="labelSpan">接收人<font color='red'>*</font>&nbsp;:</span></td>
					<td class="title" colspan="3"><div id="receiverShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="addLink" id="receiverChooseLink" onclick='showChooseOrgDialog("receiver")'>选择</a>&nbsp;&nbsp;
						<a href='##' class="clearLink" id="receiverClearLink" onclick='clearChooseArray("receiver")'>清空</a>
					</td>
					<td class="title">
						<x:checkbox name="isCreateReadTask" label="接收人生成待办" />
						<x:checkbox name="isHideReceiver" label="隐藏接收人" />
					</td>
				</tr>
				<tr id="handlerShowTr">
					<td class='title'><span class="labelSpan">事务处理人&nbsp;:</span></td>
					<td class="title" colspan="3"><div id="handlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
					
						<a href='##' class="addLink"  id="handlerChooseLink"  onclick='showChooseOrgDialog("handler")'>选择</a>&nbsp;&nbsp;
						<a href='##' class="clearLink"  id="handlerClearLink"  onclick='clearChooseArray("handler")'>清空</a>
					</td>
					<td class="title">
						&nbsp;
					</td>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">信息管理人&nbsp;:</span></td>
					<td class="title" colspan="3">
						<div id="feedbackViewerShowDiv" style="min-height:25px;line-height:25px;"></div>
				    </td>
					<td class="title">
						<!-- <span style="float: right;">消息发送:</span> -->
						<a href='##' class="addLink" id="chooseMnagerLink" onclick='showChooseOrgDialog("feedbackViewer")'>选择</a>&nbsp;&nbsp;
						<a href='##' class="clearLink" id="clearMnagerLink" onclick='clearChooseArray("feedbackViewer")'>清空</a>
					</td>
					<td class="title">&nbsp;
						<!--<x:select name="remindSendKindList" required="false" cssStyle="display:none;" list="remindSendKindList" />
						<x:input name="remindSendKind" required="false" label="发送方式"/> -->
					</td>
				</tr>
				<tr>
					<td class="title">
						<span class="labelSpan" style="line-height:25px;">
							文件编号&nbsp;:&nbsp;&nbsp;
							<a href='##' class="GridStyle"  id="getDispatchNoBtn"  onclick='getDispatchNo()'>获取</a>
						</span>
						<x:hidden name="dispatchKindId" />
					    <x:hidden name="dispatchKindName" />
					</td>
					<td class="disable">
						<x:input name="dispatchNo" required="false" label="文件编号" readonly="true" cssClass="textReadonly"/>
					</td>
					<td class="title">
						<span class="labelSpan">反馈信息设置&nbsp;:</span>
					</td>
					<td class="title" colspan="3" style="min-height:25px;">
						<x:checkbox name="hasFeedBack" label="需要反馈" />&nbsp;
						<span id="isAllowMultiFeedbackSpan" style="display:none">
							<x:checkbox name="isAllowMultiFeedback" label="允许多次反馈" />&nbsp;
						</span>
						<span id="chooseHasFeedBackAttachmentSpan" style="display:none">
							<x:checkbox name="hasFeedBackAttachment" label="允许反馈时上传附件" />&nbsp;
						</span>
					</td>
				</tr>
				<tr style="display:none" id="chooseFeedbackerTd">
					<td class='title'><span class="labelSpan">反馈人&nbsp;:</span></td>
					<td class="title" colspan="3"><div id="feedbackerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="addLink"  id="feedbackerChooseLink"  onclick='showChooseOrgDialog("feedbacker")'>选择</a>
						<a href='##' class="clearLink"  id="feedbackerClearLink"  onclick='clearChooseArray("feedbacker")'>清空</a>
						<a href='##' class="addLink" onclick='setFeedbackItem(true)' id="setFeedbackItemLink">设置反馈项</a>
					</td>
					<td class="title">反馈区域宽度：<x:input name="feedbackWidth"  cssStyle="width:80px;" mask="nnn" />px</td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<table style="width: 99.9%;"  border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td style="width:50%;">
						<x:fileList bizCode="OAInfoTextBody" bizId="infoPromulgateId" id="infoTextBody" isClass="true"  proportion="28%,72%"/>
					</td>
					<td style="width:50%;border: 1px solid #D6D6D6;border-left-width:0;background-color: #f5f5f5;padding-left: 20px">
						<x:checkbox name="isBodyReadonly" label="正文只读" />&nbsp;
						<x:checkbox name="isBodyDown" label="允许下载正文" />&nbsp;
					</td>
				</tr>
			</table>
			<table class='tableInput' style="width: 99.9%;border-top: 0px">
				<tr>
					<td style="width:100%">
						<x:fileList bizCode="infoPromulgate" bizId="infoPromulgateId"	id="infoAttachment" />
						<div class="blank_div"></div>
					</td>
				</tr>
				<tr>
					<td style="padding: 0px; border: 0px;width:100%">
						<x:textarea name="infoContent" required="false" label="信息内容" rows="10" cssStyle="height:250px;" />
					</td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
 <x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.color.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/askReport/AskReportDetail.js?a=4"/>'   type="text/javascript"></script>
<style>.ui-attachment-list{width:99.9%;}</style>
  </head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height:30px;">
			<b style="font-size: 24px;">&lt;</b>
			<span id="editSubject" style="font-size: 20px;cursor: pointer;">
				<c:choose>
				<c:when test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					请在此处录入标题
				</c:when>
				<c:otherwise>
					<c:out value="${defaultTitle}" />
				</c:otherwise>
				</c:choose>
			</span>
			<b style="font-size: 24px;">&gt;</b>
		</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 
				单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
				制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发送人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout />
				<tr>
					<x:hidden name="askReportId" />
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
					<x:hidden name="askReportKindId" />
					<x:hidden name="extendedFieldCode" />
					<x:hidden name="askKindCode" />
					<x:hidden name="isNeedDispatchNo" />
					<x:hidden name="isNeedAttachment" />
					<x:hidden name="isBuildTask" />
					<x:hidden name="isFreeFlow" />
					<x:hidden name="isReadonlyContent" />
					<x:inputTD name="askKindName" required="true" label="文件类别" wrapper="tree" />
					<x:inputTD name="dispatchNo" required="true" label="文件编号" readonly="true" />
					<x:hidden name="personiInChargeId" />
					<x:inputTD name="personInChargeName" required="true" label="责任人"	wrapper="select" />
				</tr>
				<tr>
					<x:inputTD name="reportToName" required="false" label="主    送"	 maxlength="100"/>
					<x:selectTD name="reportLevel" required="false" label="级    别" list="taskLevelKind"/>
					<x:selectTD name="securityClassification" required="false" label="密   级"/>
				</tr>
				<tr>
					<td class='title'>
						<span class="labelSpan">
							抄&nbsp;送&nbsp;:
							<a href='##' class="addLink"  id="copyForChooseLink"  onclick='showChooseOrgDialog("copyFor")'>选择</a>&nbsp;&nbsp;
							<a href='##' class="clearLink"  id="copyForClearLink"  onclick='clearChooseArray("copyFor")'>清空</a>
						</span>
					</td>
					<td class="title" colspan="5"><div id="copyForShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<!--<td class="title"><x:checkbox name="isSeal" label="需要加盖公章"/>&nbsp;</td>-->
				</tr>
				<tr  style="display:none" id="chooseHandlerTd">
					<td class='title'>
						<span class="labelSpan">
							处理人&nbsp;:
							<a href='##' class="addLink"  id="handlerChooseLink"  onclick='showChooseHandlerDialog()'>选择</a>&nbsp;&nbsp;
							<a href='##' class="clearLink"  id="handlerClearLink"  onclick='clearChooseArray("handler")'>清空</a>
						</span>
						<div style="text-align:right;padding-right: 5px;">
							<a href='##' class="GridStyle"  id="chooseProcessTemplateLink"  onclick='chooseProcessTemplate()'>选择模板</a>&nbsp;&nbsp;
							<a href='##' class="GridStyle"  id="saveProcessTemplateLink" onclick='saveProcessTemplate()'>保存为模板</a>&nbsp;&nbsp;
						</div>
					</td>
					<td class="title" colspan="5"><div id="handlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<table style="width: 99.9%;"  border="0" cellpadding="0" cellspacing="0" id="AskReportTextBodyTable">
				<tr>
					<td style="width:50%;">
						<x:fileList bizCode="AskReportTextBody" bizId="askReportId" id="askReportTextBody" isClass="true"  proportion="28%,72%"/>
					</td>
					<td style="width:50%;border: 1px solid #D6D6D6;border-left-width:0;background-color: #f5f5f5;padding-left: 20px">
						<x:checkbox name="isBodyEdit" label="允许编辑正文"/>&nbsp;
						<x:checkbox name="isBodyDown" label="允许下载正文" />&nbsp;
					</td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:select list="taskKindList" emptyOption="false" id="taskKindId" cssStyle="display:none;" />
			<x:select name="managerType" cssStyle="display:none;"/>
			<div style="display:none" id="bulidTaskDiv">
				<x:title title="计划条目"/>
				<div id="askReportBuildTaskGrid"></div>
				<div class="blank_div"></div>
			</div>
			<x:fileList bizCode="askReport" bizId="askReportId"  id="askReportIdAttachment" />
			<div class="blank_div"></div>
			<div>
			<c:choose>
				<c:when test="${requestScope.isReadonlyContent=='true'}">
					<x:hidden name="isReadonlyContent"  value="true"/>
					<div id="showTextBody" style="margin-bottom:30px "></div>
					<div class="blank_div"></div>
					<c:out value="${askContent}" escapeXml="false" />
				</c:when>
				<c:otherwise>
					<x:textarea name="askContent" required="false" label="内容" rows="10" cssStyle="height:300px;" />
				</c:otherwise>
			</c:choose>
			</div>
		</form>
	</div>
	<div style="width: 99%;margin-top:5px" id="approverList">
		<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
	</div>
	<div class="blank_div"></div>
	<div style="width: 99%;" id="checkerList">
		<x:taskExecutionList procUnitId="Check" defaultUnitId="Check" bizId="bizId" />
	</div>
	<div class="blank_div"></div>
</body>
</html>
	
	

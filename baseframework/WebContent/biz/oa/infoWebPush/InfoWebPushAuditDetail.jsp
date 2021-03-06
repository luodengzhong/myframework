<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,attachment,date,combox" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/infoWebPush/InfoWebPushAuditDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<b style="font-size: 24px;">信息弹屏申请</b>
		</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;">
				 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
				 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
			</span> 
			<span style="float: right; margin-right: 10px;">
			 发送人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99%;">
				<x:layout/>
				<tr>
					<x:hidden name="webPushAuditId" />
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
				    <x:inputTD name="subject" required="true" label="主题" maxLength="60" colspan="5"/>
				</tr>
				<tr>
					<x:inputTD name="infoSubject" disabled="true" label="信息主题" colspan="4"/>
					<td class="title"><a href="##" class="addLink" onclick="previewInfo()">预览信息</a></td>
				</tr>
				<tr>
					<x:inputTD name="effectiveTime"  label="开始时间" required="true"  wrapper="date"/>
					<x:inputTD name="invalidTime" label="作废时间"  required="true" wrapper="date"/>
					<x:inputTD name="sequence" label="优先级系数"  required="true"  mask="nnnn"/>
				</tr>
				<tr>
					<x:textareaTD name="remark" required="false" label="备注" rows="3" maxlength="200" colspan="5"/>
				</tr>
				<tr>
					<td colspan="6">注意:弹屏图片最佳分辨率1024*768</td>
				</tr>
				<tr id="choosePushRangeTR" style="display: none;">
					<td class='title'><span class="labelSpan">弹屏范围&nbsp;:</span></td>
					<td class="title" colspan="4"><div id="pushRangeShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="addLink" id="pushRangeChooseLink" onclick='showChooseOrgDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' class="clearLink" id="pushRangeClearLink" onclick='clearChooseArray()'>清空</a>
					</td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>

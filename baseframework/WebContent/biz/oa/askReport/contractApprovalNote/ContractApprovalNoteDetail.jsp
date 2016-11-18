
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
<script src='<c:url value="/biz/oa/askReport/contractApprovalNote/ContractApprovalNote.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					合同审批笺（综合类）
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
					<x:hidden name="contractApprovalNoteId" />
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
					
					<td class="title"><span class="labelSpan">日期:</span> </td>
					<td class="edit disable">
						<div class="textLabel" id="billCode_view">
							<x:format name="fillinDate" type="date" />
						</div>
					</td>
					<x:inputTD name="contractNoteCode" required="false" label="编号" maxLength="64"/>
					<x:inputTD name="contractCode" required="true" label="合同编号" maxLength="64"/>		
				</tr>
				<tr>
					<x:inputTD name="contractName" required="true" label="合同名称" maxLength="128" colspan="3"/>	
					<x:inputTD name="urgencyOrSlow" required="true" label="缓、急" maxLength="2"/>	
				</tr>
				<tr>
					<x:inputTD name="oppositeCompany" required="true" label="对方单位" maxLength="128" colspan="3"/>	
					<x:inputTD name="sponsorName" required="true" label="主办人" maxLength="64" wrapper="select"/>		
				</tr>
				<tr>
					<x:selectTD name="contractStyle" required="true" label="承包方式" maxLength="50" colspan="3"  dictionary="contractPattern"/>		
					<x:selectTD name="contractKind" required="true" label="合同类别" maxLength="50" dictionary="contractTemplate" />	
				</tr>
				<tr>
				</tr>
				<tr>
					<x:textareaTD name="contractContent" required="true" label="合同主要内容（含金额）" maxLength="1024" colspan="5"/>		
				</tr>
				<tr>
					<td class="title"><span class="labelSpan">附件目录:</span> </td>
					<td colspan="5">
						<c:forEach var="item" items="${attachmentList}" varStatus="status">
									<c:if test="${item.remark==1 }">
										<input type="checkbox" value="${item.value }" id="dict_${item.value }" checked="checked"  class="attachment_list"  />
									</c:if>
									<c:if test="${item.remark==0 }">
										<input type="checkbox"   value="${item.value }" id="dict_${item.value }" class="attachment_list" />
									</c:if>
									<label for="dict_${item.value }">&nbsp;${item.name }</label>&nbsp;&nbsp;&nbsp;
									<c:if test="${status.index%3 == 2&& status.index>0 }">
										<br/>
									</c:if>
							</c:forEach>
							<br/>（ 上述文件均为PDF格式）
					</td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="contractApprovalNote"
				bizId="contractApprovalNoteId" id="contractApprovalNoteIdAttachment" />
			<div class="blank_div"></div>
		</form>
		<div style="margin-bottom:10px">
		备注：适用于职能板块自主采购及外联、行政、营销类合同报审。
		</div>
	</div>
</body>
</html>

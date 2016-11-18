
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<link   href='<c:url value="/biz/oa/askReport/tenderTechRequire/TenderTechRequireReport.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/askReport/qualification/RealtyQualification.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					房地产开发资质证书办理申请表
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
				<x:layout proportion="20%,15%,14%,19%,14%,19%" />
				<tr>
					<x:hidden name="qualificationId" />
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
					<td class="title">
						<span class="labelSpan" style="line-height:25px;">
							文件编号<font color="#FF0000">*</font>&nbsp;:&nbsp;&nbsp;
							<a href='##' class="GridStyle"  style="display:none" id="getDispatchNoBtn"  onclick='getDispatchNo()'>获取</a>
						</span>
						<x:hidden name="dispatchKindId" />
					    <x:hidden name="dispatchKindName" />
					    <x:hidden name="titleDispatchNo" />
					</td>
					<td class="disable" >
						<x:input name="dispatchNo" required="false" label="文件编号" readonly="true" cssClass="textReadonly"/>
					</td>
					<x:inputTD name="handleOrganName" required="true" label="公司名称" maxLength="64"/>		
					<x:inputTD name="certId" required="true" label="资质证书号" maxLength="64"/>		
				</tr>
				<tr>
					<x:inputTD name="validDate" required="true" label="资质证书有效期至" maxLength="7" wrapper="date"/>		
					<x:inputTD name="legalPerson" required="true" label="法定代表人" maxLength="32"/>		
					<x:inputTD name="registeredFund" required="true" label="注册资金" maxLength="22" mask="nnnnnnnnnnnnnnnnn.nn"/>		
				</tr>
				<tr>
					<x:inputTD name="businessLicense" required="true" label="营业执照号" maxLength="32"/>
					<td colspan="4"></td>
				</tr>
				<tr>
					<td rowspan="6" class="title">
						<span class="labelSpan">申办类别及内容<font color="#FF0000">*</font>&nbsp;:</span>
					</td>
					<td><x:checkbox name="declaration" required="false" label="新申报" maxLength="22"/></td>
					<td colspan="4" class="edit"><x:textarea name="declarationContent" required="false" label="新申报内容" maxLength="256"/></td>
				</tr>
				<tr>
					<td ><x:checkbox name="FChange" required="false" label="变更" maxLength="22"/></td>
					<td colspan="4">
						<table style="width:100%;" class="tableInput">
						<x:layout proportion="30%,30%,30%" />
							<tr  class="table_grid_head_tr">
								<th >
									变更内容
								</th>
								<th>
									原登记内容
								</th>
								<th>
									拟变登记内容
								</th>
							</tr>
							<tr>
								<td style="text-align:center" class="title">注册资金</td>
								<td class="edit"><x:input name="changeBeforeContent" required="false" label="原登记内容" maxLength="22" mask="nnnnnnnnnnnnnnnnn.nn"/></td>
								<td class="edit"><x:input name="changeAfterContent" required="false" label="拟变更内容" maxLength="22" mask="nnnnnnnnnnnnnnnnn.nn"/></td>
							</tr>
							<tr>
								<td style="text-align:center" class="title">地址</td>
								<td class="edit"><x:input name="changeBeforeAddress" required="false" label="拟原内容" maxLength="40"/></td>
								<td class="edit"><x:input name="changeAfterAddress" required="false" label="拟变更内容" maxLength="40"/></td>
							</tr>
							<tr>
								<td style="text-align:center" class="title">经营范围</td>
								<td class="edit"><x:input name="changeBeforeScope" required="false" label="原登记内容" maxLength="256"/></td>
								<td class="edit"><x:input name="changeAfterScope" required="false" label="拟变更内容" maxLength="256"/></td>
							</tr>
							<tr>
								<td style="text-align:center" class="title">法定代表人</td>
								<td class="edit"><x:input name="changeBeforeLegalPerson" required="false" label="原登记内容" maxLength="32"/></td>
								<td class="edit"><x:input name="changeAfterLegalPerson" required="false" label="拟变更内容" maxLength="32"/>	</td>
							</tr>
							<tr>
								<td style="text-align:center" class="title">公司类型</td>
								<td class="edit"><x:input name="changeBeforeCompanyKind" required="false" label="原登记内容" maxLength="64"/></td>
								<td class="edit"><x:input name="changeAfterCompanyKind" required="false" label="拟变更内容" maxLength="64"/></td>
							</tr>
							<tr>
								<td style="text-align:center" class="title">其他</td>
								<td class="edit"><x:input name="changeBeforeOther" required="false" label="原登记内容" maxLength="256"/></td>
								<td class="edit"><x:input name="changeAfterOther" required="false" label="拟变更内容" maxLength="256"/></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td><x:checkbox name="FExtend" required="false" label="延续" maxLength="22"/></td>
					<td colspan="4" class="edit"><x:textarea name="extendContent" required="false" label="延续内容" maxLength="256"/></td>
				</tr>
				<tr>
					<td><x:checkbox name="FUpdate" required="false" label="升级" maxLength="22"/></td>
					<td colspan="4" class="edit"><x:textarea name="updateContent" required="false" label="升级内容" maxLength="256"/></td>
				</tr>
				<tr>
					<td><x:checkbox name="writeOff" required="false" label="注销" maxLength="22"/>	</td>
					<td colspan="4" class="edit"><x:textarea name="writeOffContent" required="false" label="注销内容" maxLength="256"/></td>
				</tr>
				<tr>
					<td><x:checkbox name="other" required="false" label="其他" maxLength="22"/></td>
					<td colspan="4" class="edit"><x:textarea name="otherContent" required="false" label="其他内容" maxLength="256"/></td>
				</tr>
				<tr style="min-height: 25px;">
					<x:textareaTD name="handleDescription" required="false" label="房地产资质申办说明" maxLength="256" colspan="5"/>
				</tr>	
				<tr style="min-height: 25px;">
					<x:textareaTD name="workArrangement" required="false" label="办理资质证书配合部门工作分工安排" maxLength="256" colspan="5"/>
				</tr>	
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="realtyQualification"
				bizId="qualificationId" id="qualificationIdAttachment" />
			<div class="blank_div"></div>
		</form>
	</div>
</body>
</html>

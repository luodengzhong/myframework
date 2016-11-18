
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
<script src='<c:url value="/biz/oa/askReport/communication/Communication.js"/>' type="text/javascript"></script>
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
	height:100%;
	
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
					通讯业务办理申请表
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
					<x:hidden name="communicationId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="deptName" />
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
					
					<x:hidden name="operatorId" />
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
					<x:inputTD name="operatorName" required="true" label="经办人" maxLength="64" wrapper="select"/>
					<td colspan="2"></td>
				</tr>
				<tr>
					<x:textareaTD name="reason" required="true" label="办理事由" maxLength="128" colspan="5"/>	
				</tr>
			</table>
			<table style="width: 99.5%;" class="content tableInput">
				<x:layout proportion="20%,20%,10%,50%" />
					<tr style="border:1px;height:30px;border-color:inherit">
						<th colspan="4">
							申请办理业务
						</th>
					</tr>
			        <tr>
						<td rowspan="6">座机业务申请</td>
						<td rowspan="2">装、拆机</td>
						<td class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" name="install" id="install" />
							<label for="install">&nbsp;装机</label>
						</td>		
						<td class="edit" style="padding-left:10px;text-align:left;height:27px;">
								新装个数：&nbsp;&nbsp;&nbsp;
								<x:input cssClass='input_text' name="installCount" style="width:50px;" maxLength="5" mask="nnnnn"/>
						</td>		
				   </tr>
			        <tr>
						<td class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" id="uninstall" name="uninstall"  />
							<label for="uninstall">&nbsp;拆机</label>
						</td>		
						<td class="edit" style="padding-left:10px;text-align:left;height:27px;">
							拆销号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="uninstallNumber" style="width:80%;"/>
						</td>		
				   </tr>
			        <tr>
						<td rowspan="2">ADSL</td>
						<td class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" id="openAdsl" name="openAdsl" />
							<label for="openAdsl">&nbsp;开通</label>
						</td>		
						<td  class="edit"  style="padding-left:10px;text-align:left;height:27px;">
							开通号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="openAdslNumber" style="width:80%;"/>
						</td>		
				   </tr>
			        <tr>
						<td class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno"  id="closeAdsl"  name="closeAdsl" />
							<label for="closeAdsl">&nbsp;关闭</label>
						</td>		
						<td  class="edit" style="padding-left:10px;text-align:left;height:27px;">
							关闭号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="closeAdslNumber" style="width:80%;"/>
						</td>		
				   </tr>
			        <tr>
						<td rowspan="2">功能增减</td>
						<td  class="edit">
							<label for="">&nbsp;开通</label>
						</td>		
						<td  style="padding-left:10px;text-align:left;height:27px;" class="edit">
							<c:forEach var="item" items="${openCommServices}" varStatus="status">
								<c:if test="${item.remark==1 }">
									<input type="checkbox"   id="open_comm_services_${item.value }" value="${item.value }" checked="checked"  class="open_comm_services"  />
								</c:if>
								<c:if test="${item.remark==0 }">
									<input type="checkbox"  id="open_comm_services_${item.value }" value="${item.value }"  class="open_comm_services" />
								</c:if>
								
								<label for="open_comm_services_${item.value }">&nbsp;${item.name }</label>
							</c:forEach>
						</td>		
				   </tr>
			        <tr>
						<td  class="edit">
							<label for="">&nbsp;关闭</label>
						</td>		
						<td  style="padding-left:10px;text-align:left;height:27px;" class="edit">
							<c:forEach var="item" items="${closeCommServices}" varStatus="status">
								<c:if test="${item.remark==1 }">
									<input type="checkbox"   id="close_comm_services_${item.value }" value="${item.value }" checked="checked"  class="close_comm_services"  />
								</c:if>
								<c:if test="${item.remark==0 }">
									<input type="checkbox"  id="close_comm_services_${item.value }" value="${item.value }" class="close_comm_services" />
								</c:if>
								
								<label for="close_comm_services_${item.value }">&nbsp;${item.name }</label>
							</c:forEach>
						</td>		
				   </tr>
				    <tr>
						<td rowspan="3">手机业务申请</td>
						<td colspan="2"  class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" id="commFeeTrusteeship"  name="commFeeTrusteeship" />
							<label for="commFeeTrusteeship">&nbsp;话费托收</label>
						</td>
						<td style="padding-left:10px;text-align:left;height:27px;" class="edit">
							手机号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="trusteeshipNumber" style="width:150px;"/>
							&nbsp;&nbsp;使用人员：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="trusteeshipPersionName" style="width:150px;"/>
							<x:hidden name="trusteeshipPersionId" />
						</td>			
				   </tr>
				    <tr>
						<td colspan="2"  class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" id="groupNetwork"  name="groupNetwork" />
							<label for="groupNetwork">&nbsp;集团专网</label>
						</td>
						<td style="padding-left:10px;text-align:left;height:27px;" class="edit">
							手机号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="networkNumber" style="width:150px;"/>
							&nbsp;&nbsp;使用人员：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text'  name="networkPersionName" style="width:150px;" />
							<x:hidden name="networkPersionId" />
						</td>			
				   </tr>
				    <tr>
						<td colspan="2" class="edit">
							<x:checkbox cssClass="service-checkbox" dictionary="yesorno" id="internationalRoaming"  name="internationalRoaming" />
							<label for="internationalRoaming">&nbsp;国际漫游</label>
						</td>
						<td style="padding-left:10px;text-align:left;height:27px;" class="edit">
							手机号码：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="roamingNumber" style="width:150px;"/>
							&nbsp;&nbsp;使用人员：&nbsp;&nbsp;&nbsp;
							<x:input cssClass='input_text' name="useRoamingPersionName" style="width:150px;" />
							<x:hidden name="useRoamingPersionId" />
						</td>			
				   </tr>
				     <tr>
						<td >其他</td>
						<td colspan="3" class="edit">
							<x:textarea cssClass="textarea" name="other" />
						</td>
				   </tr>
				   <tr><td colspan="4"></td></tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="communication"
				bizId="communicationId" id="communicationIdAttachment" />
			<div class="blank_div"></div>
			<div style="margin-bottom:10px">
				备注：
				&nbsp;请在需办理的业务“□”前划“√”，若有其他要求请在“其他”项中注明。
			</div>
		</form>
	</div>
</body>
</html>

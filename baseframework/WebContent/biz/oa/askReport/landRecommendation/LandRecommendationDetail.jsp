
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
<script src='<c:url value="/biz/oa/askReport/landRecommendation/LandRecommendation.js"/>' type="text/javascript"></script>
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
	text-align:right;
	font-size:12px;
	padding-right:10px;
}
</style>
</head>
<body>
	<div class="mainPanel" style="padding:0 5%">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; cursor: pointer;"> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					土地信息推荐表
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
		<div class="blank_div"></div>
		<div style="overflow: hidden; width: 99.9%;">
			<div class="navTitle">
				<a href="javascript:void(0);" hidefocus="true" class="togglebtn"
					hidetable="#fill_in_requirements" title="show or hide"></a><span
					class="group">&nbsp;</span>&nbsp;<span>填写说明</span>
			</div>
			<div class="navline"></div>
			<div class="extendedFieldDiv">
				<table cellspacing="0px" cellpadding="0px" class="tableInput"
					id="fill_in_requirements" style="display: table;">
					<tbody>
						<tr>
							<td colspan="4">
								<div><b ><font color="red">填写要求：</br>
								表格内1-12项为必填项。</br></br>
								特别提示：</br>
								</font></b></div>
								1、有效推荐的信息为非常规招拍挂项目，包括但不限于股权收购、合作开发和政府勾地项目等</br>
								2、有效推荐的信息的用地性质应为住宅、商业、商业兼容住宅、住宅兼容商业或商住混合用地。</br>
								3、有效推荐的信息应同时满足有效性、完整性和时效性三个要求。同一土地信息在满足有效性、完整性的前提下，以先到达土地信息管理员的OA记录为准。一个项目只登记一次，具有排他性。
								</br></br>
								
								<div><b ><font color="red">名词解释：</font></b></div>
								1、<b>宗地位置：</b>是指土地所在的区位和地址，需尽可能精确，最低要求需明确到区。</br>
								2、<b>宗地性质：</b>是指土地的属性，一般为住宅、商业、工业等等，如属兼容或混合用地，需明确各性质地块的占比。</br>
								3、<b>宗地面积：</b>指宗地的净用地面积，即可以进行项目开发的土地面积。</br>
								4、<b>容积率：</b>是指地上总建筑面积与用地面积的比率，相同地块，容积率越高，不考虑其它因素，可建面积越大。</br>
								5、<b>交易方式：</b>一般可分为常规招拍挂、股权收购、合作开发、政府勾地等。</br>
								6、<b>交易时间：</b>是可以进行招拍挂交易或非招拍挂土地转让或股权转移的时间。</br>
								7、<b>付款条件：</b>是指土地交易付款的节奏和方式</br>
								8、<b>联系人：</b>是指项目具体的联系人</br>
								9、<b>地块相关材料：</b>包括但不限于土地使用证、红线图、规划设计条件通知书、项目介绍材料等
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="blank_div"></div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="15%,20%,10%,20%" />
				<tr>
					<x:hidden name="landRecommendationId" />
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
					<x:hidden name="referrerId" />
					<x:hidden name="referrerDeptId" />
					<x:hidden name="mapScreenshot" />
					
					
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
					<td colspan="2"></td>
				</tr>
				<tr>
					<td class="title"><span class="labelSpan">（1）城市<font color="#FF0000">*</font>：</span> </td>
					<td class="edit " colspan="3">
						<div style="vertical-align:bottom">
							<x:input cssClass='input_text' required="true" label="省" name="province" style="width:150px;height:20px"/>省
							<x:input cssClass='input_text' required="true" label="市" name="city" style="width:150px;height:20px"/>市
						</div>
					</td>
				</tr>
				<tr>
					<td class="title" >
						<span class="labelSpan">（2）宗地位置<font color="#FF0000">*</font>:</span> &nbsp;&nbsp;
					</td>
					<td class="edit " colspan="3">
						<div style="vertical-align:bottom">
							<x:input cssClass='input_text' required="true" label="区/县" name="county" style="width:150px;height:20px"/>区/县
							<x:input cssClass='input_text' required="true" label="街道/路" name="street" style="width:150px;height:20px"/>街道/路
							<x:input cssClass='input_text' required="true" label="地块" name="land" style="width:200px;height:20px"/>地块
							<div id="boxToolBar" style="background:none;border:0;float:right"></div>
						</div>
						<div style="overflow: hidden; width: 99.9%;">
							<div class="navTitle" >
								<a href="javascript:void(0);" hidefocus="" class="togglebtn"
									hidetable="#screenshop" title="show or hide"></a><span
									class="group">&nbsp;</span>&nbsp;<span>预览</span>
							</div>
							<div class="extendedFieldDiv" groupid="1035" style="width: 99.9%;">
								<table cellspacing="0px" cellpadding="0px" class="tableInput"
									id="screenshop" style="display: table;" align="center">
									<tbody>
										<tr>
											<td style="text-align:center">
												<img id="mapScreenshopPreview" onload="DrawImage(this,800,800)" src="" >
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<x:inputTD name="quality" required="true" label="（3）宗地性质" colspan="3"/>
				</tr>
				<tr>
					<x:inputTD name="commercailResidentialRatio" required="true" label="（4）商住比（%）" colspan="3"  mask="nn.nn"/>
				</tr>
				<tr>
					<x:inputTD name="area" required="true" label="（5）宗地面积（亩）" colspan="3" mask="nnnnnnn.nn"/>
				</tr>
				<tr>
					<x:inputTD name="plotRatio" required="true" label="（6）容积率" colspan="3" mask="nn.nn"/>
				</tr>
				<tr>
					<x:inputTD name="dealWay" required="true" label="（7）交易方式" colspan="3"/>
				</tr>
				<tr>
					<x:inputTD name="dealTime" required="true" label="（8）交易时间" colspan="3" wrapper="date"/>
				</tr>
				<tr>
					<x:inputTD name="paymentCondition" required="true" label="（9）付款条件" colspan="3"/>
				</tr>
				<tr>
					<x:textareaTD name="materialDetail" required="true" label="（10）地块相关材料（请上传附件）" colspan="3"/>
					
				</tr>
				<tr>
					<x:textareaTD name="specialRemark" required="true" label="（11）特殊情况说明" colspan="3"/>
				</tr>
				<tr>
					<x:inputTD name="sellerContact" required="true" label="（12）出让方联系人/联系方式" />
					<x:inputTD name="selelrPosition" required="false" label="（13）出让方联系人职务" />
				</tr>
				
				<tr>
					<x:inputTD name="landContacts" required="false" label="（14）地块联系人/联系方式" />
					<x:inputTD name="landContactsPosition" required="false" label="（15）地块联系人职务" />
				</tr>
				<tr>
					<x:inputTD name="referrerName" required="false" label="（16）推荐人" wrapper="select"/>
					<x:inputTD name="referrerDeptName" required="false" label="（17）推荐人单位" />
				</tr>
			</table>
			<div class="blank_div"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="landRecommendation"
				bizId="landRecommendationId" id="landRecommendationIdAttachment" />
			<div class="blank_div"></div>
			
		</form>
	</div>
</body>
</html>

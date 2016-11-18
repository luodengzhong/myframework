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
<script src='<c:url value="/biz/oa/askReport/tenderTechRequire/TenderTechRequireReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" >
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					招标技术要求会审单
				</c:when>
					<c:otherwise>
						<c:out value="${defaultTitle}" />
					</c:otherwise>
				</c:choose>
			</span> 
		</div>
		<div class="bill_info" style="width:100%;margin:0px auto;">
			<span style="float: left; margin-left: 10px;"> 单据号码：<strong><c:out
						value="${billCode}" /></strong> &nbsp;&nbsp; 制单日期：<strong><x:format
						name="fillinDate" type="date" /></strong>
			</span> <span style="float: right; margin-right: 10px;"> 发送人：<strong><c:out
						value="${organName}" />.<c:out value="${deptName}" />.<c:out
						value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<div>
			<table  style="width: 99.5%;margin: 0 auto 0;"center="true" class="tableInput">
				<x:layout proportion="10%,21%,10%,21%,10%,21%" />
				<tr border="0">
					<x:hidden name="tenderTechRequireReportId"/>
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
					<x:hidden name="fillinPersonId" />
					<x:hidden name="fillinPersonLongName" />
					<td class="title">
						<span class="labelSpan" style="line-height:25px;">
							文件编号&nbsp;:&nbsp;&nbsp;
							<a href='##' class="GridStyle"  style="display:none" id="getDispatchNoBtn"  onclick='getDispatchNo()'>获取</a>
						</span>
						<x:hidden name="dispatchKindId" />
					    <x:hidden name="dispatchKindName" />
					</td>
					<td class="disable">
						<x:input name="dispatchNo" required="false" label="文件编号" readonly="true" cssClass="textReadonly"/>
					</td>
					<x:selectTD name="tenderProjectKindCode" required="true" label="招标项目类别"
						maxLength="32" dictionary="tenderProjectKind" />
					<x:inputTD name="fillinPersonName" required="true" label="填表人"  wrapper="select" />
				</tr>
			</table>
			
			<table style="width: 99.5%;" class="content tableInput applyInputTable">
				<x:layout proportion="15%,25%,35%,10%,20%" />
					<tr style="border:1px;height:30px;border-color:inherit">
						<th>
							责任单位
						</th>
						<th>
							项目
						</th>
						<th>
							内容
						</th>
						<th>
							负责人
						</th>
						<th>
							备注
						</th>
					</tr>
				<tr>
					<td rowspan="6">委托部门</td>
					<td>招标项目</td>
					<td><x:textarea name="tenderProjectContent" required="false" label="内容" maxLength="1024"/></td>
					<td><x:textarea name="tenderProjectLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="tenderProjectComment" required="false" label="备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>招标需求来源</td>
					<td><x:textarea name="tenderRequireSourceContent" required="false" label="招标需求来源  内容" maxLength="256"/></td>		
					<td><x:textarea name="tenderRequireSourceLeader" required="false" label="招标需求来源  负责人" maxLength="32"/></td>		
					<td><x:textarea name="tenderRequireSourceComment" required="false" label="招标需求来源  备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>招标内容</td>
					<td><x:textarea name="tenderContent" required="false" label="招标内容  内容" maxLength="1024"/></td>		
					<td><x:textarea name="tenderLeader" required="false" label="招标内容 负责人" maxLength="32"/></td>		
					<td><x:textarea name="tenderComment" required="false" label="招标内容 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>招标范围</td>
					<td><x:textarea name="tenderScopeContent" required="false" label="招标范围 内容" maxLength="256"/></td>		
					<td><x:textarea name="tenderScopeLeader" required="false" label="招标范围 负责人" maxLength="32"/></td>
					<td><x:textarea name="tenderScopeComment" required="false" label="招标范围 备注" maxLength="256"/></td>	
				</tr>
				<tr>
					
					<td>方案是否经政府或报建审批通过</td>
					<td><x:textarea name="schemePassContent" required="false" label="方案是否经政府部门或报建审批通过 内容" maxLength="32"/></td>		
					<td><x:textarea name="schemePassLeader" required="false" label="方案是否经政府部门或报建审批通过 负责人" maxLength="32"  wrapper="select"/></td>		
					<td><x:textarea name="schemePassComment" required="false" label="方案是否经政府部门或报建审批通过 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>
						标准化应用率（区域公司填写、总部对应职能归口管理部门审核）
					</td>
					<td><x:textarea name="standardizedRateContent" required="false" label="内容" maxLength="128"/></td>		
					<td><x:textarea name="standardizedRateLeader" required="false" label="标准化应用率 负责人" maxLength="32"/></td>		
					<td><x:textarea name="standardizedRateComment" required="false" label="标准化应用率 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td colspan="5">
					</td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<x:fileList bizCode="tenderTechRequireReport"
				bizId="tenderTechRequireReportId" id="tenderTechRequireReportIdAttachment" />
			<div class="blank_div"></div>
			<table style="width: 99.5%;" class="content tableInput approvalInputTable">
				<x:layout proportion="15%,25%,35%,10%,20%" />
				<tr style="border:1px;height:30px;border-color:inherit">
					<th>
						责任单位
					</th>
					<th>
						项目
					</th>
					<th>
						内容
					</th>
					<th>
						负责人
					</th>
					<th>
						备注
					</th>
				</tr>
				<tr>
					<td rowspan="4">总部/区域公司成本管理单位</td>
					<td>否存在重大漏项及重复</td>
					<td><x:textarea name="existsMissOrRepeatContent" required="false" label="内容" maxLength="128"/></td>		
					<td><x:textarea name="existsMissOrRepeatLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="existsMissOrRepeatComment" required="false" label="备注" maxLength="128"/></td>		
				</tr>
				<tr>
					
					<td>图纸是否详尽、是否具备测算条件 </td>
					<td><x:textarea name="designDetailContent" required="false" label="内容" maxLength="128"/></td>		
					<td><x:textarea name="designDetailLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="designDetailComment" required="false" label="备注" maxLength="128"/></td>		
				</tr>
				<tr>
					
					<td>是否经测算、测算金额是否超指标 </td>
					<td><x:textarea name="amountOverproffContent" required="false" label="内容" maxLength="32"/></td>		
					<td><x:textarea name="amountOverproffLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="amountOverproffComment" required="false" label="备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>是否有超出战略协议清单外的工作内容、工艺或做法 </td>
					<td><x:textarea name="workOverproffContent" required="false" label="内容" maxLength="32"/></td>		
					<td><x:textarea name="workOverproffLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="workOverproffComment" required="false" label="备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td colspan="5">
					</td>
				</tr>
			</table>
			<table style="width: 99.5%;" class="content tableInput approvalInputTable">
				<x:layout proportion="15%,25%,35%,10%,20%" />
				<tr style="border:1px;height:30px;border-color:inherit">
					<th>
						责任单位
					</th>
					<th>
						项目
					</th>
					<th>
						内容
					</th>
					<th>
						负责人
					</th>
					<th>
						备注
					</th>
				</tr>
				<tr>
					<td rowspan="10">区域公司工程管理单位（区域公司技术管理单位）</td>
					<td>项目工期、是否采用特殊抢工措施</td>
					<td><x:textarea name="projectDurationContent" required="false" label="项目工期、是否采用特殊枪工措施 内容" maxLength="32"/></td>		
					<td><x:textarea name="projectDurationLeader" required="false" label="项目工期、是否采用特殊枪工措施 负责人" maxLength="32"/></td>		
					<td><x:textarea name="projectDurationComment" required="false" label="项目工期、是否采用特殊枪工措施 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td>进场时间：现场施工条件是否具备，都已经具备了什么条件，如果不具备预计什么时候具备（含手续条件）</td>
					<td><x:textarea name="buildConditionContent" required="false" label="进场时间：现场施工条件是否具备，都已经具备了什么条件，如果不具备预计什么时候具备（含手续条件）内容" maxLength="1024"/></td>		
					<td><x:textarea name="buildConditionLeader" required="false" label="进行时间施工条件是否具体负责人" maxLength="32"/></td>		
					<td><x:textarea name="buildConditionComment" required="false" label="进行时间施工条件是否具体 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td>是否存在重大漏项及重复</td>
					<td><x:textarea name="projectExistsMissContent" required="false" label="招标项目是否存在重大漏项 内容" maxLength="32"/></td>		
					<td><x:textarea name="projectExistsMissLeader" required="false" label="招标项目是否存在重大漏项 负责人" maxLength="32"/></td>		
					<td><x:textarea name="projectExistsMissComment" required="false" label="招标项目是否存在重大漏项 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td>现场是否存在特殊施工环境，是否有特殊施工工艺</td>
					<td><x:textarea name="siteSpecialItemContent" required="false" label="现场是否存在特殊施工环境，是否有特殊施工工艺 内容" maxLength="32"/></td>		
					<td><x:textarea name="siteSpecialItemLeader" required="false" label="现场是否存在特殊施工环境，是否有特殊施工工艺 负责人" maxLength="32"/></td>		
					<td><x:textarea name="siteSpecialItemComment" required="false" label="现场是否存在特殊施工环境，是否有特殊施工工艺 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td>技术及质量要求</td>
					<td><x:textarea name="techQualityRequireContent" required="false" label="技术及质量要求 内容" maxLength="1024"/></td>		
					<td><x:textarea name="techQualityRequireLeader" required="false" label="技术及质量要求 负责人" maxLength="32"  wrapper="select"/></td>		
					<td><x:textarea name="techQualityRequireComment" required="false" label="技术及质量要求 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					<td>验收标准</td>
					<td><x:textarea name="checkStandardContent" required="false" label="验收标准 内容" maxLength="1024"/></td>		
					<td><x:textarea name="checkStandardLeader" required="false" label="验收标准 负责人" maxLength="32" wrapper="select"/></td>		
					<td><x:textarea name="checkStandardComment" required="false" label="验收标准 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>甲方现场代码</td>
					<td><x:textarea name="firstPartyDelegateContent" required="false" label="甲方现场代表 内容" maxLength="32"/></td>		
					<td><x:textarea name="firstPartyDelegateLeader" required="false" label="甲方现场代表 负责人" maxLength="32"  wrapper="select"/></td>		
					<td><x:textarea name="firstPartyDelegateComment" required="false" label="甲方现场代表 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>委托监理单位名称</td>
					<td><x:textarea name="supervisorUnitNameContent" required="false" label=" 内容" maxLength="256"/></td>		
					<td><x:textarea name="supervisorUnitNameLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="supervisorUnitNameComment" required="false" label="备注" maxLength="128"/></td>		
				</tr>
				<tr>
					
					<td>推荐施工单位</td>
					<td><x:textarea name="recommendBuildUnitContent" required="false" label=" 内容" maxLength="256"/></td>		
					<td><x:textarea name="recommendBuildtUnitLeader" required="false" label="推荐施工单位 负责人" maxLength="32"/></td>		
					<td><x:textarea name="recommendBuildUnitComment" required="false" label="推荐施工单位 备注" maxLength="256"/></td>		
				</tr>
				<tr>
					
					<td>其他特殊要求</td>
					<td><x:textarea name="otherSpecialRequireContent" required="false" label=" 内容" maxLength="256"/></td>		
					<td><x:textarea name="otherSpecialRequireLeader" required="false" label="其他特殊要求 负责人" maxLength="32"  wrapper="select"/></td>		
					<td><x:textarea name="otherSpecialRequireComment" required="false" label="其他特殊要求 备注" maxLength="256"/></td>		
				</tr>
			</table>
			<table style="width: 99.5%;" class="content tableInput approvalInputTable">
				<x:layout proportion="15%,25%,35%,10%,20%" />
					<tr style="border:1px;height:30px;border-color:inherit">
						<th>
							责任单位
						</th>
						<th>
							项目
						</th>
						<th>
							内容
						</th>
						<th>
							负责人
						</th>
						<th>
							备注
						</th>
					</tr>
				<tr>
					<td>总部技术管理单位</td>
					<td>技术要求是否使用公司要求模板、人居红线有强制性规范、企业标准等内容的审核</td>
					<td><x:textarea name="techRequireStandContent" required="false" label="内容" maxLength="32"/></td>		
					<td><x:textarea name="techRequireStandLeader" required="false" label="负责人" maxLength="32"/></td>		
					<td><x:textarea name="techRequireStanddComment" required="false" label="备注" maxLength="256"/></td>		
				</tr>
			</table>
			<table style="width: 99.5%;" class="content tableInput approvalInputTable">
				<x:layout proportion="15%,25%,35%,10%,20%" />
				<tr style="border:1px;height:30px;border-color:inherit">
					<th>
						责任单位
					</th>
					<th>
						项目
					</th>
					<th>
						内容
					</th>
					<th>
						负责人
					</th>
					<th>
						备注
					</th>
				</tr>
				<tr>
					<td>总部规划创意管理单位</td>
					<td>技术要求是否使用公司要求模板、人居红线有强制性规范、企业标准等内容的审核</td>
					<td><x:textarea name="techRequirePlanContent" required="false" label=" 内容" maxLength="32"/></td>		
					<td><x:textarea name="techRequirePlanLeader" required="false" label="负责人" maxLength="32"  wrapper="select"/></td>		
					<td><x:textarea name="techRequirePlanComment" required="false" label="备注" maxLength="256"/></td>
				</tr>
			</table>
			</div>
		</form>
		<div style="margin-bottom:10px">
		备注：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;1、会审单须各职能部门第一负责人确认；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;2、景观、装饰类、方案设计类须总部规划创意管理单位确认；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;3、施工图设计、工程类、采购类须总部技术管理单位确认；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;4、在审批过程中，若某职能部门提出意见，委托部门需针对提出的意见进行落实和调整，并将调整后结果向提出意见的部门再次确认。
						
		</div>
	</div>
</body>
</html>

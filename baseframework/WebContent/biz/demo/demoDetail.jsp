<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/demo/demoDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div
			style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 20px;">
			挂牌土地基本信息</div>
		<form method="post" action="" id="submitForm">
			<x:hidden name="id" />
			<x:hidden name="logicAreaId" />
			<x:hidden name="ruleId" />
			<x:title name="group" title="一、核心基本信息"  hideIndex="0" hideTable="#table_01"/>
			<table class='tableInput' style="width: 99%;" id="table_01">
				<x:layout proportion="12%,21%,12%,21%,10%" />
				<tr>
					<x:inputTD name="noticeCode" required="false" label="公告编号"
						maxLength="64" />
					<x:inputTD name="code" required="false" label="地块编号" maxLength="64" />
					<x:inputTD name="area" required="true" label="用地面积" maxLength="20" />
				</tr>
				<tr>
					<x:inputTD name="location" required="true" label="地块位置"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="name" required="false" label="地块名称"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="applyBidAddressWay" required="true"
						label="申请竞买地址及方式" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:selectTD name="usageId" dictionary="LandUsage" required="true"
						label="土地用途" emptyOption="false" />
					<x:inputTD name="floorAreaRate" required="true" label="容积率"
						maxLength="128" />
					<x:inputTD name="lowestPrice" required="true" label="起拍价"
						maxLength="20" />
				</tr>
				<tr>
					<x:inputTD name="noticeStartTime" required="false" label="挂牌起始日期"
						maxLength="7" wrapper="date" />
					<x:inputTD name="noticeEndTime" required="false" label="挂牌截止时间"
						maxLength="7" wrapper="date" />
					<x:inputTD name="noticeTimeLimit" required="false" label="挂牌期限"
						maxLength="22" />
				</tr>
				<tr>
					<x:selectTD name="transferKindId" required="true" label="出让方式"
						dictionary="TransferKind" emptyOption="false" />
					<x:inputTD name="auctionTime" required="true" label="竞拍时间"
						maxLength="7" wrapper="date" />
					<x:inputTD name="guaranteeAmountTime" required="false"
						label="竞买保证金" maxLength="22" />
				</tr>
				<tr>
					<x:inputTD name="usage" required="false" label="网站土地用途"
						maxLength="128" />
					<x:inputTD name="sourceTransferKind" required="false"
						label="网站出让方式" maxLength="128" />
					<x:hidden name="adminAreaId" />
					<x:inputTD name="adminAreaName" wrapper="tree"
						dataOptions="name:'adminArea', back:{text:'#adminAreaName', value: '#adminAreaId'}"
						required="true" label="行政区域" />
				</tr>
			</table>
			
			<x:title name="group" title="二、基本信息" hideIndex="2" hideTable="#table_02"/>
			<table class='tableInput' style="width: 99%;" id="table_02">
				<x:layout proportion="12%,21%,12%,21%,10%,22%" />
				<tr>
					<x:inputTD name="floorArea" required="false" label="建筑面积"
						maxLength="128" />
					<x:inputTD name="afforestationRate" required="false" label="绿地率"
						maxLength="128" />
					<x:inputTD name="afforestationArea" required="false" label="绿地面积"
						maxLength="128" />
				</tr>
				<tr>
					<x:inputTD name="commercialRate" required="false" label="商住比率"
						maxLength="128" />
					<x:inputTD name="buildingDensity" required="false" label="建筑密度"
						maxLength="128" />
					<x:inputTD name="buildingHeight" required="false" label="建筑高度"
						maxLength="128" />
				</tr>
				<tr>
					<x:inputTD name="buildingCoefficient" required="false" label="建筑系数"
						maxLength="128" />
					<x:inputTD name="msDwellingSizeRate" required="false"
						label="住宅中小户型比例" maxLength="128" />
					<x:inputTD name="collectArea" required="false" label="代征面积"
						maxLength="22" />
				</tr>
				<tr>
					<x:inputTD name="enterTime" required="false" label="报名时间"
						maxLength="7" wrapper="date" />
					<x:inputTD name="bidQualifiedTime" required="false"
						label="确认竞买资格时间" maxLength="7" />
					<x:inputTD name="consignmentTime" required="false" label="交地时间"
						maxLength="7" wrapper="date" />
				</tr>
				<tr>
					<x:inputTD name="guaranteeAmounTime" required="false"
						label="保证金截止时间" maxLength="7" wrapper="date" />
					<x:inputTD name="paymentTime" required="false" label="缴款时间"
						maxLength="7" wrapper="date" />
					<x:inputTD name="ageLimit" required="false" label="出让年限"
						maxLength="4" />
				</tr>
				<tr>
					<x:inputTD name="salePartitionRate" required="false"
						label="项目分割销售的比例约定" maxLength="128" colspan="3" />
					<x:inputTD name="investmentAmount" required="false" label="投资总额"
						maxLength="22" />
				</tr>
				<tr>
					<x:inputTD name="biddingStep" required="false" label="竞价阶梯"
						maxLength="22" />
					<x:inputTD name="premiumRate" required="false" label="溢价率"
						maxLength="128" />
					<x:inputTD name="referencePrice" required="false" label="参考地价"
						maxLength="22" />
				</tr>
				<tr>
					<x:inputTD name="ceilingPrice" required="false" label="最高限价"
						maxLength="22" />
					<x:selectTD name="dataSourceKindId" dictionary="LandDataSourceKind"
						label="数据来源" emptyOption="false" />
					<td colspan="2" style="padding:0px;" class="title">
						<x:fileList bizCode="cs002" bizId="1" id="testTableFileListInTable" isClass="true" inTable="true" proportion="32%,70%"/>
					</td>
				</tr>
				<tr>
					<x:inputTD name="biddingStep" required="false" label="竞价阶梯"
						maxLength="22" />
					<x:inputTD name="premiumRate" required="false" label="溢价率"
						maxLength="128" />
					<x:inputTD name="referencePrice" required="false" label="参考地价"
						maxLength="22" />

				</tr>
			</table>
			<x:fileList bizCode="cs001" bizId="1" id="testTableFileList" isClass="true" proportion="12%,21%,12%,21%,10%,22%"/>
			<x:title name="group" title="三、出让人信息" hideIndex="3"  hideTable="#table_03"/>
			<table class='tableInput' style="width: 99%;" id="table_03">
					<x:inputTD name="supplierName" required="false" label="出让人"
						maxLength="128" />
					<x:inputTD name="contactUnit" required="false" label="联系单位"
						maxLength="128" />
					<x:inputTD name="contactTel" required="false" label="联系电话"
						maxLength="64" />
				</tr>
				<tr>
					<x:inputTD name="contactAddress" required="false" label="地址联系"
						maxLength="64" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="depositUnit" required="false" label="开户单位"
						maxLength="128" />
					<x:inputTD name="depositBank" required="false" label="开户行"
						maxLength="128" />
					<x:inputTD name="depositBankAccount" required="false" label="开户账号"
						maxLength="64" />
				</tr>
				<tr>
					<x:inputTD name="transactionInfo" required="false" label="交易时间及办法"
						maxLength="128" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="paymentInfo" required="false" label="付款方式及期限"
						maxLength="128" colspan="5" />
				</tr>
			</table>
			<x:title name="group" title="四、交易信息" hideIndex="4" hideTable="#table_04"/>
			<table class='tableInput' style="width: 99%;" id="table_04">
					<x:inputTD name="transactionStatus" required="false" label="成交状态"
						maxLength="22" />
					<x:inputTD name="transactionTime" required="false" label="成交时间"
						maxLength="22" wrapper="date" />
					<x:inputTD name="transactionPrice" required="false" label="成交价"
						maxLength="22" />
				</tr>
				<tr>
					<x:inputTD name="transactionAddress" required="false" label="交易地点"
						maxLength="128" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="buyer" required="false" label="竞得方"
						maxLength="128" colspan="5" />
				</tr>
			</table>
			<x:title name="group" title="五、其他信息" hideIndex="5" hideTable="#table_05"/>
			<table class='tableInput' style="width: 99%;" id="table_05">
					<x:inputTD name="addressRequirement" required="false"
						label="地点和具体要求" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="accessIndustryKind" required="false"
						label="准入产业类型" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="developDegree" required="false" label="开发程度"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="supplyLandCondition" required="false" label="供地条件"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="buyerCondition" required="false" label="竞买人条件"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="landRemarkCondition" required="false"
						label="地块备注相关要求条件" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="economicalHousingConfig" required="false"
						label="保障房配建情况" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="boundaryAra" required="false" label="四至范围"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="investmentStrength" required="false" label="投资强度"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="currentSituationLandConditi" required="false"
						label="现状土地条件" maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="adminAllocated" required="false" label="行政划拨"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="programme" required="false" label="日程安排"
						maxLength="256" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="remark" required="false" label="备注"
						maxLength="256" colspan="5" />
				</tr>
			</table>
		</form>
	</div>

</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/BusinessRegistrationDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">工商登记信息</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;" id="detailTable">
					<x:layout />
					<tr>
						<x:hidden name="id" id="detailId" />
						<x:hidden name="organId" />
						<x:inputTD name="companyName" required="true" label="公司全称"
							maxLength="64" id="detailCompanyName" />
						<x:inputTD name="companyCode" required="false" label="公司简码"
							maxLength="32" id="detailCompanyCode" />
						<x:inputTD name="licenseNumber" required="false" label="营业执照号码"
							maxLength="32" />
					</tr>
					<tr>
						<x:inputTD name="organizationCode" required="false"
							label="组织机构代码证" maxLength="32" />
						<x:inputTD name="registeredFund" required="false" label="注册资金（万元）"
							maxLength="22" />
						<x:inputTD name="registrationPlace" required="false" label="注册地"
							maxLength="128" />
					</tr>
					<tr>
						<x:inputTD name="legalPerson" required="false" label="法定代表人"
							maxLength="50" />
						<x:inputTD name="shareholder" required="false" label="股东"
							maxLength="100" />
						<x:inputTD name="proportion" required="false" label="持股比例"
							maxLength="32" />
					</tr>
					<tr>
						<x:inputTD name="chairman" required="false" label="董事长或执行董事"
							maxLength="100" />
						<x:inputTD name="director" required="false" label="董事"
							maxLength="100" />
						<x:inputTD name="supervisor" required="false" label="监事"
							maxLength="100" />
					</tr>
					<tr>
						<x:inputTD name="generalManager" required="false" label="总经理"
							maxLength="100" />
						<x:inputTD name="executive" required="false" label="高管"
							maxLength="100" />
						<x:inputTD name="allotedTime" required="false" label="营业期限"
							maxLength="32" />
					</tr>
					<tr>
						<x:selectTD name="companyKind" required="true" label="公司类型"/>
						<x:inputTD name="remark" required="false" label="备注" maxLength="512" colspan="2" />
						<td class="title" style="padding-left: 10px"><x:checkbox name="isOurCompany" label="内部单位" value="1"/></td>
					</tr>
				</table>
			</form>
			<div class="blank_div"><x:select name="registrationUserKind" cssStyle="display:none;" id="mainRegistrationUserKind" emptyOption="false"/></div>
			<x:fileList bizCode="BusinessRegistration" bizId="id"  id="businessRegistrationFileList" />
			<div class="blank_div"></div>
			<table style="width: 99%;">
				<x:layout proportion="35%,65%" />
				<tr><td colspan="2" style="color:red;">内部人员信息记录的是公司内部员工在工商登记单位担任职务的信息</td></tr>
				<tr>
					<td>
						<x:title title="内部人员信息"  name="group"/>
						<div id="personGrid" style="margin-right: 2px;"></div>
					</td>
					<td>
						<x:title title="变更历史"  name="group"/>
						<div id="historyGrid" style="margin-left: 2px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>

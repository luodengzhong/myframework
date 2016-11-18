<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/EstateQualificationDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">房地产资质台账</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;" id="detailTable">
					<x:layout />
					<tr>
						<x:hidden name="id" id="detailId" />
						<x:hidden name="organId" />
						<x:inputTD name="companyName" required="true" label="公司全称" maxLength="64" id="detailCompanyName" />
						<x:inputTD name="companyCode" required="true" label="公司简称" maxLength="32" id="detailCompanyCode" />
						<x:inputTD name="qualificationCredential" required="false" label="资质等级" maxLength="16" />
					</tr>
					<tr>
						<x:inputTD name="qualificationNum" required="false" label="资质证号" maxLength="16" />
						<x:inputTD name="grantStartDate" required="false" label="准予房地产开发的时间" wrapper="date"/>
						<x:inputTD name="grantEndDate" required="false" label="有效期" wrapper="date"/>
					</tr>
					<tr>
						<x:inputTD name="issueDate" required="false" label="发证时间" wrapper="date"/>
						<x:inputTD name="currentSituation" required="false" label="现状" maxLength="50" />
						<x:inputTD name="creditCard" required="false" label="网上申报资质用户名" maxLength="32" />
					</tr>
					<tr>
						<x:inputTD name="constructionNum" required="false" label="网上申报资质密码" maxLength="32" />
						<x:inputTD name="remark" required="false" label="备注" maxLength="200" colspan="3" />
					</tr>
					<tr>
						<x:textareaTD name="developmentProject"  label="对应的开发项目" maxLength="400" colspan="5" rows="3"/>
					</tr>
				</table>
			</form>
			<div class="blank_div"></div>
			<x:fileList bizCode="EstateQualification" bizId="id"  id="estateQualificationFileList" />
			<div class="blank_div"></div><div id="historyGrid" style="margin-left: 2px;"></div>
		</div>
	</div>
</body>
</html>

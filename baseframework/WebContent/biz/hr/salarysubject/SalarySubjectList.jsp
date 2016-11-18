<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,combox,tree" />

<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/hr/salarysubject/SalarySubject.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="setbookId" />
			<x:hidden name="setbookName" />
			<x:hidden name="orgRoot" />
			<x:hidden name="subRoot" />
			<x:hidden name="budgetTreeParentId"/>
			<div id="layout">
				<div position="left" title="费用帐套" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divOrgTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" id="layoutCenter" style="overflow-y: hidden;">
						<div id="budgetSubject">
							<x:title title="预算主体与组织" hideTable="queryDiv1" />
							<form method="post" action="" id="queryBudgetMainForm">
								<div class="ui-form" id="queryDiv1" style="width: 800px;">
									<x:hidden name="budgetsubjectId" />
									<x:hidden name="orgId" />
									<x:inputL name="budgetsubjectName" required="false"
										label="预算主体" wrapper="select" />
									<x:inputL name="orgName" required="false" label="人力组织"
										wrapper="select" />
									<dl>
										<x:button value="查 询" onclick="query(this.form)" />
										&nbsp;&nbsp;
										<x:button value="重 置" onclick="resetForm(this.form)" />
										&nbsp;&nbsp;
									</dl>
								</div>
							</form>
							<div class="blank_div"></div>
							<div id="maingridBudget" style="clear: both; margin: 2px;"></div>
						</div>
						<div id="salaryItem">
							<x:title title="科目与薪资栏目" hideTable="queryDiv" />
							<form method="post" action="" id="querySalaryMainForm">
								<div class="ui-form" id="queryDiv" style="width: 800px;">

									<x:hidden name="subjectId" />
									<x:hidden name="salaryItemsId" />
									<x:inputL name="subjectName" required="false" label="预算科目"
										wrapper="select" />
									<!--<x:selectL name="wageAffiliation" required="false" label="归属"
							maxLength="50" />-->
									<x:inputL name="salaryItems" required="false" label="工资栏目"
										maxLength="20" cssClass="text combox_button textSearch" />
									<dl>
										<x:button value="查 询" onclick="query(this.form)" />
										&nbsp;&nbsp;
										<x:button value="重 置" onclick="resetForm(this.form)" />
										&nbsp;&nbsp;
									</dl>
								</div>
							</form>
							<div class="blank_div"></div>
							<div id="maingridSalary" style="clear: both; margin: 2px;"></div>
						</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>

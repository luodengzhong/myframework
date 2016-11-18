<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox,date" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/archivesWageOrg/ArchivesWageOrg.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="人员列表">
					<div class="ui-form" style="width: 900px;">
						<dl>
							<dt style="width:70px">查询类别:&nbsp;&nbsp;</dt>
							<dd style="width: 230px" id="queryRadioRangeDD">
								<label><input type="radio" name="radioRange"  checked="true" value="1"  id="queryRadioRange"/>&nbsp;按异动信息查询</label>
								<label><input type="radio" name="radioRange"  value="2" />&nbsp;按档案查询</label>
							</dd>
						</dl>
						<x:hidden name="fullId" id="mainFullId"/>
						<x:inputL name="year" required="false" label="业务年"  labelWidth="60" width="80" spinner="true" mask="nnnn"/>
						<x:hidden name="periodId" id="mainPeriodId"/>
						<x:inputL name="yearPeriodName" required="true" label="期间" wrapper="select" labelWidth="40" width="250" />
						<x:hidden name="fillinBeginDate" id="mainFillinBeginDate" type="date"/>
						<x:hidden name="fillinEndDate" id="mainFillinEndDate" type="date"/>
					</div>
					<x:title title="搜索" hideTable="queryDiv" />
					<div class="ui-form" id="queryDiv" style="width: 900px;">
						<div id="queryMainFormDiv">
						<form method="post" action="" id="queryMainForm">
							<x:inputL name="staffName" label="姓名" maxLength="16" labelWidth="80" />
							<x:inputL name="fillinBeginDate" required="true" label="异动日期起" wrapper="date" labelWidth="80" />
							<x:inputL name="fillinEndDate" required="true" label="异动日期止" wrapper="date"  labelWidth="80" />
							<x:inputL name="fromPosDesc" label="异动前组织" maxLength="16" labelWidth="80" />
							<x:inputL name="toPosDesc" label="异动后组织" maxLength="16" labelWidth="80" />
							<div class="clear"></div>
							<x:hidden name="reshuffleWageOrgId"/>
							<x:inputL name="reshuffleWageOrgName" label="工资主体" required="true" maxLength="16" labelWidth="80"  wrapper="select"/>
							<dl>
								<x:button value="查 询" onclick="query(1)" />&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(1)" />&nbsp;&nbsp;
							</dl>
						</form>
						</div>
						<div id="queryArchivesFormDiv" style="display: none;">
						<form method="post" action="" id="queryArchivesForm">
							<x:inputL name="staffName" label="姓名" maxLength="16" labelWidth="70" />
							<x:inputL name="idCardNo" label="身份证号" maxLength="20" labelWidth="70" />
							<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
							<x:inputL name="state" label="状态" labelWidth="60"/>
							<x:inputL name="orgInfo" label="组织信息" maxLength="16" labelWidth="70" />
							<dl>
								<dd style="width:220px;">&nbsp;&nbsp;
									<x:checkbox name="isProbationCheck" label="试用期员工" value="1"/>&nbsp;&nbsp;
									<x:checkbox name="isLeaveCheck" label="离职办理中" value="1"/>
									<x:select name="tempStaffingPostsRank"  dictionary="staffingPostsRank" cssStyle="display:none;"/>
								</dd>
							</dl>
							<div class="clear"></div>
							<dl>
								<dt style="width:70px;">工资主体:</dt>
								<dd style="width:60px;"><x:select name="wageOrgSymbol"  list="#{'eq':'等于','noteq':'不等于'}" /></dd>
								<dd style="width:180px;">
									<x:hidden name="archivesWageOrgId"/>
									<x:input name="archivesWageOrgName" label="工资主体"  wrapper="select"/>
								</dd>
							</dl>
							<dl>
								<x:button value="查 询" onclick="query(2)" />&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(2)" />&nbsp;&nbsp;
							</dl>
						</form>	
						</div>
					</div>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>

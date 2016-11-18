<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/archives/Archives.js"/>' type="text/javascript"></script>
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
					<x:title title="搜索" hideTable="queryDiv" />
					<x:hidden name="mainFullId"/>
					<x:hidden name="mainOrganId"/>
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 950px;">
							<x:inputL name="staffName" label="姓名" maxLength="16" labelWidth="70" />
							<x:inputL name="idCardNo" label="证件号" maxLength="20" labelWidth="70" />
							<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
							<x:inputL name="state" label="状态" labelWidth="60"/>
							<x:inputL name="orgInfo" label="组织信息" maxLength="16" labelWidth="70" />
							<x:selectL name="staffingLevel" label="编制类别" labelWidth="70" />
							<dl>
								<dd style="width:220px;">&nbsp;&nbsp;
									<x:checkbox name="isProbationCheck" label="试用期员工" value="1"/>&nbsp;&nbsp;
									<x:checkbox name="isLeaveCheck" label="离职办理中" value="1"/>
									<x:select name="tempStaffingPostsRank"  dictionary="staffingPostsRank" cssStyle="display:none;"/>
								</dd>
							</dl>
							<x:inputL name="staffingPostsRank" label="职级" maxLength="20" labelWidth="70" />
							<x:inputL name="staffingPostsRankSequence" label="职级序列" maxLength="20" labelWidth="70"  wrapper="select"/>
							<x:hidden name="responsibilitiyId"/>
							<x:inputL name="responsibilitiyNames" label="职能" maxLength="20" labelWidth="60"  wrapper="select"/>
							<div class="clear"></div>
							<dl>
								<dt style="width:70px;">行政级别:</dt>
								<dd style="width:60px;"><x:select name="posLevelSymbol"  list="#{'gt':'大于','eq':'等于','lt':'小于'}" /></dd>
								<dd style="width:100px;"><x:select name="posLevel" /></dd>
							</dl>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>

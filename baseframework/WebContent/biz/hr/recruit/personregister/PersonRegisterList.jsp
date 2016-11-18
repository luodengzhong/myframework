<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,layout" />
<script
	src='<c:url value="/biz/hr/recruit/personregister/PersonRegisterList.js?a=1"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="简历类别" id="mainmenu">
					<x:hidden name="parentId" id="treeParentId" />
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="infoTypeTree"></ul>
					</div>
				</div>
				<div position="center">
					<div id="layout01" >
						<div position="left" title="组织机构" >
						<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="orgTreeDiv">
							<ul id="maintree"></ul>
							</div>
						</div>
						<div position="center" title="简历列表" id="listCenter">
							<x:title title="简历列表" hideTable="queryDiv" />
							<x:hidden name="writeId" />
							<x:hidden name="hunterId" />
							<x:select name="recruitWay" id="recruitWay"
								cssStyle="display:none;" emptyOption="false" />
							<x:select name="choicePlace" id="choicePlace"
								cssStyle="display:none;" emptyOption="false" />
                            <x:select name="maritalStatus" id="maritalStatus"
 								cssStyle="display:none;" emptyOption="false" />
							<form method="post" action="" id="queryMainForm">
								<div class="ui-form" id="queryDiv" style="width: 900px;">
									<x:inputL name="applyPosName" required="false" label="应聘岗位名称"
										maxLength="64" />
									<x:inputL name="staffName" required="false" label="姓名"
										maxLength="32" />
									<x:inputL name="idCardNo" required="false" label="身份证号"
										maxLength="20" />
									<x:selectL name="education" required="false" label="最高学历"
										maxLength="2" />
									<x:selectL name="englishLevel" required="false" label="英语程度"
										maxLength="2" />
									<x:inputL name="height" required="false" label="身高(cm)"
										maxLength="8" />
									<dl>
										<p>以上</p>
									</dl>
									
									<x:selectL name="sourceType" required="false" label="应聘来源"
										maxLength="22" dictionary="recruitWay" />
									<x:selectL name="recruitResult" required="false" label="应聘结果" />
									<x:inputL name="registerDate" required="false" label="填表时间"  wrapper="date" />


									<dl>
										<dd>
						               <x:checkbox  name="checkvalue"  label="查询当前公司简历"   checked="true" />
						              </dd>
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
		</div>
	</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/setup/payItemRule.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;height:250px;">
						<div style="margin: 2px;padding-left:20px;"><a href="javascript:onFolderTreeNodeClick()" class="GridStyle">默认规则</a></div>
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="计算规则">
					<form method="post" action="" id="submitForm">
					<table class='tableInput' style="width: 99%;margin: 2px;margin-top:3px;">
						<x:hidden name="id" />
						<x:hidden name="defVisible" />
						<x:hidden name="itemId" />
						<x:hidden name="organId" />
						<x:layout proportion="90px,340px"/>
						<tr style="height:32px;">
							<x:radioTD name="visible" label="是否显示" dictionary="yesOrNo" value="1"/>
						</tr>
						<tr>
							<td colspan="2">
								<x:textarea name="ruleContent" label="计算规则" rows="14"/>
							</td>
						</tr>
					</table>
					</form>
				</div>
			</div>
		</div>
	</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/institution/InstitutionTree.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="制度结构树" >
					<div style="overflow-x: auto; overflow-y: auto; width: 100%;height: 450px" id="oaInstitution">
						<ul id="oaInstitutionTree"></ul>
					</div>
				</div>
				<div position="center" title="制度树节点信息" style="overflow-y: auto;">
					<div position="top" style="margin: 2px; margin-right: 3px;">
					<div class="ui-panelBar" id='taskBar'>
						<ul>
							<li id="insertInstitutionTree"><a href="javascript:void(0);"
												class="add"><span>添加</span></a></li>
							<li class="line"></li>
							<li id="updateInstitutionTree"><a href="javascript:void(0);"
															   class="edit"><span>修改</span></a></li>
							<li class="line"></li>
							<li id="deleteInstitutionTree"><a href="javascript:void(0);" class="delete"><span>删除</span></a>
							</li>
							<li class="line"></li>
							<li id="enableInstitutionTree"><a href="javascript:void(0);" class="syn"><span>启用</span></a>
							</li>
							<li class="line"></li>
							<li id="disableInstitutionTree"><a href="javascript:void(0);" class="stop"><span>禁用</span></a>
							</li>
							<li class="line"></li>
                            <li id="moveInstitutionTree"><a href="javascript:void(0);"
                                                            class="move"><span>移动</span></a></li>
						</ul>
					</div>
				</div>
				<div position="center">
					<table class='tableInput' id='queryTable'style="margin: 2px;width:99%;">
						<tr>
							<x:inputTD name="name" id="treename" readonly="true"
									required="false" disable="true" label="名称" maxLength="22"/>
							<x:radioTD name="status" list="statusList" id="treestatus" required="false"
									label="状态" maxLength="22" disabled="true"/>
							
						</tr>
						<tr>
							<x:selectTD name="opfunctionCode" required="false" id="treeopfunctionCode" label="系统模块"
										maxLength="22" readonly="true" list="opfunctionList"/>
							<x:inputTD name="sequence" required="false" id="treesequence" label="序列号"
										maxLength="22" readonly="true"/>
						</tr>
					</table>
					<x:hidden name="institutionTreeId"/>
					<x:hidden name="kind"/>
					<div id="reviseAuthorityGrid" style="clear: both; margin: 2px;"></div>
					<div id="readAuthorityGrid" style="clear: both; margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
	</div>
</body>
</html>
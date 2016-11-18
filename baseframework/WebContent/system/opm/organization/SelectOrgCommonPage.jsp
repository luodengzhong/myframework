<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id="mainPanel">
	<div id="divMain" style="margin-top: 10px;">
		<table cellpadding="0" cellspacing="0">
			<tr>
				<td colspan="3">
					<div class="ui-simple-tab" id="chooseTabs">
						<div class="ui-tab-links" style="border-bottom: 0px;">
							<ul style="left: 20px;">
								<li class="current" divId="chooseByOrgDiv">
									<img src='<c:url value="/themes/default/images/org/org.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;组织
								</li>
								<li divId="chooseByGroup">
									<img src='<c:url value="/themes/default/images/org/group.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;分组
								</li>
								<li divId="chooseByQuery">
									<img src='<c:url value="/themes/default/images/icons/list_users.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;人员查询
								</li>
							</ul>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td style="font-size: 13px; font-weight: bold; padding-bottom: 4px;">
					组织机构树：
				</td>
				<td></td>
				<td><span style="font-size: 13px; font-weight: bold; padding-bottom: 4px;" id="selectedOrgTitle">已选组织：</span></span></td>
			</tr>
			<tr>
				<td colspan="3" style="padding-left: 5px;">
					<div id="checkBoxDiv">
						<label style="font-weight: normal; line-height: 22px;"> <input type="checkBox" id="chooseChildCheck" style="margin-top: -2px;">&nbsp;&nbsp;级联选择</label>
						<label style="font-weight: normal; line-height: 22px;"> <input type="checkBox" id="showVirtualOrg" style="margin-top: -2px;">&nbsp;&nbsp;显示虚拟组织</label> 
						<label style="font-weight: normal; line-height: 22px;"> <input type="checkBox" id="showPosition" style="margin-top: -2px;">&nbsp;&nbsp;显示岗位</label>
					</div>
					<div id="queryConditionDiv" class="ui-form" style="display:none;white-space: nowrap;overflow: hidden;margin-top: -2px;">
						<form method="post" action="" id="queryConditionForm">
						<x:hidden name="orgId" id="queryConditionOrgId"/>
						<x:hidden name="fullId"  id="queryConditionFullId"/>
						<x:inputL name="orgQueryName" required="false" label="组织" maxLength="32" labelWidth="35" width="110"  wrapper="tree"/>
						<dl style="width:95px"><label style="font-weight: normal; line-height: 22px;"><input type="checkBox" name="isOrgQuery"  value="1" style="margin-top: -2px;">&nbsp;不含下属公司</label></dl>
						<x:selectL name="staffingPostsRank" label="职级>=" labelWidth="55" width="70"/>
						<x:inputL name="keyValue" label="关键字" labelWidth="50" width="85"/>
						<dl><x:button value="查询" onclick="doQueryChoose(this.form)"/></dl>
						</form>
					</div>
				</td>
			</tr>
			<tr>
				<td valign="top" style="width: 280px;">
					<div id="chooseByOrgDiv" class="chooseTypeDiv">
						<div style="height: 25px; position: relative; float: left;*width:155px;">
							<div class="ui-grid-query-div" style="width: 115px; margin-top: 0px; margin-left: 10px;">
								<input type="text" class="ui-grid-query-input" style="top: 0px;" id="ui-grid-query-input" />
								<span class="ui-grid-query-button" id="ui-grid-query-button" title="查询" style="top: 0px;"></span>
							</div>
						</div>
						<div class="clear"></div>
						<div style="width: 280px; height: 258px; border: 1px #eaeaea solid; overflow-y: auto; overflow-x: hidden;">
							<div id="orgQueryGridDiv" style="display: none;">
								<div id="orgQueryGrid"></div>
							</div>
							<div id="orgTreeDiv">
								<ul id="orgTree"></ul>
							</div>
						</div>
					</div>
					<div id="chooseByGroup"
						style="width: 280px; height: 284px; border: 1px #eaeaea solid; overflow-y: auto; overflow-x: hidden; display: none;"
						class="chooseTypeDiv">
						<ul id="userGroupTree"></ul>
					</div>
					<div id="chooseByQuery"
						style="width: 280px; height: 284px;overflow-y: auto; overflow-x: hidden; display: none;"
						class="chooseTypeDiv">
						<div id="chooseByQueryGrid"></div>
					</div>
				</td>
				<td style="width: 80px;">
					<div style="padding-left: 10px;">
						<x:button value="=>" cssStyle="min-width:50px;" id="divAdd" />
						<br /> <br />
						<x:button value="<=" cssStyle="min-width:50px;" id="divDelete" />
					</div>
				</td>
				<td valign="top" style="width: 280px;" id="handlerTd">
					<div style="width: 320px; height: 310px; overflow-y: hidden; overflow-x: hidden;" id="handlerDiv">
						<div id="handlerGrid"></div>
					</div>
				</td>
			</tr>
		</table>
	</div>
</div>

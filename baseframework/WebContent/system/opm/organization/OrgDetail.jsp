<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div position="center" id='tabPage'>
		<div class="ui-tab-links">
			<ul style="left: 10px;">
				<li id="l1" divid="d1">基本信息</li>
				<li id="l2" divid="d2">属性</li>
			</ul>
		</div>

		<div class="ui-tab-content" style="border: 0; padding: 2px;">
			<div id="d1" class="layout" style="height: 270px;">
				<x:hidden name="id"/>
				<x:hidden name="parentId"/>
				<x:hidden name="status"/>
				<x:hidden name="orgKindId"/>
				<x:hidden name="version"/>
				<x:hidden name="fullCode"/>
				<x:hidden name="fullName"/>
				<x:hidden name="fullSequence"/>
				<x:hidden name="fullOrgKindId"/>
				<x:hidden name="typeId" id="typeId"/>
				<x:hidden name="templateId" id="templateId"/>

				<div class='ui-form' id='queryTable' style="width: 500px">
					<div class="row">
						<x:inputL name="code" required="true" label="编码"
								  readonly="false" labelWidth="80" width="200" id="detailCode"/>
						<x:button value="..." onclick="showSelectOrgTypeDialog()"
								  id="btnSelectOrgType" cssStyle="min-width:30px;"/>
						<x:button value="..." onclick="showSelectOrgTempalteDialog()"
								  id="btnSelectOrgTemplate" cssStyle="min-width:30px;"/>
					</div>
					<div class="row">
						<x:inputL name="name" required="true" label="名称"
								  readonly="false" labelWidth="80" width="250" id="detailName"/>
					</div>
					<div class="row">
						<x:inputL name="longName" id="longName" required="false" label="全名称"
								  readonly="false" labelWidth="80" width="250"/>
					</div>
					<div class="row" id="divIsCenter">
						<x:inputL name="isCenter" required="false" label="是否中心" id="isCenter" labelWidth="80"
								  width="250"/>
					</div>
					<div class="row" id="divIsVirtual">
						<x:inputL name="isVirtual" required="false" label="是否虚拟组织" id="isVirtual" labelWidth="80"
								  width="250"/>
					</div>
					<div class="row">
					<x:inputL name="sequence" required="false" label="排序号" readonly="false" labelWidth="80"
								  width="250"/>
					</div>
					<div class="row">
						<x:inputL name="orgKindName" required="false" label="组织类型"
								disabled="true"  labelWidth="80" width="250"/>
					</div>
					<div class="row">
						<x:textareaL name="description" required="false" label="描述"
									 readonly="false" rows="3" labelWidth="80" width="250"></x:textareaL>
					</div>
				</div>

			</div>
		</div>
		<div class="ui-tab-content" style="border: 0; padding: 2px;">
			<div id="d2" class="layout" style="margin: 2px;">
				<div id="propertyGrid"></div>
			</div>
		</div>
	</div>
</form>


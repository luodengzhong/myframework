<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="baseSegmentationTypeId"/>
	<x:hidden name="folderId"/>
	<div class='ui-form'>
		<div class="row">
			<x:inputL name="code" required="true" label="编码" readonly="false" labelWidth="100" width="440" />
		</div>
		<div class="row">
			<x:inputL name="name" required="true" label="名称" readonly="false" labelWidth="100" width="440" />
		</div>
		<div class="row">
			<x:inputL name="sequence" required="false" label="排序号" readonly="false" spinner="true" mask="nnn" dataoptions="min:1" labelWidth="100"
				width="180" />
		</div>
	</div>
</form>
<div id="detailGrid" style="margin: 2px;"></div>
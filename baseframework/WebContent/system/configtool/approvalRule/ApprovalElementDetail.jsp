<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:320px;">
		<x:hidden name="id"/>
		<div class="row">
		<x:inputL name="code" required="true" label="编码" maxLength="64" labelWidth="80" width="210"/>		
		</div>
		<div class="row">
		<x:inputL name="name" required="true" label="名称" maxLength="128" labelWidth="80" width="210"/>		
		</div>
		<div class="row">
		<x:radioL name="kindId" list="kindList" required="false" label="类别" labelWidth="80"></x:radioL>
		</div>
		<div class="row">
		<x:selectL name="dataSourceId"  list="dataSourceList" required="true" emptyOption="false" label="数据源" maxLength="22" labelWidth="80" width="210"></x:selectL>
		</div>
		<div class="row">
		<x:textareaL name="dataSourceConfig" required="false" label="数据源配置"  rows="3" labelWidth="80" width="210"></x:textareaL>	
		</div>
		<div class="row">
		<x:inputL name="sequence" required="false" label="排序号" maxLength="22" labelWidth="80" width="210"
		spinner="true" mask="nnn" dataoptions="min:1"/>		
		</div>
	</div>
</form>

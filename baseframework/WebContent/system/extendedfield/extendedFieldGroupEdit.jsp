<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="groupId" />
		<x:inputL name="code" required="true" label="分组编码" maxLength="32" />
		<x:inputL name="name" required="true" label="分组名称" maxLength="64" />
		<x:radioL list="#{'1':'是','0':'否'}" name="visible" value="1"
			label="是否显示" />
		<x:inputL name="businessCode" required="true" label="业务编码"
			maxLength="22" id="detilBusinessCode" />
		<x:inputL name="cols" required="true" label="列数" maxLength="22"
			spinner="true" mask="n" dataOptions="min:1,max:9" />
		<x:inputL name="sequence" required="true" label="序号" spinner="true"
			mask="nnn" dataOptions="min:1" />
		<x:radioL list="#{'1':'表格','0':'DIV'}" name="showModel" value="1" label="显示模式" />
		<x:inputL name="tableLayout" required="false" label="表格显示布局" maxLength="64" />
		<div class="clear"></div>
		<x:inputL name="modelFilePath" required="false" label="模型文件路径" maxLength="64" width="456"/>
		<x:inputL name="entityName" required="false" label="实体名" maxLength="32" />
		<x:inputL name="remark" label="备注" maxLength="512" colspan="5" width="742"/>
	</div>
</form>
<div id="extendedFieldGrid" style="margin: 2px;"></div>

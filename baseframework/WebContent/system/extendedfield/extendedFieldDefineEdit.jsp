<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 860px;">
		<div class="ui-form-container">
			<div class="row">
				<x:hidden name="defineId" />
				<x:inputL name="fieldEname" required="true" label="字段英文名称"
					maxLength="30" />
				<x:inputL name="fieldCname" required="true" label="字段中文名称"
					maxLength="64" />
				<x:selectL
					list="#{'1':'string','2':'number','3':'date','4':'datetime','5':'bool'}"
					value="1" name="fieldType" label="字段类型" required="true"
					emptyOption="false" />
			</div>
			<div class="row">
				<x:inputL name="fieldLength" label="字段长度" maxLength="22" mask="nnn" />
				<x:inputL name="fieldPrecision" label="字段精度" maxLength="22" mask="nn" />
                <dl><dt></dt><dd><x:checkbox name="newLine" label="在新行显示" value="1" /></dd></dl>
			</div>
			<div class="row">
				<x:inputL name="controlWidth" label="控件宽度" maxLength="22" mask="nnn" />
				<x:inputL name="labelWidth" label="标签宽度" maxLength="22" mask="nnn" />
				<x:inputL name="colSpan" label="跨列" maxLength="22" mask="nn" />
			</div>
			<div class="row">
				<x:inputL name="defaultValue" label="默认值" maxLength="50" />
				<x:inputL name="minValue" label="最小值" maxLength="18" />
				<x:inputL name="maxValue" label="最大值" maxLength="18" />
			</div>
			<div class="row">
				<x:selectL
					list="#{'1':'textbox','2':'combobox','3':'spinner','4':'date','5':'datetime','6':'radio','7':'checkbox','8':'select','9':'lookUp','10':'treebox'}"
					value="1" id="editControlType" name="controlType" required="true"
					label="控件类型" emptyOption="false" />
				<x:selectL list="#{'1':'无','2':'集合','3':'数据字典','4':'JSON'}"
					value="1" name="dataSourceKind" label="数据源类型" emptyOption="false"
					readonly="true" id="editDataSourceKind" />
			</div>
			<div class="row">
				<x:radioL list="#{'1':'是','0':'否'}" name="nullable" value="1"
					label="是否允许为空" />
				<x:radioL list="#{'1':'是','0':'否'}" name="readOnly" value="0"
					label="是否只读" />
				<x:radioL list="#{'1':'是','0':'否'}" name="visible" value="1"
					label="是否显示" />
			</div>
			<div class="row">
				<x:textareaL name="dataSource" label="数据源" maxLength="1000" rows="5"
					width="310" />
				<x:textareaL name="remark" label="备注" maxLength="512" rows="5"
					width="310" />
			</div>
		</div>
	</div>
</form>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<COLGROUP><COL width='18%'/><COL width='32%'/><COL width='18%'/><COL width='32%'/></COLGROUP>
	     <tr>
			<x:hidden name="kindFieldDefineId"/>
			<x:inputTD name="displayName" required="true" label="显示名称" maxLength="64"/>		
			<x:inputTD name="fieldName" disabled="true" label="数据库字段名" maxLength="32"/>		
		</tr>
		<tr>
			<x:inputTD name="fieldType" disabled="true" label="字段类型" maxLength="32"/>		
			<x:inputTD name="fieldLength" required="false" label="字段长度" maxLength="22"/>		
		</tr>
		<tr>
			<x:inputTD name="fieldMask" required="false" label="格式化样式" maxLength="16"/>		
			<x:selectTD dictionary="yesorno" name="isRequired" required="false" label="是否必填" maxLength="1"/>	
		</tr>
		<tr>	
			<x:selectTD dictionary="yesorno"  name="visible" required="false" label="是否显示" maxLength="1"/>		
			<x:selectTD dictionary="yesorno"  name="readOnly" required="false" label="是否只读" maxLength="1"/>		
		</tr>
		<tr>
			<x:selectTD dictionary="yesorno"  name="newLine" required="false" label="新行显示" maxLength="1"/>		
			<x:inputTD name="colSpan" required="false" label="跨行数" maxLength="22" mask="n"/>		
		</tr>
		<tr>
			<x:inputTD name="controlType" required="true" label="控件类型" maxLength="32"/>		
			<x:inputTD name="dataSourceKind" required="false" label="数据源类型" maxLength="32"/>
		</tr>
		<tr>		
			<x:inputTD name="dataSource" required="false" label="数据源" maxLength="2000" colspan="3"/>	
		</tr>	
		<tr>
			<x:selectTD dictionary="yesorno"  name="isCondition" required="false" label="是否查询条件" maxLength="1"/>		
			<x:selectTD dictionary="yesorno"  name="isShow" required="false" label="是否查询显示" maxLength="1"/>	
	     </tr>
	</table>
</form>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="queryForm">
	<div class="ui-form" >
		<dl><dd style="color: #aaaaaa;width:100%;">多个关键词请用空格分开；可选【级联匹配】或【模糊匹配】俩种查询方式；</dd></dl>
		<x:inputL name="documentName" required="false" label="文档名称" labelWidth="70" width="210" title="多个关键词请用空格分开"/>	
		<dd style="width: 100px;padding-top: 3px;">
			<select name="documentNameModel" id="queryDocumentNameModel">
				<option value="and" selected="true">级联匹配</option>
				<option value="or">模糊匹配</option>
			</select>
		</dd>
		<div class="clear"></div>
		<x:inputL name="keyValue" required="false" label="关键字"  labelWidth="70" width="210" title="多个关键词请用空格分开"/>	
		<dd style="width: 100px;padding-top: 3px;">
			<select name="keyValueModel" id="queryKeyValueModel">
				<option value="and" selected="true">级联匹配</option>
				<option value="or">模糊匹配</option>
			</select>
		</dd>
		<div class="clear"></div>
		<x:inputL name="createByName" required="false" label="创建人" maxLength="60" labelWidth="70" width="120"/>
		<x:inputL name="lastModifName" required="false" label="修改人" maxLength="60" labelWidth="60" width="120"/>
		<div class="clear"></div>
		<dl>
			<dt style="width: 70px;">创建日期&nbsp;:</dt>
			<dd style="width:130px">
				<x:input name="createBeginDate" required="false" label="时间起" wrapper="date" />
			</dd>
			<dd style="width:130px">
				<x:input name="createEndDate" required="false" label="时间止" wrapper="date" />
			</dd>
		</dl>
		<div class="clear"></div>
		<dl>
			<dt style="width: 70px;">修改日期&nbsp;:</dt>
			<dd style="width:130px">
				<x:input name="modifBeginDate" required="false" label="时间起" wrapper="date" />
			</dd>
			<dd style="width:130px">
				<x:input name="modifEndDate" required="false" label="时间止" wrapper="date" />
			</dd>
		</dl>						
	</div>
</form>
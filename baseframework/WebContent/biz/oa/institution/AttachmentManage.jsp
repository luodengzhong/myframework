<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id="inst" style='display:none'><div class="blank_div"></div>
	<x:fileList bizCode="OACurrentInstAttachment" isClass="true" bizId="id" id="instFileList" proportion="12%,88%"/>
</div>
<div id="proc" style='display:none'><div class="blank_div"></div>
	<x:fileList bizCode="OACurrentProcAttachment" isClass="true" bizId="id" id="instProcFileList" proportion="12%,88%"/>
</div>
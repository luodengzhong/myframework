<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 300px;">
		<x:hidden name="postsRankSequenceId" />
		<x:hidden name="organId" />
		<x:inputL name="code" required="true" label="编码" maxLength="8"
			labelWidth="60" width="200" />
		<x:inputL name="name" required="true" label="名称" maxLength="8"
			labelWidth="60" width="200" />
		<x:selectL name="staffingPostsRank" required="true" label="职级"
			labelWidth="60" width="200" />
		<x:inputL name="sequence" required="true" label="序号" mask="999"
			labelWidth="60" width="200" />
		<x:inputL name="weight" required="true" label="权重" mask="9999"
			labelWidth="60" width="200" />
	</div>
</form>

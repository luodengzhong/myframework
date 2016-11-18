<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree,attachment" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoCenter.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="消息">
					 <div style="height:65px;padding: 5px;padding-top:3px;">
					 	 <div class="row" style="margin-bottom:5px;line-height:25px;">
					 	 	 关键字&nbsp;:
							<div class="ui-grid-query-div" style="width:115px;margin-top:0px;">
			                         <input type="text" class="ui-grid-query-input" id="ui-grid-query-input" style="left:60px;"/>
			                         <span class="ui-grid-query-button" id="ui-grid-query-button" title="查询" style="left:180px;"></span>
			                </div>
		                </div>
	                    <div class="row" id="queryDateRangeDiv">
					 		<x:radioL list="#{'1':'全部','2':'今天','4':'本周','6':'本月'}" name="queryDateRange"  value="1" label="查看近期的消息"/>
						</div>
					 </div>
					 <div id="mainmenu">
						<div title="个人文件夹" class="l-scroll" style="overflow-x: hidden; overflow-y: auto; ">
	                         <ul id="infoKindtree" style="margin-top:3px;"></ul>
	                    </div>
	                    <div title="快速搜索" style="overflow-x: hidden; overflow-y: auto; ">
	                    	<x:title title="我的信息" name="group" hideTable="#myselfInfoSearch" />
	                    	<div style="width: 97%;margin-left:3px; background-color: #fafafa; border: #d0d0d0 1px solid;" id="myselfInfoSearch">
								<div class="taskCenterSearch" queryKind="1">
									<span class="ui-icon-query" style="margin-right: 2px;"></span>未读信息
								</div>
								<div class="taskCenterSearch" queryKind="2">
									<span class="ui-icon-next" style="margin-right: 2px;"></span>我管理的
								</div>
								<div class="taskCenterSearch" queryKind="3">
									<span class="ui-icon-last" style="margin-right: 2px;"></span>我反馈的
								</div>
								<div class="taskCenterSearch" style="border: 0px;" queryKind="4"  id="myselfCollectqueryKind">
									<span class="ui-icon-folder" style="margin-right: 2px;"></span>我的收藏
								</div>
								 <div style="display: none;border-top: #d0d0d0 1px solid;" id="shortcutInfoSearch"></div>
						    </div>
	                    	<x:title title="高级搜索" hideTable="#divConditionArea" id="titleConditionArea" />
	                    	<form method="post" action="" id="queryMainForm">
								<div style="padding: 3px 0px  0px 10px;" id="divConditionArea">
									<div class="row" style="padding-bottom:5px;">
										<x:selectL name="dateRange" id="selectDateRange" list="dateRangeList" emptyOption="false" label="日期范围" width="180" />
									</div>
									<div id="customDataRange" class="row" style="display: none;">
										<x:inputL name="startDate" id="editStartDate" required="false" label="开始日期" wrapper="date" width="180" />
										<x:inputL name="endDate" id="editEndDate" required="false"  label="开始日期" wrapper="date" width="180" />
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<x:selectL name="queryKind" list="selectInfoQueryKind" required="false" label="查询分类" width="180" />
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<x:inputL name="infoKindId" id="selectViewInfoKind" required="false" label="信息分类" width="180" />
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<x:inputL name="keywords" required="false" 	label="在主题、关键字、提交人、编号中搜索" readonly="false" width="180" />
									</div>
									<div class="row">
										<x:button value="查 询" id="btnQuery" onclick="doQueryInfoList(this.form,true)" />
										<x:button value="保存查询方案" id="btnQuery" onclick="saveQueryScheme(this.form)" />
									</div>
									<div class="row">&nbsp;</div>
								</div>
							</form>
	                    </div>
	                    <div title="公司发文搜索" class="l-scroll" style="padding-bottom:0px;overflow-x: hidden; overflow-y: auto; ">
	                         <form method="post" action="" id="dispatchNoQueryForm">
	                         	<div style="padding: 3px 0px  0px 5px;" class="ui-form">
	                         		<div class="row" style="padding-bottom:5px; ">
										<x:inputL name="dispatchNoName"  required="false" label="发文编号" width="130" labelWidth="60" />
								    </div>
	                         		<div class="row" style="padding-bottom:5px; ">
	                         			<x:hidden name="dispatchKindId" />
										<x:inputL name="dispatchKindName" id="selectDispatchKindName" required="false" label="发文类别" width="130" labelWidth="60" wrapper="tree"/>
									</div>
									<div class="row" style="padding-bottom:2px; ">
										<x:title title="发文年份"  name="group"/>
										<input type="radio" name="yearFlag" id="yearFlag1" value="1" checked="true"/><label for="yearFlag1">全部</label>
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<input type="radio" name="yearFlag" id="yearFlag2" value="2"/><label for="yearFlag2">自定义</label>
										<x:input name="yearBegin"  cssStyle="width:60px;" />至
										<x:input name="yearEnd"  cssStyle="width:60px;" />年
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<x:title title="发文号" name="group"/>
										<input type="radio" name="dispatchNoFlag" id="dispatchNoFlag1" value="1" checked="true"/><label for="dispatchNoFlag1">全部</label>
									</div>
									<div class="row" style="padding-bottom:5px; ">
										<input type="radio" name="dispatchNoFlag" id="dispatchNoFlag2" value="2"/><label for="dispatchNoFlag2">自定义</label>
										<x:input name="dispatchNoBegin"  cssStyle="width:60px;" />至
										<x:input name="dispatchNoEnd"  cssStyle="width:60px;" />号
									</div>
									<div class="row" style="padding-bottom:5px;text-align:center; ">
										<x:button value="搜 索" id="btnQuery" onclick="doQueryInfoByDispatchNo(this.form)" />
									</div>
	                         	</div>
	                         </form>
	                    </div>
                     </div>
				</div>
				<div position="center">
					<div id="centerLayout">
						<div position="top" title="消息列表">
							<div id="maingrid"></div>
						</div>
						<div position="center"  style="overflow-x:hidden;overflow-y:auto;" id="previewInfoMainDiv">
							<div id="infoCollectToolBar" style="position:absolute;right:35px;top:2px;display:none"></div>
							<div id="previewInfo" style="margin-bottom: 20px"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
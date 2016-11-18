<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>
  <title>非合同报销</title>
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}

            .brcImg{
			    border-bottom: 1px solid #000000;
            }

            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }

            table.print tr{
               height: 35px;text-align: left;
            }

            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
                width:100px;
            	text-align: left;
            	padding-left:5px;
            	word-break: break-all;word-wrap: break-word;
            }
            table.tableInput{
				font-size:9pt;
				width:100%;
				table-layout:fixed;
				word-wrap:break-word;
                word-break:break-all;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
			}

			table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:15px;
			    vertical-align:middle;
				word-break:break-all;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
			}
            @page {
              size:  210mm 297mm;
              @bottom-right {
                    content: "KJ-A04-01[A/0版]";
              }
           }
        </style>
</head>
<body>
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">
          <h2>${title}</h2>
      </div>
      <div align="right" style="font-weight:bold;">
          <h5>打印计数：${printCount}</h5>
      </div>
      <table cellspacing="0px" cellpadding="0px" class="print">
         <tr>
            <td class="center">主题</td>
            <td class="left" colspan="3">${summary}</td>
            <td class="center">报销编号</td>
            <td class="left">${billCode}</td>
         </tr>
         <tr>
            <td class="center">申请人</td>
            <td class="left">${personMemberName}</td>
            <td class="center">申请部门</td>
            <td class="left">${deptName}</td>
            <td class="center">申请日期</td>
            <td class="left">${fillinDate}</td>
         </tr>
         <tr>
            <td class="center">报销金额</td>
            <td class="left" colspan="5">${expenseAccountAmount}</td>
            <#--<td class="center">冲账金额</td>-->
            <#--<td class="left">${writeOffAmount}</td>-->
            <#--<td class="center">扣款金额</td>-->
            <#--<td class="left">${deductAmount}</td>-->
         </tr>
         <tr>
            <#--<td class="center">应付金额</td>-->
            <#--<td class="left">${payableAmount}</td>-->
            <td class="center">付款单位</td>
            <td class="left" style="WORD-WRAP: break-word;width:30px" colspan="5">${paymentUnitName}</td>
         </tr>
          <tr>
          <td class="center">收款单位</td>
          <td class="left" colspan="5">${supplierName}</td>
          </tr>
         <#--<tr>  -->
            <#--<td class="center">报销单据类型</td>  -->
            <#--<td class="left">${kindName}</td>  -->
            <#--<td class="center">开户银行</td>  -->
            <#--<td class="left">${accountBank}</td>  -->
            <#--<td class="center">银行帐号</td>  -->
            <#--<td class="left">${accountCode}</td>  -->
         <#--</tr>-->
         <#--<tr>  -->
            <#--<td class="center">附件张数</td>  -->
            <#--<td class="left">${attachments}</td>  -->
             <#--<#if travel?? > -->
             	 <#--<td class="center">是否自驾</td>  -->
	             <#--<td class="left">${setupProjectSummary}</td>  -->
	             <#--<td class="center">是否实报实销</td>  -->
            	 <#--<td class="left"></td>  -->
             <#--<#else>-->
	             <#--<td class="center">立项名称</td>  -->
	             <#--<td class="left">${setupProjectSummary}</td>  -->
	             <#--<td class="center">验收名称</td>  -->
	             <#--<td class="left">${acceptanceSummary}</td>  -->
             <#--</#if>-->
            <#---->
         <#--</tr>-->
      <#if travel?? >
      <#else>
         <#--<tr>  -->
            <#--<td class="center">是否实报实销</td>  -->
            <#--<td class="left"></td>  -->
            <#--<td colspan="4"></td>-->
         <#--</tr>-->
     </#if>
         <tr>
            <td class="center">备注</td>
            <td colspan="5" class="left">${remark}</td>
         </tr>
      </table>
      <br/>
    <#if budgetDetail?? && budgetDetail?size gt 0>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">
          <b>直接报销明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td>
      		<td class="center" style="width:15px;"><b>报销人</b></td>
      		<td class="center" style="width:135px;"><b>备注</b></td>
            <td class="center" style="width:30px;"><b>报销期间</b></td>
            <td class="center" style="width:150px;"><b>预算指标项</b></td>
            <td class="center" style="width:40px;"><b>实付金额</b></td>
         </tr>
		<#list budgetDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.costPersonName}</td>
				<td class="center">${detail.remark}</td>
				<td class="center">${detail.xbizName}</td>
				<td class="center">${detail.oname}/${detail.ybizName}</td>
				<td class="center">${detail.approvalAmount}</td>
			</tr>
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>

	<#if budgetDetail1?? && budgetDetail1?size gt 0>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">
          <b>直接报销明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:30px;"><b>报销人</b></td>
      		<td class="center" style="width:20px;"><b>出发城市</b></td>
      		<td class="center" style="width:20px;"><b>到达城市</b></td>
      		<td class="center" style="width:20px;"><b>出发日期</b></td>
      		<td class="center" style="width:20px;"><b>返回日期</b></td>
      		<td class="center" style="width:30px;"><b>差旅补贴标准</b></td>
      		<td class="center" style="width:30px;"><b>差旅补贴金额</b></td>
      		<td class="center" style="width:30px;"><b>交通费</b></td>
            <td class="center" style="width:30px;"><b>应报金额</b></td>
            <td class="center" style="width:30px;"><b>实付金额</b></td>
         </tr>
		<#list budgetDetail1 as detail>
			<tr >
				<td class="center">${detail.costPersonName}</td>
				<td class="center">${detail.beginCity}</td>
				<td class="center">${detail.endCity}</td>
				<td class="center">${detail.sbeginDate}</td>
				<td class="center">${detail.sendDate}</td>
				<td class="center">${detail.travelSubsidyStd}</td>
				<td class="center">${detail.travelSubsidyAmount}</td>
				<td class="center">${detail.travelAmount}</td>
				<td class="center">${detail.shallAmount}</td>
				<td class="center">${detail.approvalAmount}</td>
			</tr>
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>

	  <#if budgetDetail2?? && budgetDetail2?size gt 0>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">
          <b>直接报销明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td>
      		<td class="center" style="width:40px;"><b>报销人</b></td>
      		<td class="center" style="width:40px;"><b>报销期间</b></td>
      		<td class="center" style="width:40px;"><b>预算期间</b></td>
      		<td class="center" style="width:80px;"><b>预算指标项</b></td>
      		<td class="center" style="width:20px;"><b>报销级别</b></td>
      		<td class="center" style="width:30px;"><b>是否自带车</b></td>
            <td class="center" style="width:30px;"><b>应报金额</b></td>
            <td class="center" style="width:30px;"><b>实付金额</b></td>
         </tr>
		<#list budgetDetail2 as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.costPersonName}</td>
				<td class="center">${detail.period}</td>
				<td class="center">${detail.xbizName}</td>
				<td class="center">${detail.oname}/${detail.ybizName}</td>
				<td class="center">${detail.personExpenseLevelName}</td>
				<td class="center"><#if detail.isSelfVehicle == '0'>否<#else>是</#if></td>
				<td class="center">${detail.shallAmount}</td>
				<td class="center">${detail.approvalAmount}</td>
			</tr>
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>

    <#if loanDetail?? && loanDetail?size gt 0>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">
          <b>冲账明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td>
      		<td class="center" style="width:15px;"><b>借款人</b></td>
      		<td class="center" style="width:135px;"><b>摘要</b></td>
            <td class="center" style="width:30px;"><b>借款单号</b></td>
            <td class="center" style="width:150px;"><b>预算指标项</b></td>
            <td class="center" style="width:40px;"><b>冲账金额</b></td>
         </tr>
		<#list loanDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.loanPersonName}</td>
				<td class="center">${detail.summary}</td>
				<td class="center">${detail.billCode}</td>
				<td class="center">${detail.oname}/${detail.ybizName}</td>
				<td class="center">${detail.amount}</td>
			</tr>
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>
      <#if deductDetail?? && deductDetail?size gt 0>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">
          <b>扣款明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td>
      		<td class="center" style="width:150px;"><b>款项名称</b></td>
      		<td class="center" style="width:100px;"><b>扣款类型</b></td>
            <td class="center" style="width:40px;"><b>扣款金额</b></td>
         </tr>
		<#list deductDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.name}</td>
				<td class="center">${detail.deductKindTextView}</td>
				<td class="center">${detail.amount}</td>
			</tr>
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>
      <#if status = 5 >
      <br/>
      <table cellspacing="0px" cellpadding="0px" class="print">
          <tr style="height:30px;color:blue;text-align: center">
              <td>已归档 <#if effectiveDate?? >${effectiveDate}</#if></td>
          </tr>
      </table>
      </#if>
	  <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>
</html>   
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<head>
    <title>付款申请单</title>
    <style type="text/css">
        body {
            font-family: SimSun;
            font-size: 12px;
        }

        .brcImg {
            border-bottom: 1px solid #000000;
        }

        table.print {
            width: 100%;
            table-layout: fixed;
            word-break: break-strict;
            border-left: 1px solid #000000;
            border-top: 1px solid #000000;
        }

        table.print tr {
            height: 35px;
            text-align: left;
        }

        table.print td {
            border-right: 1px solid #000000;
            height: 25px;
            border-bottom: 1px solid #000000;
            word-break: break-all;
            word-wrap: break-word;
        }

        table.print td.center {
            width: 100px;
            text-align: center;
            word-break: break-all;
            word-wrap: break-word;
        }

        table.print td.left {
            width: 100px;
            text-align: left;
            padding-left: 10px;
        }

        table.tableInput {
            font-size: 9pt;
            width: 100%;
            table-layout: fixed;
            word-wrap: break-word;
            word-break: break-all;
            border: 1px solid #000000;
            border-width: 1px 0 0 1px;
        }

        table.tableInput td {
            border: 1px solid #000000;
            border-width: 0 1px 1px 0;
            height: auto;
            min-height: 25px;
            vertical-align: middle;
            word-break: break-all;
            word-wrap: break-word;
        }

        table.tableInput td div.textLabel {
            padding-left: 5px;
        }

        table.detail {
            width: 100%;
            table-layout: fixed;
            word-break: break-strict;
            border-left: 1px solid #000000;
            border-top: 1px solid #000000;
        }

        table.detail tr {
            height: auto;

            text-align: left;
            word-wrap: break-word;;
        }

        table.detail td {
            padding: 3px;
            border-right: 1px solid #000000;
            border-bottom: 1px solid #000000;
            word-wrap: break-word;
            text-align: center;
        }

        @page {
            size: 210mm 297mm;
            @bottom-right {
                content: "";
            }
        }
    </style>
</head>
<body>
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
<div align="center" style="font-weight:bold;">
    <h2>付&nbsp;款&nbsp;申&nbsp;请&nbsp;单</h2>
</div>
<div align="right" style="font-weight:bold;">
    <h5>打印计数：${printCount}</h5>
</div>
<table cellspacing="0px" cellpadding="0px" class="print">
    <tr style="height:30px;color:blue">
        <td class="left" colspan="4"><b>决策信息</b></td>
    </tr>
    <tr>
        <td class="center">付款主题</td>
        <td class="left" colspan="3">${main.subject}</td>
    </tr>
    <tr>
        <td class="center">单据编号</td>
        <td class="left">${main.billCode}</td>
        <td class="center">付款申请日期</td>
        <td class="left">${main.fillinDate}</td>
    </tr>
    <tr>
        <td class="center">合同编号</td>
        <td class="left">${contract.code}</td>
        <td class="center">合同名称</td>
        <td class="left">${contract.name}</td>
    </tr>
    <tr>
        <td class="center">公司名称</td>
        <td class="left">${main.organName}</td>
        <td class="center">部门名称</td>
        <td class="left">${main.deptName}</td>
    </tr>
    <tr>
        <td class="center">申请人</td>
        <td class="left">${main.personMemberName}</td>
        <td class="center">申请类别</td>
        <td class="left">${main.fmPaymentKindTextView}</td>
    </tr>
    <tr>
        <td class="center">申请金额</td>
        <td class="left">${main.amount}</td>
        <td class="center">抵扣款金额</td>
        <td class="left"><#if main.deductionAmount?? >${main.deductionAmount}</#if></td>
    </tr>
    <tr>
        <td class="center">应付款金额</td>
        <td class="left">${main.approveAmount}</td>
        <td class="center">业务类型</td>
        <td class="left">${main.businessKindName}</td>
    </tr>
    <tr>
        <td class="center">款项类型</td>
        <td class="left">${main.paymentItemKindName}</td>
        <td class="center">款项名称</td>
        <td class="left">${main.paymentItemName}</td>
    </tr>
    <tr>
        <td class="center">付款单位</td>
        <td class="left" colspan="3">${main.partyAName}</td>
    </tr>
    <tr>
        <td class="center">收款单位</td>
        <td class="left" colspan="3">${main.partyBName}</td>
    </tr>
    <tr>
        <td class="center">收款银行</td>
        <td class="left" colspan="3">${main.bankName}</td>
    </tr>
    <tr>
        <td class="center">银行帐号</td>
        <td class="left" colspan="3">${main.bankAccount}</td>
    </tr>
    <tr>
        <td class="center">付款说明</td>
        <td class="left" colspan="3">${main.remark}</td>
    </tr>
    <tr>
        <td class="left" colspan="4"><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></td>
    </tr>
</table>
<#if details.contractName?? >
<table cellspacing="0px" cellpadding="0px" class="print">
    <tr style="height:30px;color:blue;font-size:bold;">
        <td class="left" colspan="4">付款申请详情</td>
    </tr>
    <tr>
        <td class="center">审定进度款</td>
        <td class="left">${details.payableAmount}</td>
        <td class="center">奖励</td>
        <td class="left">${details.awardAmount}</td>
    </tr>
    <tr>
        <td class="center">罚款抵扣</td>
        <td class="left">${details.deductAmount}</td>
        <td class="center">本次付款</td>
        <td class="left">${details.payAmount}</td>
    </tr>
    <tr>
        <td class="center">合同签约金额</td>
        <td class="left">${details.contractAmount}</td>
        <td class="center">合同动态金额</td>
        <td class="left">${details.contractDcAmount}</td>
    </tr>
    <tr>
        <td class="center">累计请款</td>
        <td class="left">${details.totalPayAmount}</td>
        <td class="center">累计请款/合同动态</td>
        <td class="left">${details.totalPayAmountRate}%</td>
    </tr>
    <tr>
        <td class="center">累计未付款</td>
        <td class="left">${details.totalUnpaidAmount}</td>
        <td class="center">累计未付款/合同动态</td>
        <td class="left">${details.totalUnpaidAmountRate}%</td>
    </tr>
    <tr>
        <td class="center">累计已付款</td>
        <td class="left">${details.totalPaidAmount}</td>
        <td class="center">累计已付款/合同动态</td>
        <td class="left">${details.totalPaidAmountRate}%</td>
    </tr>
    <tr>
        <td class="center">累计实付款</td>
        <td class="left">${details.totalRealPaidAmount}</td>
        <td class="center">累计实付款/合同动态</td>
        <td class="left">${details.totalRealPaidAmountRate}%</td>
    </tr>
</table>
<br/>
<table cellspacing="0px" cellpadding="0px" class="detail">
    <thead>
    <tr>
        <td style="width: 150px">款项</td>
        <td style="width: 100px">奖惩金额</td>
        <td style="width: 60px">奖惩类型</td>
        <td>备注</td>
    </tr>
    </thead>
    <#list details.deductions as detail>
        <tr>
            <td><#if detail.deductItem?? >${detail.deductItem}</#if></td>
            <td><#if detail.amount?? >${detail.amount}</#if></td>
            <td><#if detail.kindIdTextView?? >${detail.kindIdTextView}</#if></td>
            <td><#if detail.remark?? >${detail.remark}</#if></td>
        </tr>
    </#list>
</table>
</#if>
<br/>
<#if main.status = 5 >
<br/>
<table cellspacing="0px" cellpadding="0px" class="print">
    <tr style="height:30px;color:blue;text-align: center">
        <td>已归档 <#if main.effectiveDate?? >${main.effectiveDate}</#if></td>
    </tr>
</table>
</#if>
<#include "/simple/taskExecutionList.ftl" />
</body>
</html>
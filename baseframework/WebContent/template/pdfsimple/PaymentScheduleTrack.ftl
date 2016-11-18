<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<head>
    <title>合同多次付款动态跟踪表</title>
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

        @page {
            size: 210mm 297mm;
            @bottom-right {
                content: "CB-02-01-26[A/0版版]";
            }
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
            font-size: 9px;
            word-wrap: break-word;;
        }

        table.detail td {
            border-right: 1px solid #000000;
            border-bottom: 1px solid #000000;
            word-wrap: break-word;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
<div align="center" style="font-weight:bold;">
    <h2>合同多次付款动态跟踪表</h2>
</div>

<table cellspacing="0px" cellpadding="0px" class="print">
    <tr>
        <td class="center">项目名称</td>
        <td class="left">${main.stageName}</td>
        <td class="center">单位</td>
        <td class="left">元</td>
    </tr>
    <tr>
        <td class="center">合同</td>
        <td class="left">${main.contractName}</td>
        <td class="center">合同编号</td>
        <td class="left">${main.contractCode}</td>
    </tr>
    <tr>
        <td class="center">施工单位</td>
        <td class="left">${main.workUnit}</td>
        <td class="center">合同累计金额</td>
        <td class="left">${main.contractTotalAmount}</td>
    </tr>
    <tr>
        <td class="center" style="height: 60px;">累计核定支付比例<br/>（累计产值应付款<br/>+累计借款抵扣）<br/>/ 累计核定进度</td>
        <td class="left">${main.approvedRatio}</td>
        <td class="center">其中，合同金额</td>
        <td class="left">${main.contractAmount}</td>
    </tr>
    <tr>
        <td class="center" style="height: 60px;">累计核定支付比例<br/>（累计产值应付款<br/>+累计借款抵扣）<br/>/ 动态成本</td>
        <td class="left">${main.dcRatio}</td>
        <td class="center">其中，补充协议金额</td>
        <td class="left">${main.supplementaryAmount}</td>
    </tr>
    <tr>
        <td class="center" style="height: 60px">累计核定支付比例<br/>（累计产值应付款<br/>+累计借款抵扣）<br/>/ 合同累计总额</td>
        <td class="left">${main.contractTotalRatio}</td>
        <td class="center">其中，材料调差金额</td>
        <td class="left">${main.materialAmount}</td>
    </tr>
    <tr>
        <td class="center">合同动态（不含材料调差）</td>
        <td class="left" colspan="3">${main.dcAmount}</td>
    </tr>
</table>
<br/>
<table cellspacing="0px" cellpadding="0px" class="detail">
    <thead>
    <tr>
        <td style="width: 60px;">核定进度<br/>①</td>
        <td style="width: 35px;">合同约<br/>定支付<br/>比例②</td>
        <td style="width: 60px;">产值应付款<br/>③=①*②</td>
        <td>借款或<br/>抵扣④</td>
        <td>代付代扣<br/>⑤</td>
        <td>其他扣款<br/>⑥</td>
        <td style="width: 40px;">罚款⑦</td>
        <td style="width: 40px;">奖励⑧</td>
        <td style="width: 60px">累计应付款<br/>⑨=(③+④+⑤<br/>+⑥+⑦+⑧)</td>
        <td style="width: 60px">已实付<br/>申请金额</td>
        <td style="width: 60px">已实付<br/>登记金额</td>
        <td>支付条件</td>
        <td style="width: 50px">应付款<br/>日期</td>
        <td>备注</td>
    </tr>
    </thead>
<#list details as detail>
    <tr>
        <td><#if detail.approvedAmount?? >${detail.approvedAmount}</#if></td>
        <td><#if detail.payRatio?? >${detail.payRatio}</#if></td>
        <td><#if detail.payableAmount?? >${detail.payableAmount}</#if></td>
        <td><#if detail.loanAndPre?? >${detail.loanAndPre}</#if></td>
        <td><#if detail.brokerDeduction?? >${detail.brokerDeduction}</#if></td>
        <td><#if detail.otherDeduction?? >${detail.otherDeduction}</#if></td>
        <td><#if detail.fine?? >${detail.fine}</#if></td>
        <td><#if detail.reward?? >${detail.reward}</#if></td>
        <td><#if detail.paidAmount?? >${detail.paidAmount}</#if></td>
        <td><#if detail.cmApplyPaidAmount?? >${detail.cmApplyPaidAmount}</#if></td>
        <td><#if detail.fmPaymentPaidAmount?? >${detail.fmPaymentPaidAmount}</#if></td>
        <td><#if detail.contractTerms?? >${detail.contractTerms}</#if></td>
        <td><#if detail.finishDate?? >${detail.finishDate}</#if></td>
        <td><#if detail.remark?? >${detail.remark}</#if></td>
    </tr>
</#list>
    <tr><td colspan="14">累计</td></tr>
    <tr>
        <td><#if sum.approvedAmount?? >${sum.approvedAmount}</#if></td>
        <td></td>
        <td><#if sum.payableAmount?? >${sum.payableAmount}</#if></td>
        <td><#if sum.loanAndPre?? >${sum.loanAndPre}</#if></td>
        <td><#if sum.brokerDeduction?? >${sum.brokerDeduction}</#if></td>
        <td><#if sum.otherDeduction?? >${sum.otherDeduction}</#if></td>
        <td><#if sum.fine?? >${sum.fine}</#if></td>
        <td><#if sum.reward?? >${sum.reward}</#if></td>
        <td><#if sum.paidAmount?? >${sum.paidAmount}</#if></td>
        <td><#if sum.cmApplyPaidAmount?? >${sum.cmApplyPaidAmount}</#if></td>
        <td><#if sum.fmPaymentPaidAmount?? >${sum.fmPaymentPaidAmount}</#if></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>
</body>
</html>
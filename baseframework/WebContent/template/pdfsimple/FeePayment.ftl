<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>付款申请单</title>  
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
            	padding-left:10px;
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
			    min-height:25px;
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
          <h2>付&nbsp;款&nbsp;申&nbsp;请&nbsp;单</h2>
      </div>
      <div align="right" style="font-weight:bold;">  
          <h5>打印计数：${printCount}</h5>
      </div>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr style="height:30px;color:blue">
         	<td class="left" colspan="4" ><b>决策信息</b></td>
         </tr>
         <tr>  
            <td class="center">付款主题</td>  
            <td class="left" colspan="3">${subject}</td>  
         </tr>  
         <tr>  
            <td class="center">单据编号</td>  
            <td class="left" >${billCode}</td>  
            <td class="center">付款申请日期</td>  
            <td class="left">${fillinDate}</td>  
         </tr>  
         <tr>  
             <td class="center">合同编号</td>  
            <td class="left">${code}</td>  
            <td class="center">合同名称</td>  
            <td class="left">${contractName}</td>  
         </tr>
         <tr>  
            <td class="center">申请金额</td>  
            <td class="left">${paymentTotalAmount}</td>  
            <td class="center">冲账金额</td>  
            <td class="left">${writeOffAmount}</td>  
         </tr>
         <tr>  
            <td class="center">签约金额</td>  
            <td class="left"><#if contractAmount?? >${contractAmount}</#if></td>  
            <td class="center">累计已付金额</td>  
            <td class="left"><#if paidAmount?? >${paidAmount}</#if></td>  
         </tr>
         <tr>  
            <td class="center">签约金额支付比例（%）</td>  
            <td class="left"><#if paymentRate?? >${paymentRate}</#if>%</td>  
            <td class="center">应付未付</td>  
            <td class="left"><#if waitingPaymentAmount?? >${waitingPaymentAmount}</#if></td>  
         </tr>
         <tr>  
            <td class="center">合同结算金额</td>  
            <td class="left"><#if settlementAmount?? >${settlementAmount}</#if></td>  
            <td class="center">合同累计未付金额</td>  
            <td class="left"><#if unpaidAmount?? >${unpaidAmount}</#if></td>  
         </tr>
         <tr>  
            <td class="center">进度是否符合合同</td>  
            <td class="left"><#if schedule?? >${schedule}</#if></td>  
            <td></td><td></td>
         </tr>
      </table>
       <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr  style="height:30px;color:blue;font-size:bold;">
         	<td class="left" colspan="4">付款基本信息</td>
         </tr>
         <tr>  
            <td class="center">公司名称</td>  
            <td class="left" colspan="3" >${organName}</td>  
         </tr>  
         <tr>  
            <td class="center">付款类别</td>  
            <td class="left">${paymentItemKindName}</td>  
            <td class="center">收款单位</td>  
            <td class="left">${partyBName}</td>  
         </tr>
         <tr>  
            <td class="center">开户银行</td>  
            <td class="left">${bankName}</td>  
            <td class="center">银行帐号</td>  
            <td class="left">${bankAccount}</td>  
         </tr>
         <tr>  
            <td class="center">经办部门</td>  
            <td class="left">${deptName}</td>  
            <td class="center">经办人</td>  
            <td class="left">${personMemberName}</td>  
         </tr>
         <tr>  
            <td class="center">合同履行情况和本次付款说明</td>  
            <td class="left" colspan="3"><#if schedule?? >${remark}</#if></td>  
         </tr>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   
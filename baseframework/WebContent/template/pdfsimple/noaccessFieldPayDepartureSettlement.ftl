<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>离职结算单</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    position: absolute;
                top:0px;
                left:0px;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
               border:solid 2px;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:1px;
            }
            table td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
           
            @page {    
                size:  210mm 297mm;
           }   
        </style> 
</head>  
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro> 
<body>
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
 <br></br>
  <div align="center" style="font-weight:bold;font-size:20px;height:20px;">  
          <b>员工【${archivesName}】离职工资结算清单</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    <tr>
          <td width="15%" align="left">姓名:${archivesName}</td>
          <td width="15%" align="left">单位:${settlementOrganName}</td>
          <td width="15%" align="left">所属一级中心:${settlementCentreName}</td>
          
        </tr>
         <tr>
          <td  align="left">部门:${settlementDeptName}</td>
          <td  align="left" colspan="2">岗位:${settlementPosName}</td>
        </tr>
          <tr>
          <td  align="left">通讯号码:${phoneNumber}</td>
          <td  align="left" colspan="2">身份证号:${idCardNo}</td>
        </tr>
		<tr>
			<td  align="left" colspan="3">备注:${remark}</td>
		</tr>
   </table>
   
    <#list settlements as settlement>  
    <br>考勤截止&nbsp;<@formatdate date=settlement.attendanceDate/>&nbsp;结算单明细</br>
    <table  cellspacing="0px" cellpadding="0px"  >
     <tr>
     <td colspan="3" align="left">工资增加项</td>
     </tr>
         <tr>
           <td  align="left" >独子补贴:&nbsp;${settlement.oneChildPay}</td>
          <td  align="left">误餐补贴:&nbsp;${settlement.mealAllowance}</td>
          <td  align="left" >结婚礼金:&nbsp;${settlement.pay03}</td>
        </tr>
         <tr>
          <td  align="left" >生日礼金:&nbsp;${settlement.pay04}</td>
          <td  align="left">销售提成:&nbsp;${settlement.salesCommissions}</td>
          <td  align="left" >离职补偿:&nbsp;${settlement.pay05}</td>
        </tr>
        <tr>
          <td  align="left">奖励合计:&nbsp;${settlement.award}</td>
          <td  align="left" >补发工资:&nbsp;${settlement.backPay}</td>
          <td  align="left" >离职补偿:&nbsp;${settlement.pay05}</td>
        </tr>
        <tr>
          <td  align="left" colspan="3" >税后补发:&nbsp;${settlement.pay01}</td>
        </tr>
        <tr>
        <td colspan="3" align="left">工资减少项</td>
         </tr>
         <tr>
          <td  align="left" >养老保险扣款:&nbsp;${settlement.oldAgeBenefit}</td>
          <td  align="left">医疗保险扣款:&nbsp;${settlement.medicare}</td>
          <td  align="left" >失业保险扣款:&nbsp;${settlement.unemploymentInsurance}</td>
        </tr>
        <tr>
           <td  align="left" >扣住房公积金:&nbsp;${settlement.housingFund}</td>
           <td  align="left"  >其他扣款:&nbsp;${settlement.deductPay}</td>
          <td  align="left"  >税后补扣:&nbsp;${settlement.pay02}</td>
        </tr>
         <tr>
           <td  align="left" >罚款合计:&nbsp;${settlement.penalty}</td>
           <td colspan="2" align="left" >&nbsp;</td>
        </tr>
         <tr>
        <td colspan="3" align="left" >个人税款</td>
         </tr>
         <#if settlement.accountsType??&&settlement.accountsType?string=='performance'>
         <tr>
          <td  align="left" >关联单据计税工资:&nbsp;${settlement.relevanceTaxablePay}</td>
           <td  align="left" colspan="2" >关联单据所得税:&nbsp;${settlement.relevanceIncomeTax}</td>
        </tr>
        </#if>
        <tr>
          <td  align="left" >计税工资:&nbsp;${settlement.taxablePay}</td>
           <td  align="left" colspan="2" >个人所得税:&nbsp;${settlement.incomeTax}</td>
        </tr>
          <tr>
        <td colspan="3" align="left">合计</td>
         </tr>
        <tr>
          <td  align="left" >应发工资:&nbsp;${settlement.totalPay}</td>
           <td  align="left"  >扣款合计:&nbsp;${settlement.deductAll}</td>
            <td  align="left"  >实发工资:&nbsp;${settlement.netPay}</td>
        </tr>
   </table>   
     </#list>
 
     <br></br>
      <#include "/simple/taskExecutionList.ftl" />
    
</body>  
</html>   
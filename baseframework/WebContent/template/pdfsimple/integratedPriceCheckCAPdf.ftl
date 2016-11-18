<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>综合单价认价回复通知书</title>  
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
          <b>综合单价认价回复通知书</b>
          </div>
      <div align="center" style="font-weight:bold;font-size:13px;height:18px;">  
          <p>编号：</p>
   </div>
   
    <table cellspacing="0" cellpadding="0" class="print" style="border-width:1px;border-bottom:1px; border-right:1px;">
     <tr>
     <td> <b>${partyBName}：</b></td>
     </tr>
     <tr>
     <td>
      <p>&nbsp;&nbsp;&nbsp;根据&nbsp;&nbsp;   <u>${contractAlterName}</u>  &nbsp;&nbsp; 项目变更通知单/技术核定单/任务通知书（编号：______________）， 其中涉及的材料
       （设备）价格，经我司市场核查，决定按下表规定的单价、品牌、规格、型号回复。</p></td>
     </tr>
    </table>
   
    <br/>
   <table cellspacing="0" cellpadding="0" class="print" style="border-width:1px;border-bottom:1px; border-right:1px;">
      	<tr>  
            <td class="center" style="width:20%;"><b>认价项目名称</b></td>  
            <td class="center" style="width:20%;"><b>项目特征</b></td>  
            <td class="center" style="width:20%;"><b>工程内容</b></td>
            <td class="center" style="width:8%;"><b>单位</b></td>
            <td class="center" style="width:11%;"><b>综合单价</b></td>
            <td class="center" style="width:10%;"><b>数量</b></td>
            <td class="center" style="width:11%;"><b>总价</b></td>
             
         </tr>
       <#if IntegratedPriceCheckDetas?? && IntegratedPriceCheckDetas?size gt 0> 
		<#list IntegratedPriceCheckDetas as IntegratedPriceCheckDeta>
			<tr >
				<td class="center">${IntegratedPriceCheckDeta.contractCommonInstName}</td>
				<td class="center">${IntegratedPriceCheckDeta.charac}</td>
				<td class="center">${IntegratedPriceCheckDeta.content}</td>
				<td class="center">${IntegratedPriceCheckDeta.unitName}</td>
			    <td class="center">${IntegratedPriceCheckDeta.complexPrice}</td>
				<td class="center">${IntegratedPriceCheckDeta.quantity}</td>
				<td class="center">${IntegratedPriceCheckDeta.amount}</td>
			</tr> 
		</#list>
		<#else>
			<tr>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				
			</tr> 
		</#if>
      </table>
      
    <table cellspacing="0" cellpadding="0" class="print" style="border-width:1px;border-bottom:1px; border-right:1px;">
     <tr>
     <td> 校   对：    </td>
     <td>    审   核： </td>
     </tr>
     <tr>
     <td colspan="2" >说  明：	
    </td>
     </tr>
     <tr> <td colspan="2" >  1.不按上表规定的要求采购，其认可的单价无效，需另行报批。 </td> </tr>
      <tr> <td colspan="2" > 2.工程办理决算或决算审计，必须按结算办法的规定执行。</td> </tr>
       <tr> <td colspan="2" >  3.此件一式叁份，施工单位与工程管理部各一份，一份存档（成本管理部）。 </td> </tr>
        <tr> <td colspan="2" > 4.贵司对本回复价格有异议，请于实际采购前提出，我司将安排专人进行核实；如果采购完成后方提出价格异议，我司一概不予受理。	 </td> </tr>
    </table>
     
   <br/>
   <table cellspacing="0" cellpadding="0" class="print" style="border-width:1px;border-bottom:1px; border-right:1px;">
  <tr>
    <td align="right" > <u>${partyAName}</u> &nbsp;&nbsp;&nbsp;</td>
 </tr>
 <tr>
    <td align="right" > ${today}&nbsp;&nbsp;&nbsp;</td>
 </tr>
 <tr>
	<td align="right" >CL-01-02-04[A/0版]&nbsp;&nbsp;&nbsp;</td>
  </tr>
</table>
</body>  
</html>   
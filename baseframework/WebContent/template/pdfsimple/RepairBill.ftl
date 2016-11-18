<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>维修/报废申请单</title>  
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
               height: 55px;text-align: left;
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
                width:200px;
            	text-align: left;
            	padding-left:20px;
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
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro> 
<body>  
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;font-size:20px;">  
          <h3>维&nbsp;修/报&nbsp;废&nbsp;申&nbsp;请&nbsp;单</h3>
      </div>
      
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				经办人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">文件编号</td>  
            <td class="left">${dispatchNo}</td>  
            <td class="center">关键字</td>  
            <td class="left">${keyword?html}</td> 
         </tr>  
         <tr>  
            <td class="center">资产所属公司</td>  
            <td class="left">${ownerOrganName}</td>  
            <td class="center">主要设备专业类别</td>  
            <td class="left">${materialCategoryTextView?default("")?html}</td> 
         </tr>
         <tr>  
            <td class="center">维修原因</td>  
            <td colspan="3" class="left">${reason}</td>  
         </tr>
	     <tr>
            <td class="center">资产原值总额(元)</td>  
            <td class="left">${assetTotalPrice}</td>  
            <td class="center">资产净值总额(元)</td>  
            <td class="left">${netValue}</td>
         </tr>
         <tr>
            <td class="center">处理方式</td>  
            <td class="left">${repairHandleKindTextView?default("")?html}</td>  
            <td class="center">维修金额(元)</td>  
            <td class="left">${amount}</td>  
         </tr>
         <tr>  
            <td class="center">主要维修信息</td>  
            <td colspan="3" class="left">${repairInfo?html}</td>  
         </tr>
         <tr>  
            <td class="center">备注</td>  
            <td colspan="3" class="left">${remark?html}</td>  
         </tr>
      </table>
      
      <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>维修\报废资产列表</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
      		<td class="center" style="width:30px;"><b>序号</b></td>  
      		<td class="center" style="width:50px;"><b>维修金额</b></td>  
            <td class="center" style="width:50px;"><b>资产类别</b></td>  
            <td class="center" style="width:50px;"><b>资产编号</b></td>
            <td class="center" style="width:80px;"><b>资产名称</b></td>
            <td class="center" style="width:50px;"><b>卡片号</b></td>
            <td class="center" style="width:50px;"><b>原使用人</b></td>
            <td class="center" style="width:80px;"><b>品牌</b></td>
            <#--
            <td class="center" style="width:80px;"><b>规格\型号</b></td>
            -->
            <td class="center" style="width:30px;"><b>数量</b></td>
            <td class="center" style="width:30px;"><b>单位</b></td>
            <td class="center" style="width:50px;"><b>资产原值</b></td>
            <td class="center" style="width:50px;"><b>资产净值</b></td>
         </tr>
        <#if repairDetail?? && repairDetail?size gt 0> 
		<#list repairDetail as repair>
			<tr >
				<td class="center">${repair_index?if_exists+1}</td>
				<td class="center">${repair.repairPrice}</td>
				<td class="center">${repair.assetTypeDicTextView?default("")?html}</td>
				<td class="center">${repair.assetCode}</td>
				<td class="center">${repair.assetName}</td>
				<td class="center">${repair.cardNumber}</td>
				<td class="center">${repair.originalPersonMemberName}</td>
				<td class="center">${repair.brand?html}</td>
				<#--
				<td class="center">${repair.specification?html}</td>
				-->
				<td class="center">${repair.quantity}</td>
				<td class="center">${repair.unitTextView?default("")?html}</td>
				<td class="center">${repair.originalPrice}</td>
				<td class="center">${repair.netAssetPrice}</td>
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
				<td class="center">&nbsp;</td>
				<#--
				<td class="center">&nbsp;</td>
				-->
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   
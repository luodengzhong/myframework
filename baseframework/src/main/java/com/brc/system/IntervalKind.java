 package com.brc.system;
 
 public enum IntervalKind
 {
   OPEN, 
   LEF_OPEN, 
   RIGHT_OPEN, 
   CLOSE;
 
   private Float operand1;
   private Float operand2;
 
   public Float getOperand1() {
     return this.operand1;
   }
 
   public Float getOperand2() {
     return this.operand2;
   }
 
   public static IntervalKind getIntervalKind(String value)
   {
     value = value.trim();
     int len = value.length();
     char firstChar = value.charAt(0);
     char lastChar = value.charAt(len - 1);
     IntervalKind result;
     if (firstChar == '(')
     {
       if (lastChar == ')') result = OPEN;
       else result = LEF_OPEN;
     }
     else
     {
       if (lastChar == ')') result = RIGHT_OPEN;
       else
         result = CLOSE;
     }
     value = value.substring(1, len - 1);
     String[] values = value.split(",");
     result.operand1 = Float.valueOf(Float.parseFloat(values[0]));
 
     if (values[1].equalsIgnoreCase("+"))
       result.operand2 = Float.valueOf(3.4028235E+38F);
     else
       result.operand2 = Float.valueOf(Float.parseFloat(values[1]));
     return result;
   }
 }


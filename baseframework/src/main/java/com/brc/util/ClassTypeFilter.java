 package com.brc.util;
 
 import org.springframework.core.type.filter.AbstractTypeHierarchyTraversingFilter;
 
 public class ClassTypeFilter extends AbstractTypeHierarchyTraversingFilter
 {
   private final Class classType;
 
   public ClassTypeFilter(Class cls)
   {
     this(cls, true, true);
   }
 
   public ClassTypeFilter(Class cls, boolean considerInherited) {
     this(cls, considerInherited, false);
   }
 
   public ClassTypeFilter(Class cls, boolean considerInherited, boolean considerInterfaces)
   {
     super(considerInherited, considerInterfaces);
     this.classType = cls;
   }
 
   protected boolean matchClassName(String className) {
     return this.classType.getName().equals(className);
   }
 
   protected Boolean matchSuperClass(String superClassName) {
     if (Object.class.getName().equals(superClassName))
       return Boolean.FALSE;
     if (!superClassName.startsWith("java."))
       return null;
     try {
       Class clazz = getClass().getClassLoader().loadClass(superClassName);
 
       if (clazz == this.classType)
         return Boolean.valueOf(true);
     }
     catch (ClassNotFoundException e)
     {
       e.printStackTrace();
       return null;
     }
     return Boolean.valueOf(false);
   }
 
   protected Boolean matchInterface(String interfaceNames) {
     return matchSuperClass(interfaceNames);
   }
 }


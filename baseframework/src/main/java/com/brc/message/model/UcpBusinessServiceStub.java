 package com.brc.message.model;
 
 import java.lang.reflect.Constructor;
 import java.lang.reflect.InvocationTargetException;
 import java.lang.reflect.Method;
 import java.rmi.RemoteException;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.Map;
 import java.util.Vector;
 import javax.xml.namespace.NamespaceContext;
 import javax.xml.namespace.QName;
 import javax.xml.stream.XMLStreamException;
 import javax.xml.stream.XMLStreamReader;
 import javax.xml.stream.XMLStreamWriter;
 import org.apache.axiom.om.OMAbstractFactory;
 import org.apache.axiom.om.OMDataSource;
 import org.apache.axiom.om.OMElement;
 import org.apache.axiom.om.OMFactory;
 import org.apache.axiom.om.OMNamespace;
 import org.apache.axiom.soap.SOAPBody;
 import org.apache.axiom.soap.SOAPEnvelope;
 import org.apache.axiom.soap.SOAPFactory;
 import org.apache.axis2.AxisFault;
 import org.apache.axis2.addressing.EndpointReference;
 import org.apache.axis2.client.FaultMapKey;
 import org.apache.axis2.client.OperationClient;
 import org.apache.axis2.client.Options;
 import org.apache.axis2.client.ServiceClient;
 import org.apache.axis2.client.Stub;
 import org.apache.axis2.context.ConfigurationContext;
 import org.apache.axis2.context.MessageContext;
 import org.apache.axis2.databinding.ADBBean;
 import org.apache.axis2.databinding.ADBDataSource;
 import org.apache.axis2.databinding.ADBException;
 import org.apache.axis2.databinding.utils.BeanUtil;
 import org.apache.axis2.databinding.utils.ConverterUtil;
 import org.apache.axis2.databinding.utils.reader.ADBXMLStreamReaderImpl;
 import org.apache.axis2.description.AxisOperation;
 import org.apache.axis2.description.AxisService;
 import org.apache.axis2.description.OutInAxisOperation;
 import org.apache.axis2.description.TransportOutDescription;
 import org.apache.axis2.transport.TransportSender;
 
 public class UcpBusinessServiceStub extends Stub
 {
   protected AxisOperation[] _operations;
   private HashMap faultExceptionNameMap = new HashMap();
   private HashMap faultExceptionClassNameMap = new HashMap();
   private HashMap faultMessageMap = new HashMap();
 
   private static int counter = 0;
 
   private QName[] opNameArray = null;
 
   private static synchronized String getUniqueSuffix()
   {
     if (counter > 99999) {
       counter = 0;
     }
     counter += 1;
     return Long.toString(System.currentTimeMillis()) + "_" + counter;
   }
 
   private void populateAxisService()
     throws AxisFault
   {
     this._service = new AxisService("UcpBusinessService" + getUniqueSuffix());
 
     addAnonymousOperations();
 
     this._operations = new AxisOperation[2];
 
     AxisOperation __operation = new OutInAxisOperation();
 
     __operation.setName(new QName("http://tempuri.org/", "sendMessageToApp"));
 
     this._service.addOperation(__operation);
 
     this._operations[0] = __operation;
 
     __operation = new OutInAxisOperation();
 
     __operation.setName(new QName("http://tempuri.org/", "sendMessage"));
 
     this._service.addOperation(__operation);
 
     this._operations[1] = __operation;
   }
 
   private void populateFaults()
   {
   }
 
   public UcpBusinessServiceStub(ConfigurationContext configurationContext, String targetEndpoint)
     throws AxisFault
   {
     this(configurationContext, targetEndpoint, false);
   }
 
   public UcpBusinessServiceStub(ConfigurationContext configurationContext, String targetEndpoint, boolean useSeparateListener)
     throws AxisFault
   {
     populateAxisService();
     populateFaults();
 
     this._serviceClient = new ServiceClient(configurationContext, this._service);
 
     this._serviceClient.getOptions().setTo(new EndpointReference(targetEndpoint));
 
     this._serviceClient.getOptions().setUseSeparateListener(useSeparateListener);
 
     this._serviceClient.getOptions().setSoapVersionURI("http://www.w3.org/2003/05/soap-envelope");
   }
 
   public UcpBusinessServiceStub(ConfigurationContext configurationContext)
     throws AxisFault
   {
     this(configurationContext, "http://10.0.3.248:81/Ucpro2/Interface/BusinessService.asmx");
   }
 
   public UcpBusinessServiceStub()
     throws AxisFault
   {
     this("http://10.0.3.248:81/Ucpro2/Interface/BusinessService.asmx");
   }
 
   public UcpBusinessServiceStub(String targetEndpoint)
     throws AxisFault
   {
     this(null, targetEndpoint);
   }
 
   public SendMessageToAppResponse sendMessageToApp(SendMessageToApp sendMessageToApp)
     throws RemoteException
   {
     MessageContext _messageContext = null;
     try {
       OperationClient _operationClient = this._serviceClient.createClient(this._operations[0].getName());
 
       _operationClient.getOptions().setAction("http://tempuri.org/SendMessageToApp");
 
       _operationClient.getOptions().setExceptionToBeThrownOnSOAPFault(true);
 
       addPropertyToOperationClient(_operationClient, "whttp:queryParameterSeparator", "&");
 
       _messageContext = new MessageContext();
 
       SOAPEnvelope env = null;
 
       env = toEnvelope(getFactory(_operationClient.getOptions().getSoapVersionURI()), sendMessageToApp, optimizeContent(new QName("http://tempuri.org/", "sendMessageToApp")), new QName("http://tempuri.org/", "sendMessageToApp"));
 
       this._serviceClient.addHeadersToEnvelope(env);
 
       _messageContext.setEnvelope(env);
 
       _operationClient.addMessageContext(_messageContext);
 
       _operationClient.execute(true);
 
       MessageContext _returnMessageContext = _operationClient.getMessageContext("In");
 
       SOAPEnvelope _returnEnv = _returnMessageContext.getEnvelope();
 
       Object object = fromOM(_returnEnv.getBody().getFirstElement(), SendMessageToAppResponse.class, getEnvelopeNamespaces(_returnEnv));
 
       return (SendMessageToAppResponse)object;
     }
     catch (AxisFault f)
     {
       OMElement faultElt = f.getDetail();
       if (faultElt != null) {
         if (this.faultExceptionNameMap.containsKey(new FaultMapKey(faultElt.getQName(), "SendMessageToApp")))
         {
           try
           {
             String exceptionClassName = (String)this.faultExceptionClassNameMap.get(new FaultMapKey(faultElt.getQName(), "SendMessageToApp"));
 
             Class exceptionClass = Class.forName(exceptionClassName);
 
             Constructor constructor = exceptionClass.getConstructor(new Class[] { String.class });
 
             Exception ex = (Exception)constructor.newInstance(new Object[] { f.getMessage() });
 
             String messageClassName = (String)this.faultMessageMap.get(new FaultMapKey(faultElt.getQName(), "SendMessageToApp"));
 
             Class messageClass = Class.forName(messageClassName);
 
             Object messageObject = fromOM(faultElt, messageClass, null);
 
             Method m = exceptionClass.getMethod("setFaultMessage", new Class[] { messageClass });
 
             m.invoke(ex, new Object[] { messageObject });
 
             throw new RemoteException(ex.getMessage(), ex);
           }
           catch (ClassCastException e)
           {
             throw f;
           }
           catch (ClassNotFoundException e)
           {
             throw f;
           }
           catch (NoSuchMethodException e)
           {
             throw f;
           }
           catch (InvocationTargetException e)
           {
             throw f;
           }
           catch (IllegalAccessException e)
           {
             throw f;
           }
           catch (InstantiationException e)
           {
             throw f;
           }
         }
         throw f;
       }
 
       throw f;
     }
     finally {
       if (_messageContext.getTransportOut() != null)
         _messageContext.getTransportOut().getSender().cleanup(_messageContext);
     }
   }
 
   public SendMessageResponse sendMessage(SendMessage sendMessage)
     throws RemoteException
   {
     MessageContext _messageContext = null;
     try {
       OperationClient _operationClient = this._serviceClient.createClient(this._operations[1].getName());
 
       _operationClient.getOptions().setAction("http://tempuri.org/SendMessage");
 
       _operationClient.getOptions().setExceptionToBeThrownOnSOAPFault(true);
 
       addPropertyToOperationClient(_operationClient, "whttp:queryParameterSeparator", "&");
 
       _messageContext = new MessageContext();
 
       SOAPEnvelope env = null;
 
       env = toEnvelope(getFactory(_operationClient.getOptions().getSoapVersionURI()), sendMessage, optimizeContent(new QName("http://tempuri.org/", "sendMessage")), new QName("http://tempuri.org/", "sendMessage"));
 
       this._serviceClient.addHeadersToEnvelope(env);
 
       _messageContext.setEnvelope(env);
 
       _operationClient.addMessageContext(_messageContext);
 
       _operationClient.execute(true);
 
       MessageContext _returnMessageContext = _operationClient.getMessageContext("In");
 
       SOAPEnvelope _returnEnv = _returnMessageContext.getEnvelope();
 
       Object object = fromOM(_returnEnv.getBody().getFirstElement(), SendMessageResponse.class, getEnvelopeNamespaces(_returnEnv));
 
       return (SendMessageResponse)object;
     }
     catch (AxisFault f)
     {
       OMElement faultElt = f.getDetail();
       if (faultElt != null) {
         if (this.faultExceptionNameMap.containsKey(new FaultMapKey(faultElt.getQName(), "SendMessage")))
         {
           try
           {
             String exceptionClassName = (String)this.faultExceptionClassNameMap.get(new FaultMapKey(faultElt.getQName(), "SendMessage"));
 
             Class exceptionClass = Class.forName(exceptionClassName);
 
             Constructor constructor = exceptionClass.getConstructor(new Class[] { String.class });
 
             Exception ex = (Exception)constructor.newInstance(new Object[] { f.getMessage() });
 
             String messageClassName = (String)this.faultMessageMap.get(new FaultMapKey(faultElt.getQName(), "SendMessage"));
 
             Class messageClass = Class.forName(messageClassName);
 
             Object messageObject = fromOM(faultElt, messageClass, null);
 
             Method m = exceptionClass.getMethod("setFaultMessage", new Class[] { messageClass });
 
             m.invoke(ex, new Object[] { messageObject });
 
             throw new RemoteException(ex.getMessage(), ex);
           }
           catch (ClassCastException e)
           {
             throw f;
           }
           catch (ClassNotFoundException e)
           {
             throw f;
           }
           catch (NoSuchMethodException e)
           {
             throw f;
           }
           catch (InvocationTargetException e)
           {
             throw f;
           }
           catch (IllegalAccessException e)
           {
             throw f;
           }
           catch (InstantiationException e)
           {
             throw f;
           }
         }
         throw f;
       }
 
       throw f;
     }
     finally {
       if (_messageContext.getTransportOut() != null)
         _messageContext.getTransportOut().getSender().cleanup(_messageContext);
     }
   }
 
   private Map getEnvelopeNamespaces(SOAPEnvelope env)
   {
     Map returnMap = new HashMap();
     Iterator namespaceIterator = env.getAllDeclaredNamespaces();
     while (namespaceIterator.hasNext()) {
       OMNamespace ns = (OMNamespace)namespaceIterator.next();
 
       returnMap.put(ns.getPrefix(), ns.getNamespaceURI());
     }
     return returnMap;
   }
 
   private boolean optimizeContent(QName opName)
   {
     if (this.opNameArray == null) {
       return false;
     }
     for (int i = 0; i < this.opNameArray.length; i++) {
       if (opName.equals(this.opNameArray[i])) {
         return true;
       }
     }
     return false;
   }
 
   private OMElement toOM(SendMessageToApp param, boolean optimizeContent)
     throws AxisFault
   {
     try
     {
       return param.getOMElement(SendMessageToApp.MY_QNAME, OMAbstractFactory.getOMFactory());
     }
     catch (ADBException e)
     {
       throw AxisFault.makeFault(e);
     }
   }
 
   private OMElement toOM(SendMessageToAppResponse param, boolean optimizeContent)
     throws AxisFault
   {
     try
     {
       return param.getOMElement(SendMessageToAppResponse.MY_QNAME, OMAbstractFactory.getOMFactory());
     }
     catch (ADBException e)
     {
       throw AxisFault.makeFault(e);
     }
   }
 
   private OMElement toOM(SendMessage param, boolean optimizeContent)
     throws AxisFault
   {
     try
     {
       return param.getOMElement(SendMessage.MY_QNAME, OMAbstractFactory.getOMFactory());
     }
     catch (ADBException e)
     {
       throw AxisFault.makeFault(e);
     }
   }
 
   private OMElement toOM(SendMessageResponse param, boolean optimizeContent)
     throws AxisFault
   {
     try
     {
       return param.getOMElement(SendMessageResponse.MY_QNAME, OMAbstractFactory.getOMFactory());
     }
     catch (ADBException e)
     {
       throw AxisFault.makeFault(e);
     }
   }
 
   private SOAPEnvelope toEnvelope(SOAPFactory factory, SendMessageToApp param, boolean optimizeContent, QName methodQName)
     throws AxisFault
   {
     try
     {
       SOAPEnvelope emptyEnvelope = factory.getDefaultEnvelope();
 
       emptyEnvelope.getBody().addChild(param.getOMElement(SendMessageToApp.MY_QNAME, factory));
 
       return emptyEnvelope;
     } catch (ADBException e) {
       throw AxisFault.makeFault(e);
     }
   }
 
   private SOAPEnvelope toEnvelope(SOAPFactory factory, SendMessage param, boolean optimizeContent, QName methodQName)
     throws AxisFault
   {
     try
     {
       SOAPEnvelope emptyEnvelope = factory.getDefaultEnvelope();
 
       emptyEnvelope.getBody().addChild(param.getOMElement(SendMessage.MY_QNAME, factory));
 
       return emptyEnvelope;
     } catch (ADBException e) {
       throw AxisFault.makeFault(e);
     }
   }
 
   private SOAPEnvelope toEnvelope(SOAPFactory factory)
   {
     return factory.getDefaultEnvelope();
   }
 
   private Object fromOM(OMElement param, Class type, Map extraNamespaces)
     throws AxisFault
   {
     try
     {
       if (SendMessageToApp.class.equals(type))
       {
         return UcpBusinessServiceStub.SendMessageToApp.Factory.parse(param.getXMLStreamReaderWithoutCaching());
       }
 
       if (SendMessageToAppResponse.class.equals(type))
       {
         return UcpBusinessServiceStub.SendMessageToAppResponse.Factory.parse(param.getXMLStreamReaderWithoutCaching());
       }
 
       if (SendMessage.class.equals(type))
       {
         return UcpBusinessServiceStub.SendMessage.Factory.parse(param.getXMLStreamReaderWithoutCaching());
       }
 
       if (SendMessageResponse.class.equals(type))
       {
         return UcpBusinessServiceStub.SendMessageResponse.Factory.parse(param.getXMLStreamReaderWithoutCaching());
       }
 
     }
     catch (Exception e)
     {
       throw AxisFault.makeFault(e);
     }
     return null;
   }
 
   public static class SendMessageResponse
     implements ADBBean
   {
     public static final QName MY_QNAME = new QName("http://tempuri.org/", "SendMessageResponse", "ns1");
     protected boolean localSendMessageResult;
 
     public boolean getSendMessageResult()
     {
       return this.localSendMessageResult;
     }
 
     public void setSendMessageResult(boolean param)
     {
       this.localSendMessageResult = param;
     }
 
     public OMElement getOMElement(QName parentQName, OMFactory factory)
       throws ADBException
     {
       OMDataSource dataSource = new ADBDataSource(this, MY_QNAME);
 
       return factory.createOMElement(dataSource, MY_QNAME);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter)
       throws XMLStreamException, ADBException
     {
       serialize(parentQName, xmlWriter, false);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter, boolean serializeType)
       throws XMLStreamException, ADBException
     {
       String prefix = null;
       String namespace = null;
 
       prefix = parentQName.getPrefix();
       namespace = parentQName.getNamespaceURI();
       writeStartElement(prefix, namespace, parentQName.getLocalPart(), xmlWriter);
 
       if (serializeType)
       {
         String namespacePrefix = registerPrefix(xmlWriter, "http://tempuri.org/");
 
         if ((namespacePrefix != null) && (namespacePrefix.trim().length() > 0))
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", namespacePrefix + ":SendMessageResponse", xmlWriter);
         }
         else
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", "SendMessageResponse", xmlWriter);
         }
 
       }
 
       namespace = "http://tempuri.org/";
       writeStartElement(null, namespace, "SendMessageResult", xmlWriter);
 
       xmlWriter.writeCharacters(ConverterUtil.convertToString(this.localSendMessageResult));
 
       xmlWriter.writeEndElement();
 
       xmlWriter.writeEndElement();
     }
 
     private static String generatePrefix(String namespace)
     {
       if (namespace.equals("http://tempuri.org/")) {
         return "ns1";
       }
       return BeanUtil.getUniquePrefix();
     }
 
     private void writeStartElement(String prefix, String namespace, String localPart, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String writerPrefix = xmlWriter.getPrefix(namespace);
       if (writerPrefix != null) {
         xmlWriter.writeStartElement(namespace, localPart);
       } else {
         if (namespace.length() == 0)
           prefix = "";
         else if (prefix == null) {
           prefix = generatePrefix(namespace);
         }
 
         xmlWriter.writeStartElement(prefix, localPart, namespace);
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
     }
 
     private void writeAttribute(String prefix, String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (xmlWriter.getPrefix(namespace) == null) {
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       xmlWriter.writeAttribute(namespace, attName, attValue);
     }
 
     private void writeAttribute(String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attValue);
       }
     }
 
     private void writeQNameAttribute(String namespace, String attName, QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String attributeNamespace = qname.getNamespaceURI();
       String attributePrefix = xmlWriter.getPrefix(attributeNamespace);
 
       if (attributePrefix == null)
         attributePrefix = registerPrefix(xmlWriter, attributeNamespace);
       String attributeValue;
       if (attributePrefix.trim().length() > 0)
         attributeValue = attributePrefix + ":" + qname.getLocalPart();
       else {
         attributeValue = qname.getLocalPart();
       }
 
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attributeValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attributeValue);
       }
     }
 
     private void writeQName(QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String namespaceURI = qname.getNamespaceURI();
       if (namespaceURI != null) {
         String prefix = xmlWriter.getPrefix(namespaceURI);
         if (prefix == null) {
           prefix = generatePrefix(namespaceURI);
           xmlWriter.writeNamespace(prefix, namespaceURI);
           xmlWriter.setPrefix(prefix, namespaceURI);
         }
 
         if (prefix.trim().length() > 0) {
           xmlWriter.writeCharacters(prefix + ":" + ConverterUtil.convertToString(qname));
         }
         else
         {
           xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
         }
 
       }
       else
       {
         xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
       }
     }
 
     private void writeQNames(QName[] qnames, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (qnames != null)
       {
         StringBuffer stringToWrite = new StringBuffer();
         String namespaceURI = null;
         String prefix = null;
 
         for (int i = 0; i < qnames.length; i++) {
           if (i > 0) {
             stringToWrite.append(" ");
           }
           namespaceURI = qnames[i].getNamespaceURI();
           if (namespaceURI != null) {
             prefix = xmlWriter.getPrefix(namespaceURI);
             if ((prefix == null) || (prefix.length() == 0)) {
               prefix = generatePrefix(namespaceURI);
               xmlWriter.writeNamespace(prefix, namespaceURI);
               xmlWriter.setPrefix(prefix, namespaceURI);
             }
 
             if (prefix.trim().length() > 0) {
               stringToWrite.append(prefix).append(":").append(ConverterUtil.convertToString(qnames[i]));
             }
             else
             {
               stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
             }
           }
           else
           {
             stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
           }
 
         }
 
         xmlWriter.writeCharacters(stringToWrite.toString());
       }
     }
 
     private String registerPrefix(XMLStreamWriter xmlWriter, String namespace)
       throws XMLStreamException
     {
       String prefix = xmlWriter.getPrefix(namespace);
       if (prefix == null) {
         prefix = generatePrefix(namespace);
         NamespaceContext nsContext = xmlWriter.getNamespaceContext();
         while (true)
         {
           String uri = nsContext.getNamespaceURI(prefix);
           if ((uri == null) || (uri.length() == 0)) {
             break;
           }
           prefix = BeanUtil.getUniquePrefix();
         }
 
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       return prefix;
     }
 
     public XMLStreamReader getPullParser(QName qName)
       throws ADBException
     {
       ArrayList elementList = new ArrayList();
       ArrayList attribList = new ArrayList();
 
       elementList.add(new QName("http://tempuri.org/", "SendMessageResult"));
 
       elementList.add(ConverterUtil.convertToString(this.localSendMessageResult));
 
       return new ADBXMLStreamReaderImpl(qName, elementList.toArray(), attribList.toArray());
     }
 
     public static class Factory
     {
       public static UcpBusinessServiceStub.SendMessageResponse parse(XMLStreamReader reader)
         throws Exception
       {
         UcpBusinessServiceStub.SendMessageResponse object = new UcpBusinessServiceStub.SendMessageResponse();
 
         String nillableValue = null;
         String prefix = "";
         String namespaceuri = "";
         try
         {
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type") != null)
           {
             String fullTypeName = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type");
 
             if (fullTypeName != null) {
               String nsPrefix = null;
               if (fullTypeName.indexOf(":") > -1) {
                 nsPrefix = fullTypeName.substring(0, fullTypeName.indexOf(":"));
               }
 
               nsPrefix = nsPrefix == null ? "" : nsPrefix;
 
               String type = fullTypeName.substring(fullTypeName.indexOf(":") + 1);
 
               if (!"SendMessageResponse".equals(type))
               {
                 String nsUri = reader.getNamespaceContext().getNamespaceURI(nsPrefix);
 
                 return (UcpBusinessServiceStub.SendMessageResponse)UcpBusinessServiceStub.ExtensionMapper.getTypeObject(nsUri, type, reader);
               }
 
             }
 
           }
 
           Vector handledAttributes = new Vector();
 
           reader.next();
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "SendMessageResult").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: SendMessageResult  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setSendMessageResult(ConverterUtil.convertToBoolean(content));
 
             reader.next();
           }
           else
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.isStartElement())
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
         }
         catch (XMLStreamException e) {
           throw new Exception(e);
         }
 
         return object;
       }
     }
   }
 
   public static class SendMessageToAppResponse
     implements ADBBean
   {
     public static final QName MY_QNAME = new QName("http://tempuri.org/", "SendMessageToAppResponse", "ns1");
     protected boolean localSendMessageToAppResult;
 
     public boolean getSendMessageToAppResult()
     {
       return this.localSendMessageToAppResult;
     }
 
     public void setSendMessageToAppResult(boolean param)
     {
       this.localSendMessageToAppResult = param;
     }
 
     public OMElement getOMElement(QName parentQName, OMFactory factory)
       throws ADBException
     {
       OMDataSource dataSource = new ADBDataSource(this, MY_QNAME);
 
       return factory.createOMElement(dataSource, MY_QNAME);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter)
       throws XMLStreamException, ADBException
     {
       serialize(parentQName, xmlWriter, false);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter, boolean serializeType)
       throws XMLStreamException, ADBException
     {
       String prefix = null;
       String namespace = null;
 
       prefix = parentQName.getPrefix();
       namespace = parentQName.getNamespaceURI();
       writeStartElement(prefix, namespace, parentQName.getLocalPart(), xmlWriter);
 
       if (serializeType)
       {
         String namespacePrefix = registerPrefix(xmlWriter, "http://tempuri.org/");
 
         if ((namespacePrefix != null) && (namespacePrefix.trim().length() > 0))
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", namespacePrefix + ":SendMessageToAppResponse", xmlWriter);
         }
         else
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", "SendMessageToAppResponse", xmlWriter);
         }
 
       }
 
       namespace = "http://tempuri.org/";
       writeStartElement(null, namespace, "SendMessageToAppResult", xmlWriter);
 
       xmlWriter.writeCharacters(ConverterUtil.convertToString(this.localSendMessageToAppResult));
 
       xmlWriter.writeEndElement();
 
       xmlWriter.writeEndElement();
     }
 
     private static String generatePrefix(String namespace)
     {
       if (namespace.equals("http://tempuri.org/")) {
         return "ns1";
       }
       return BeanUtil.getUniquePrefix();
     }
 
     private void writeStartElement(String prefix, String namespace, String localPart, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String writerPrefix = xmlWriter.getPrefix(namespace);
       if (writerPrefix != null) {
         xmlWriter.writeStartElement(namespace, localPart);
       } else {
         if (namespace.length() == 0)
           prefix = "";
         else if (prefix == null) {
           prefix = generatePrefix(namespace);
         }
 
         xmlWriter.writeStartElement(prefix, localPart, namespace);
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
     }
 
     private void writeAttribute(String prefix, String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (xmlWriter.getPrefix(namespace) == null) {
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       xmlWriter.writeAttribute(namespace, attName, attValue);
     }
 
     private void writeAttribute(String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attValue);
       }
     }
 
     private void writeQNameAttribute(String namespace, String attName, QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String attributeNamespace = qname.getNamespaceURI();
       String attributePrefix = xmlWriter.getPrefix(attributeNamespace);
 
       if (attributePrefix == null)
         attributePrefix = registerPrefix(xmlWriter, attributeNamespace);
       String attributeValue;
       if (attributePrefix.trim().length() > 0)
         attributeValue = attributePrefix + ":" + qname.getLocalPart();
       else {
         attributeValue = qname.getLocalPart();
       }
 
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attributeValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attributeValue);
       }
     }
 
     private void writeQName(QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String namespaceURI = qname.getNamespaceURI();
       if (namespaceURI != null) {
         String prefix = xmlWriter.getPrefix(namespaceURI);
         if (prefix == null) {
           prefix = generatePrefix(namespaceURI);
           xmlWriter.writeNamespace(prefix, namespaceURI);
           xmlWriter.setPrefix(prefix, namespaceURI);
         }
 
         if (prefix.trim().length() > 0) {
           xmlWriter.writeCharacters(prefix + ":" + ConverterUtil.convertToString(qname));
         }
         else
         {
           xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
         }
 
       }
       else
       {
         xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
       }
     }
 
     private void writeQNames(QName[] qnames, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (qnames != null)
       {
         StringBuffer stringToWrite = new StringBuffer();
         String namespaceURI = null;
         String prefix = null;
 
         for (int i = 0; i < qnames.length; i++) {
           if (i > 0) {
             stringToWrite.append(" ");
           }
           namespaceURI = qnames[i].getNamespaceURI();
           if (namespaceURI != null) {
             prefix = xmlWriter.getPrefix(namespaceURI);
             if ((prefix == null) || (prefix.length() == 0)) {
               prefix = generatePrefix(namespaceURI);
               xmlWriter.writeNamespace(prefix, namespaceURI);
               xmlWriter.setPrefix(prefix, namespaceURI);
             }
 
             if (prefix.trim().length() > 0) {
               stringToWrite.append(prefix).append(":").append(ConverterUtil.convertToString(qnames[i]));
             }
             else
             {
               stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
             }
           }
           else
           {
             stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
           }
 
         }
 
         xmlWriter.writeCharacters(stringToWrite.toString());
       }
     }
 
     private String registerPrefix(XMLStreamWriter xmlWriter, String namespace)
       throws XMLStreamException
     {
       String prefix = xmlWriter.getPrefix(namespace);
       if (prefix == null) {
         prefix = generatePrefix(namespace);
         NamespaceContext nsContext = xmlWriter.getNamespaceContext();
         while (true)
         {
           String uri = nsContext.getNamespaceURI(prefix);
           if ((uri == null) || (uri.length() == 0)) {
             break;
           }
           prefix = BeanUtil.getUniquePrefix();
         }
 
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       return prefix;
     }
 
     public XMLStreamReader getPullParser(QName qName)
       throws ADBException
     {
       ArrayList elementList = new ArrayList();
       ArrayList attribList = new ArrayList();
 
       elementList.add(new QName("http://tempuri.org/", "SendMessageToAppResult"));
 
       elementList.add(ConverterUtil.convertToString(this.localSendMessageToAppResult));
 
       return new ADBXMLStreamReaderImpl(qName, elementList.toArray(), attribList.toArray());
     }
 
     public static class Factory
     {
       public static UcpBusinessServiceStub.SendMessageToAppResponse parse(XMLStreamReader reader)
         throws Exception
       {
         UcpBusinessServiceStub.SendMessageToAppResponse object = new UcpBusinessServiceStub.SendMessageToAppResponse();
 
         String nillableValue = null;
         String prefix = "";
         String namespaceuri = "";
         try
         {
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type") != null)
           {
             String fullTypeName = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type");
 
             if (fullTypeName != null) {
               String nsPrefix = null;
               if (fullTypeName.indexOf(":") > -1) {
                 nsPrefix = fullTypeName.substring(0, fullTypeName.indexOf(":"));
               }
 
               nsPrefix = nsPrefix == null ? "" : nsPrefix;
 
               String type = fullTypeName.substring(fullTypeName.indexOf(":") + 1);
 
               if (!"SendMessageToAppResponse".equals(type))
               {
                 String nsUri = reader.getNamespaceContext().getNamespaceURI(nsPrefix);
 
                 return (UcpBusinessServiceStub.SendMessageToAppResponse)UcpBusinessServiceStub.ExtensionMapper.getTypeObject(nsUri, type, reader);
               }
 
             }
 
           }
 
           Vector handledAttributes = new Vector();
 
           reader.next();
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "SendMessageToAppResult").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: SendMessageToAppResult  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setSendMessageToAppResult(ConverterUtil.convertToBoolean(content));
 
             reader.next();
           }
           else
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.isStartElement())
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
         }
         catch (XMLStreamException e) {
           throw new Exception(e);
         }
 
         return object;
       }
     }
   }
 
   public static class SendMessageToApp
     implements ADBBean
   {
     public static final QName MY_QNAME = new QName("http://tempuri.org/", "SendMessageToApp", "ns1");
     protected String localApp;
     protected boolean localAppTracker;
     protected String localFrom;
     protected boolean localFromTracker;
     protected String localTo;
     protected boolean localToTracker;
     protected String localSubject;
     protected boolean localSubjectTracker;
     protected String localBody;
     protected boolean localBodyTracker;
     protected String localUri;
     protected boolean localUriTracker;
 
     public SendMessageToApp()
     {
       this.localAppTracker = false;
 
       this.localFromTracker = false;
 
       this.localToTracker = false;
 
       this.localSubjectTracker = false;
 
       this.localBodyTracker = false;
 
       this.localUriTracker = false;
     }
 
     public boolean isAppSpecified()
     {
       return this.localAppTracker;
     }
 
     public String getApp()
     {
       return this.localApp;
     }
 
     public void setApp(String param)
     {
       this.localAppTracker = (param != null);
 
       this.localApp = param;
     }
 
     public boolean isFromSpecified()
     {
       return this.localFromTracker;
     }
 
     public String getFrom()
     {
       return this.localFrom;
     }
 
     public void setFrom(String param)
     {
       this.localFromTracker = (param != null);
 
       this.localFrom = param;
     }
 
     public boolean isToSpecified()
     {
       return this.localToTracker;
     }
 
     public String getTo()
     {
       return this.localTo;
     }
 
     public void setTo(String param)
     {
       this.localToTracker = (param != null);
 
       this.localTo = param;
     }
 
     public boolean isSubjectSpecified()
     {
       return this.localSubjectTracker;
     }
 
     public String getSubject()
     {
       return this.localSubject;
     }
 
     public void setSubject(String param)
     {
       this.localSubjectTracker = (param != null);
 
       this.localSubject = param;
     }
 
     public boolean isBodySpecified()
     {
       return this.localBodyTracker;
     }
 
     public String getBody()
     {
       return this.localBody;
     }
 
     public void setBody(String param)
     {
       this.localBodyTracker = (param != null);
 
       this.localBody = param;
     }
 
     public boolean isUriSpecified()
     {
       return this.localUriTracker;
     }
 
     public String getUri()
     {
       return this.localUri;
     }
 
     public void setUri(String param)
     {
       this.localUriTracker = (param != null);
 
       this.localUri = param;
     }
 
     public OMElement getOMElement(QName parentQName, OMFactory factory)
       throws ADBException
     {
       OMDataSource dataSource = new ADBDataSource(this, MY_QNAME);
 
       return factory.createOMElement(dataSource, MY_QNAME);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter)
       throws XMLStreamException, ADBException
     {
       serialize(parentQName, xmlWriter, false);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter, boolean serializeType)
       throws XMLStreamException, ADBException
     {
       String prefix = null;
       String namespace = null;
 
       prefix = parentQName.getPrefix();
       namespace = parentQName.getNamespaceURI();
       writeStartElement(prefix, namespace, parentQName.getLocalPart(), xmlWriter);
 
       if (serializeType)
       {
         String namespacePrefix = registerPrefix(xmlWriter, "http://tempuri.org/");
 
         if ((namespacePrefix != null) && (namespacePrefix.trim().length() > 0))
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", namespacePrefix + ":SendMessageToApp", xmlWriter);
         }
         else
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", "SendMessageToApp", xmlWriter);
         }
 
       }
 
       if (this.localAppTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "app", xmlWriter);
 
         if (this.localApp == null)
         {
           throw new ADBException("app cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localApp);
 
         xmlWriter.writeEndElement();
       }
       if (this.localFromTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "from", xmlWriter);
 
         if (this.localFrom == null)
         {
           throw new ADBException("from cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localFrom);
 
         xmlWriter.writeEndElement();
       }
       if (this.localToTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "to", xmlWriter);
 
         if (this.localTo == null)
         {
           throw new ADBException("to cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localTo);
 
         xmlWriter.writeEndElement();
       }
       if (this.localSubjectTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "subject", xmlWriter);
 
         if (this.localSubject == null)
         {
           throw new ADBException("subject cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localSubject);
 
         xmlWriter.writeEndElement();
       }
       if (this.localBodyTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "body", xmlWriter);
 
         if (this.localBody == null)
         {
           throw new ADBException("body cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localBody);
 
         xmlWriter.writeEndElement();
       }
       if (this.localUriTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "uri", xmlWriter);
 
         if (this.localUri == null)
         {
           throw new ADBException("uri cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localUri);
 
         xmlWriter.writeEndElement();
       }
       xmlWriter.writeEndElement();
     }
 
     private static String generatePrefix(String namespace)
     {
       if (namespace.equals("http://tempuri.org/")) {
         return "ns1";
       }
       return BeanUtil.getUniquePrefix();
     }
 
     private void writeStartElement(String prefix, String namespace, String localPart, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String writerPrefix = xmlWriter.getPrefix(namespace);
       if (writerPrefix != null) {
         xmlWriter.writeStartElement(namespace, localPart);
       } else {
         if (namespace.length() == 0)
           prefix = "";
         else if (prefix == null) {
           prefix = generatePrefix(namespace);
         }
 
         xmlWriter.writeStartElement(prefix, localPart, namespace);
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
     }
 
     private void writeAttribute(String prefix, String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (xmlWriter.getPrefix(namespace) == null) {
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       xmlWriter.writeAttribute(namespace, attName, attValue);
     }
 
     private void writeAttribute(String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attValue);
       }
     }
 
     private void writeQNameAttribute(String namespace, String attName, QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String attributeNamespace = qname.getNamespaceURI();
       String attributePrefix = xmlWriter.getPrefix(attributeNamespace);
 
       if (attributePrefix == null)
         attributePrefix = registerPrefix(xmlWriter, attributeNamespace);
       String attributeValue;
       if (attributePrefix.trim().length() > 0)
         attributeValue = attributePrefix + ":" + qname.getLocalPart();
       else {
         attributeValue = qname.getLocalPart();
       }
 
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attributeValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attributeValue);
       }
     }
 
     private void writeQName(QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String namespaceURI = qname.getNamespaceURI();
       if (namespaceURI != null) {
         String prefix = xmlWriter.getPrefix(namespaceURI);
         if (prefix == null) {
           prefix = generatePrefix(namespaceURI);
           xmlWriter.writeNamespace(prefix, namespaceURI);
           xmlWriter.setPrefix(prefix, namespaceURI);
         }
 
         if (prefix.trim().length() > 0) {
           xmlWriter.writeCharacters(prefix + ":" + ConverterUtil.convertToString(qname));
         }
         else
         {
           xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
         }
 
       }
       else
       {
         xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
       }
     }
 
     private void writeQNames(QName[] qnames, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (qnames != null)
       {
         StringBuffer stringToWrite = new StringBuffer();
         String namespaceURI = null;
         String prefix = null;
 
         for (int i = 0; i < qnames.length; i++) {
           if (i > 0) {
             stringToWrite.append(" ");
           }
           namespaceURI = qnames[i].getNamespaceURI();
           if (namespaceURI != null) {
             prefix = xmlWriter.getPrefix(namespaceURI);
             if ((prefix == null) || (prefix.length() == 0)) {
               prefix = generatePrefix(namespaceURI);
               xmlWriter.writeNamespace(prefix, namespaceURI);
               xmlWriter.setPrefix(prefix, namespaceURI);
             }
 
             if (prefix.trim().length() > 0) {
               stringToWrite.append(prefix).append(":").append(ConverterUtil.convertToString(qnames[i]));
             }
             else
             {
               stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
             }
           }
           else
           {
             stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
           }
 
         }
 
         xmlWriter.writeCharacters(stringToWrite.toString());
       }
     }
 
     private String registerPrefix(XMLStreamWriter xmlWriter, String namespace)
       throws XMLStreamException
     {
       String prefix = xmlWriter.getPrefix(namespace);
       if (prefix == null) {
         prefix = generatePrefix(namespace);
         NamespaceContext nsContext = xmlWriter.getNamespaceContext();
         while (true)
         {
           String uri = nsContext.getNamespaceURI(prefix);
           if ((uri == null) || (uri.length() == 0)) {
             break;
           }
           prefix = BeanUtil.getUniquePrefix();
         }
 
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       return prefix;
     }
 
     public XMLStreamReader getPullParser(QName qName)
       throws ADBException
     {
       ArrayList elementList = new ArrayList();
       ArrayList attribList = new ArrayList();
 
       if (this.localAppTracker) {
         elementList.add(new QName("http://tempuri.org/", "app"));
 
         if (this.localApp != null) {
           elementList.add(ConverterUtil.convertToString(this.localApp));
         }
         else
         {
           throw new ADBException("app cannot be null!!");
         }
       }
 
       if (this.localFromTracker) {
         elementList.add(new QName("http://tempuri.org/", "from"));
 
         if (this.localFrom != null) {
           elementList.add(ConverterUtil.convertToString(this.localFrom));
         }
         else
         {
           throw new ADBException("from cannot be null!!");
         }
       }
 
       if (this.localToTracker) {
         elementList.add(new QName("http://tempuri.org/", "to"));
 
         if (this.localTo != null) {
           elementList.add(ConverterUtil.convertToString(this.localTo));
         }
         else
         {
           throw new ADBException("to cannot be null!!");
         }
       }
 
       if (this.localSubjectTracker) {
         elementList.add(new QName("http://tempuri.org/", "subject"));
 
         if (this.localSubject != null) {
           elementList.add(ConverterUtil.convertToString(this.localSubject));
         }
         else
         {
           throw new ADBException("subject cannot be null!!");
         }
       }
 
       if (this.localBodyTracker) {
         elementList.add(new QName("http://tempuri.org/", "body"));
 
         if (this.localBody != null) {
           elementList.add(ConverterUtil.convertToString(this.localBody));
         }
         else
         {
           throw new ADBException("body cannot be null!!");
         }
       }
 
       if (this.localUriTracker) {
         elementList.add(new QName("http://tempuri.org/", "uri"));
 
         if (this.localUri != null) {
           elementList.add(ConverterUtil.convertToString(this.localUri));
         }
         else
         {
           throw new ADBException("uri cannot be null!!");
         }
 
       }
 
       return new ADBXMLStreamReaderImpl(qName, elementList.toArray(), attribList.toArray());
     }
 
     public static class Factory
     {
       public static UcpBusinessServiceStub.SendMessageToApp parse(XMLStreamReader reader)
         throws Exception
       {
         UcpBusinessServiceStub.SendMessageToApp object = new UcpBusinessServiceStub.SendMessageToApp();
 
         String nillableValue = null;
         String prefix = "";
         String namespaceuri = "";
         try
         {
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type") != null)
           {
             String fullTypeName = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type");
 
             if (fullTypeName != null) {
               String nsPrefix = null;
               if (fullTypeName.indexOf(":") > -1) {
                 nsPrefix = fullTypeName.substring(0, fullTypeName.indexOf(":"));
               }
 
               nsPrefix = nsPrefix == null ? "" : nsPrefix;
 
               String type = fullTypeName.substring(fullTypeName.indexOf(":") + 1);
 
               if (!"SendMessageToApp".equals(type))
               {
                 String nsUri = reader.getNamespaceContext().getNamespaceURI(nsPrefix);
 
                 return (UcpBusinessServiceStub.SendMessageToApp)UcpBusinessServiceStub.ExtensionMapper.getTypeObject(nsUri, type, reader);
               }
 
             }
 
           }
 
           Vector handledAttributes = new Vector();
 
           reader.next();
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "app").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: app  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setApp(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "from").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: from  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setFrom(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "to").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: to  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setTo(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "subject").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: subject  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setSubject(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "body").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: body  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setBody(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "uri").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: uri  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setUri(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.isStartElement())
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
         }
         catch (XMLStreamException e) {
           throw new Exception(e);
         }
 
         return object;
       }
     }
   }
 
   public static class ExtensionMapper
   {
     public static Object getTypeObject(String namespaceURI, String typeName, XMLStreamReader reader)
       throws Exception
     {
       throw new ADBException("Unsupported type " + namespaceURI + " " + typeName);
     }
   }
 
   public static class SendMessage
     implements ADBBean
   {
     public static final QName MY_QNAME = new QName("http://tempuri.org/", "SendMessage", "ns1");
     protected String localFrom;
     protected boolean localFromTracker;
     protected String localTo;
     protected boolean localToTracker;
     protected String localSubject;
     protected boolean localSubjectTracker;
     protected String localBody;
     protected boolean localBodyTracker;
     protected String localUri;
     protected boolean localUriTracker;
 
     public SendMessage()
     {
       this.localFromTracker = false;
 
       this.localToTracker = false;
 
       this.localSubjectTracker = false;
 
       this.localBodyTracker = false;
 
       this.localUriTracker = false;
     }
 
     public boolean isFromSpecified()
     {
       return this.localFromTracker;
     }
 
     public String getFrom()
     {
       return this.localFrom;
     }
 
     public void setFrom(String param)
     {
       this.localFromTracker = (param != null);
 
       this.localFrom = param;
     }
 
     public boolean isToSpecified()
     {
       return this.localToTracker;
     }
 
     public String getTo()
     {
       return this.localTo;
     }
 
     public void setTo(String param)
     {
       this.localToTracker = (param != null);
 
       this.localTo = param;
     }
 
     public boolean isSubjectSpecified()
     {
       return this.localSubjectTracker;
     }
 
     public String getSubject()
     {
       return this.localSubject;
     }
 
     public void setSubject(String param)
     {
       this.localSubjectTracker = (param != null);
 
       this.localSubject = param;
     }
 
     public boolean isBodySpecified()
     {
       return this.localBodyTracker;
     }
 
     public String getBody()
     {
       return this.localBody;
     }
 
     public void setBody(String param)
     {
       this.localBodyTracker = (param != null);
 
       this.localBody = param;
     }
 
     public boolean isUriSpecified()
     {
       return this.localUriTracker;
     }
 
     public String getUri()
     {
       return this.localUri;
     }
 
     public void setUri(String param)
     {
       this.localUriTracker = (param != null);
 
       this.localUri = param;
     }
 
     public OMElement getOMElement(QName parentQName, OMFactory factory)
       throws ADBException
     {
       OMDataSource dataSource = new ADBDataSource(this, MY_QNAME);
 
       return factory.createOMElement(dataSource, MY_QNAME);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter)
       throws XMLStreamException, ADBException
     {
       serialize(parentQName, xmlWriter, false);
     }
 
     public void serialize(QName parentQName, XMLStreamWriter xmlWriter, boolean serializeType)
       throws XMLStreamException, ADBException
     {
       String prefix = null;
       String namespace = null;
 
       prefix = parentQName.getPrefix();
       namespace = parentQName.getNamespaceURI();
       writeStartElement(prefix, namespace, parentQName.getLocalPart(), xmlWriter);
 
       if (serializeType)
       {
         String namespacePrefix = registerPrefix(xmlWriter, "http://tempuri.org/");
 
         if ((namespacePrefix != null) && (namespacePrefix.trim().length() > 0))
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", namespacePrefix + ":SendMessage", xmlWriter);
         }
         else
         {
           writeAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance", "type", "SendMessage", xmlWriter);
         }
 
       }
 
       if (this.localFromTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "from", xmlWriter);
 
         if (this.localFrom == null)
         {
           throw new ADBException("from cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localFrom);
 
         xmlWriter.writeEndElement();
       }
       if (this.localToTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "to", xmlWriter);
 
         if (this.localTo == null)
         {
           throw new ADBException("to cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localTo);
 
         xmlWriter.writeEndElement();
       }
       if (this.localSubjectTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "subject", xmlWriter);
 
         if (this.localSubject == null)
         {
           throw new ADBException("subject cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localSubject);
 
         xmlWriter.writeEndElement();
       }
       if (this.localBodyTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "body", xmlWriter);
 
         if (this.localBody == null)
         {
           throw new ADBException("body cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localBody);
 
         xmlWriter.writeEndElement();
       }
       if (this.localUriTracker) {
         namespace = "http://tempuri.org/";
         writeStartElement(null, namespace, "uri", xmlWriter);
 
         if (this.localUri == null)
         {
           throw new ADBException("uri cannot be null!!");
         }
 
         xmlWriter.writeCharacters(this.localUri);
 
         xmlWriter.writeEndElement();
       }
       xmlWriter.writeEndElement();
     }
 
     private static String generatePrefix(String namespace)
     {
       if (namespace.equals("http://tempuri.org/")) {
         return "ns1";
       }
       return BeanUtil.getUniquePrefix();
     }
 
     private void writeStartElement(String prefix, String namespace, String localPart, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String writerPrefix = xmlWriter.getPrefix(namespace);
       if (writerPrefix != null) {
         xmlWriter.writeStartElement(namespace, localPart);
       } else {
         if (namespace.length() == 0)
           prefix = "";
         else if (prefix == null) {
           prefix = generatePrefix(namespace);
         }
 
         xmlWriter.writeStartElement(prefix, localPart, namespace);
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
     }
 
     private void writeAttribute(String prefix, String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (xmlWriter.getPrefix(namespace) == null) {
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       xmlWriter.writeAttribute(namespace, attName, attValue);
     }
 
     private void writeAttribute(String namespace, String attName, String attValue, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attValue);
       }
     }
 
     private void writeQNameAttribute(String namespace, String attName, QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String attributeNamespace = qname.getNamespaceURI();
       String attributePrefix = xmlWriter.getPrefix(attributeNamespace);
 
       if (attributePrefix == null)
         attributePrefix = registerPrefix(xmlWriter, attributeNamespace);
       String attributeValue;
       if (attributePrefix.trim().length() > 0)
         attributeValue = attributePrefix + ":" + qname.getLocalPart();
       else {
         attributeValue = qname.getLocalPart();
       }
 
       if (namespace.equals("")) {
         xmlWriter.writeAttribute(attName, attributeValue);
       } else {
         registerPrefix(xmlWriter, namespace);
         xmlWriter.writeAttribute(namespace, attName, attributeValue);
       }
     }
 
     private void writeQName(QName qname, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       String namespaceURI = qname.getNamespaceURI();
       if (namespaceURI != null) {
         String prefix = xmlWriter.getPrefix(namespaceURI);
         if (prefix == null) {
           prefix = generatePrefix(namespaceURI);
           xmlWriter.writeNamespace(prefix, namespaceURI);
           xmlWriter.setPrefix(prefix, namespaceURI);
         }
 
         if (prefix.trim().length() > 0) {
           xmlWriter.writeCharacters(prefix + ":" + ConverterUtil.convertToString(qname));
         }
         else
         {
           xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
         }
 
       }
       else
       {
         xmlWriter.writeCharacters(ConverterUtil.convertToString(qname));
       }
     }
 
     private void writeQNames(QName[] qnames, XMLStreamWriter xmlWriter)
       throws XMLStreamException
     {
       if (qnames != null)
       {
         StringBuffer stringToWrite = new StringBuffer();
         String namespaceURI = null;
         String prefix = null;
 
         for (int i = 0; i < qnames.length; i++) {
           if (i > 0) {
             stringToWrite.append(" ");
           }
           namespaceURI = qnames[i].getNamespaceURI();
           if (namespaceURI != null) {
             prefix = xmlWriter.getPrefix(namespaceURI);
             if ((prefix == null) || (prefix.length() == 0)) {
               prefix = generatePrefix(namespaceURI);
               xmlWriter.writeNamespace(prefix, namespaceURI);
               xmlWriter.setPrefix(prefix, namespaceURI);
             }
 
             if (prefix.trim().length() > 0) {
               stringToWrite.append(prefix).append(":").append(ConverterUtil.convertToString(qnames[i]));
             }
             else
             {
               stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
             }
           }
           else
           {
             stringToWrite.append(ConverterUtil.convertToString(qnames[i]));
           }
 
         }
 
         xmlWriter.writeCharacters(stringToWrite.toString());
       }
     }
 
     private String registerPrefix(XMLStreamWriter xmlWriter, String namespace)
       throws XMLStreamException
     {
       String prefix = xmlWriter.getPrefix(namespace);
       if (prefix == null) {
         prefix = generatePrefix(namespace);
         NamespaceContext nsContext = xmlWriter.getNamespaceContext();
         while (true)
         {
           String uri = nsContext.getNamespaceURI(prefix);
           if ((uri == null) || (uri.length() == 0)) {
             break;
           }
           prefix = BeanUtil.getUniquePrefix();
         }
 
         xmlWriter.writeNamespace(prefix, namespace);
         xmlWriter.setPrefix(prefix, namespace);
       }
       return prefix;
     }
 
     public XMLStreamReader getPullParser(QName qName)
       throws ADBException
     {
       ArrayList elementList = new ArrayList();
       ArrayList attribList = new ArrayList();
 
       if (this.localFromTracker) {
         elementList.add(new QName("http://tempuri.org/", "from"));
 
         if (this.localFrom != null) {
           elementList.add(ConverterUtil.convertToString(this.localFrom));
         }
         else
         {
           throw new ADBException("from cannot be null!!");
         }
       }
 
       if (this.localToTracker) {
         elementList.add(new QName("http://tempuri.org/", "to"));
 
         if (this.localTo != null) {
           elementList.add(ConverterUtil.convertToString(this.localTo));
         }
         else
         {
           throw new ADBException("to cannot be null!!");
         }
       }
 
       if (this.localSubjectTracker) {
         elementList.add(new QName("http://tempuri.org/", "subject"));
 
         if (this.localSubject != null) {
           elementList.add(ConverterUtil.convertToString(this.localSubject));
         }
         else
         {
           throw new ADBException("subject cannot be null!!");
         }
       }
 
       if (this.localBodyTracker) {
         elementList.add(new QName("http://tempuri.org/", "body"));
 
         if (this.localBody != null) {
           elementList.add(ConverterUtil.convertToString(this.localBody));
         }
         else
         {
           throw new ADBException("body cannot be null!!");
         }
       }
 
       if (this.localUriTracker) {
         elementList.add(new QName("http://tempuri.org/", "uri"));
 
         if (this.localUri != null) {
           elementList.add(ConverterUtil.convertToString(this.localUri));
         }
         else
         {
           throw new ADBException("uri cannot be null!!");
         }
 
       }
 
       return new ADBXMLStreamReaderImpl(qName, elementList.toArray(), attribList.toArray());
     }
 
     public static class Factory
     {
       public static UcpBusinessServiceStub.SendMessage parse(XMLStreamReader reader)
         throws Exception
       {
         UcpBusinessServiceStub.SendMessage object = new UcpBusinessServiceStub.SendMessage();
 
         String nillableValue = null;
         String prefix = "";
         String namespaceuri = "";
         try
         {
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type") != null)
           {
             String fullTypeName = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "type");
 
             if (fullTypeName != null) {
               String nsPrefix = null;
               if (fullTypeName.indexOf(":") > -1) {
                 nsPrefix = fullTypeName.substring(0, fullTypeName.indexOf(":"));
               }
 
               nsPrefix = nsPrefix == null ? "" : nsPrefix;
 
               String type = fullTypeName.substring(fullTypeName.indexOf(":") + 1);
 
               if (!"SendMessage".equals(type))
               {
                 String nsUri = reader.getNamespaceContext().getNamespaceURI(nsPrefix);
 
                 return (UcpBusinessServiceStub.SendMessage)UcpBusinessServiceStub.ExtensionMapper.getTypeObject(nsUri, type, reader);
               }
 
             }
 
           }
 
           Vector handledAttributes = new Vector();
 
           reader.next();
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "from").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: from  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setFrom(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "to").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: to  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setTo(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "subject").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: subject  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setSubject(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "body").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: body  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setBody(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if ((reader.isStartElement()) && (new QName("http://tempuri.org/", "uri").equals(reader.getName())))
           {
             nillableValue = reader.getAttributeValue("http://www.w3.org/2001/XMLSchema-instance", "nil");
 
             if (("true".equals(nillableValue)) || ("1".equals(nillableValue)))
             {
               throw new ADBException("The element: uri  cannot be null");
             }
 
             String content = reader.getElementText();
 
             object.setUri(ConverterUtil.convertToString(content));
 
             reader.next();
           }
 
           while ((!reader.isStartElement()) && (!reader.isEndElement())) {
             reader.next();
           }
           if (reader.isStartElement())
           {
             throw new ADBException("Unexpected subelement " + reader.getName());
           }
         }
         catch (XMLStreamException e) {
           throw new Exception(e);
         }
 
         return object;
       }
     }
   }
 }


package com.test.qlexpress;

import org.junit.Assert;

import com.ql.util.express.ExpressRunner;

public class HelloQLExpress {

	@org.junit.Test
	public void testDemo() throws Exception {
		String express = "10 * 10 + 1 + 2 * 3 + 5 * 2";
		ExpressRunner runner = new ExpressRunner(false, true);
		Object r = runner.execute(express, null, null, false, true);
		Assert.assertTrue("表达式计算", r.toString().equalsIgnoreCase("117"));
		System.out.println("表达式计算：" + express + " = " + r);
	}
}

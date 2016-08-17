package com.ldz.demo.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class HelloController implements Controller {

	@Override
	public ModelAndView handleRequest(HttpServletRequest arg0, HttpServletResponse arg1) throws Exception {
		// 创建模型跟视图，用于渲染页面。并且指定要返回的页面为home页面
		ModelAndView mav = new ModelAndView("hello");
		mav.addObject("desc", "大写的赞");
		return mav;
	}

}

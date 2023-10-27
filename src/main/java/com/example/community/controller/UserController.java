package com.example.community.controller;


import com.example.community.entity.User;
import com.example.community.mapper.RoleMapper;
import com.example.community.service.MenuService;
import com.example.community.service.impl.MenuServiceImpl;
import com.example.community.util.Result;
import com.example.community.vo.MenuRouterVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * <p>
 * 系统用户 前端控制器
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
@RestController
@RequestMapping("/sys/user")
public class UserController {
    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private MenuServiceImpl menuService;

    @GetMapping("/getRouters")
    public Result getRouters(HttpSession session){
        User user = (User)session.getAttribute("user");
        String role = roleMapper.getRoleNameByUserId(user.getUserId());
        List<MenuRouterVO> routers = menuService.getMenuRouterByUserId(user.getUserId());
        return Result.ok()
                .put("data",user)
                .put("roles",role)
                .put("routers",routers);
    }
}


package com.example.community;

import com.example.community.entity.Menu;
import com.example.community.mapper.MenuMapper;
import com.example.community.mapper.RoleMapper;
import com.example.community.service.MenuService;
import com.example.community.service.impl.MenuServiceImpl;
import com.example.community.vo.MenuRouterVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class CommunityApplicationTests {

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private MenuMapper  menuMapper;

    @Autowired
    private MenuServiceImpl menuService;

    @Test
    void contextLoads() {
        List<MenuRouterVO> menuRouterByUserId = menuService.getMenuRouterByUserId(1);
        for (MenuRouterVO menuRouterVO : menuRouterByUserId) {
            System.out.println(menuRouterVO);
        }
    }

}

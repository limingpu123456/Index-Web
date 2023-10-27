package com.example.community.service;

import com.example.community.entity.Menu;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.community.vo.MenuRouterVO;

import java.util.List;

/**
 * <p>
 * 菜单管理 服务类
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
public interface MenuService extends IService<Menu> {
    public List<MenuRouterVO> getMenuRouterByUserId(Integer userId);
}

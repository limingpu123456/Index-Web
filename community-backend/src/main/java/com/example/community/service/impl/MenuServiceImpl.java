package com.example.community.service.impl;

import com.example.community.entity.Menu;
import com.example.community.mapper.MenuMapper;
import com.example.community.service.MenuService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.community.vo.ChildMenuRouterVO;
import com.example.community.vo.MenuRouterVO;
import com.example.community.vo.MetaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 菜单管理 服务实现类
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
@Service
public class MenuServiceImpl extends ServiceImpl<MenuMapper, Menu> implements MenuService {

    @Autowired
    private MenuMapper menuMapper;
    @Override
    public List<MenuRouterVO> getMenuRouterByUserId(Integer userId) {
        List<Menu> menuList = menuMapper.getMenusByUserId(userId);
        List<MenuRouterVO> result = new ArrayList<>();
        for (Menu menu : menuList) {
            if(menu.getParentId() == 0){
                MenuRouterVO menuRouterVO = new MenuRouterVO();
                //通过BeanUtils.copyProperties把menu里面的相同的属性的属性值直接赋值给menuRouterVO
                BeanUtils.copyProperties(menu,menuRouterVO);
                MetaVO metaVO = new MetaVO();
                metaVO.setIcon(menu.getIcon());
                metaVO.setTitle(menu.getName());
                menuRouterVO.setMeta(metaVO);
                //生成children
                int menuId = menu.getId();
                List<ChildMenuRouterVO> children = new ArrayList<>();
                for (Menu child : menuList) {
                    if(child.getParentId() == menuId){
                        ChildMenuRouterVO childVO = new ChildMenuRouterVO();
                        BeanUtils.copyProperties(child,childVO);
                        MetaVO childMetaVO = new MetaVO();
                        childMetaVO.setIcon(child.getIcon());
                        childMetaVO.setTitle(child.getName());
                        childVO.setMeta(childMetaVO);
                        children.add(childVO);
                    }
                }
                menuRouterVO.setChildren(children);
                result.add(menuRouterVO);
            }
        }
        return result;
    }
}

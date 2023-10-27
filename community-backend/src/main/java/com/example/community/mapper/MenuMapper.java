package com.example.community.mapper;

import com.example.community.entity.Menu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 * 菜单管理 Mapper 接口
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
public interface MenuMapper extends BaseMapper<Menu> {
    @Select({
            "select * from menu m,user_role ur,role_menu rm where m.hidden = 'false' and ur.role_id = rm.role_id and rm.menu_id = m.id and ur.user_id = #{userId} order by m.sort"
    })
    public List<Menu> getMenusByUserId(Integer userId);
}

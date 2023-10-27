package com.example.community.mapper;

import com.example.community.entity.Role;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
public interface RoleMapper extends BaseMapper<Role> {
    @Select({
            "select r.role_name from role r,user_role ur where ur.role_id = r.role_id and ur.user_id = #{userId}"
    })
    public String getRoleNameByUserId(Integer userId);
}

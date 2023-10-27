package com.example.community.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 系统用户
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
@Data
@TableName("user")
    public class User implements Serializable {

    private static final long serialVersionUID=1L;

      /**
     * 主键ID
     */
      @TableId(value = "user_id", type = IdType.AUTO)
      private Integer userId;

      /**
     * 用户名
     */
      private String username;

      /**
     * 密码
     */
      private String password;

      /**
     * 真实姓名
     */
      private String realName;

      /**
     * 联系人
     */
      private String contact;

      /**
     * 手机号
     */
      private String mobile;

      /**
     * 状态  0正常   1禁用
     */
      private Integer status;


}

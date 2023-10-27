package com.example.community.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 
 * </p>
 *
 * @author admin
 * @since 2023-10-22
 */
@Data
  @EqualsAndHashCode(callSuper = false)
    public class Role implements Serializable {

    private static final long serialVersionUID=1L;

      @TableId(value = "role_id", type = IdType.AUTO)
      private Integer roleId;

      /**
     * 角色名称
     */
      private String roleName;

    private Integer type;

      /**
     * 备注
     */
      private String remark;

      /**
     * 创建时间
     */
        @TableField(fill = FieldFill.INSERT)
      private LocalDateTime createTime;


}

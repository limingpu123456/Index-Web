package com.example.community.vo;

import lombok.Data;

import java.util.List;

/**
 * Description：
 * User: lmp
 * Date: 2023-10-22
 * Time: 22:56(李明浦)
 */
@Data
public class MenuRouterVO {
    private String name;
    private String path;
    private String hidden;
    private String component = "Layout";
    private String redirect = "noRedirect";
    private Boolean alwaysShow = true;
    private MetaVO meta;
    private List<ChildMenuRouterVO> children;
}

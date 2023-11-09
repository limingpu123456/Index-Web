package com.example.community.form;

import lombok.Data;

/**
 * Description：
 * User: lmp
 * Date: 2023-10-22
 * Time: 19:49(李明浦)
 */
//因为从前端传回来一个表单，但是没有类对象可以接收，所以创建一个表单对象
@Data
public class LoginForm {
    private String username;
    private String password;
    private String captcha;
    private String uuid;
}

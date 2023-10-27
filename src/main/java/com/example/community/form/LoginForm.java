package com.example.community.form;

import lombok.Data;

/**
 * Description：
 * User: lmp
 * Date: 2023-10-22
 * Time: 19:49(李明浦)
 */
@Data
public class LoginForm {
    private String username;
    private String password;
    private String captcha;
    private String uuid;
}

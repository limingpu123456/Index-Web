package com.example.community.controller;

import cn.hutool.core.util.IdUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.community.entity.User;
import com.example.community.form.LoginForm;
import com.example.community.mapper.UserMapper;
import com.example.community.service.UserService;
import com.example.community.util.JwtUtil;
import com.example.community.util.Result;
import com.wf.captcha.SpecCaptcha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Description：
 * User: lmp
 * Date: 2023-10-22
 * Time: 19:25(李明浦)
 */
@RestController
public class LoginController {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/captcha")
    public Result captcha(){
        SpecCaptcha specCaptcha = new SpecCaptcha(130, 48, 4);
        String code = specCaptcha.text().toLowerCase();
        String uuid = IdUtil.simpleUUID();
        //Redis存验证码，设置有效时间2分钟
        redisTemplate.opsForValue().set(uuid, code, 120, TimeUnit.SECONDS);
        Map<String, String> map = new HashMap<String, String>(3);
        map.put("uuid", uuid);
        map.put("code", code);
        map.put("captcha", specCaptcha.toBase64());
        return Result.ok().put("data", map);
    }

    @PostMapping("/login")
    //前端传递的是JSON格式的话，需要加@RequestBody注解转成Java对象
    public Result login(@RequestBody LoginForm loginForm, HttpSession session){
        //1.验证码校验
        String captcha = (String)this.redisTemplate.opsForValue().get(loginForm.getUuid());
        //1.1判断验证码是否有效
        if(captcha == null){
            return Result.ok().put("status","fail").put("data","验证码已过期");
        }
        //1.2判断验证码是否正确
        if(!captcha.equals(loginForm.getCaptcha())){
            return Result.ok().put("status","fail").put("data","验证码错误");
        }
        //2.判断用户名是否正确
        QueryWrapper<User> queryWrapper = new QueryWrapper<User>();
        queryWrapper.eq("username",loginForm.getUsername());
        //这样写不行，getone不好用，直接掉mapper就行了
        //User user = this.userService.getOne(queryWrapper);
        User user = userMapper.selectOne(queryWrapper);
        if(user == null){
            return Result.ok().put("status","fail").put("data","用户名不存在");
        }
        //3.判断密码是否正确
        //用hutool的工具类
        String password = SecureUtil.sha256(loginForm.getPassword());
        if(!password.equals(user.getPassword())){
            return Result.ok().put("status","fail").put("data","密码错误");
        }
        //用户是否可用
        if(user.getStatus() == 0){
            return Result.ok().put("status","fail").put("data","当前账号已被锁定，请联系管理员");
        }
        //登录成功
        //前端存到cookie中，后端存到session中
        session.setAttribute("user",user);
        //创建token
        //使用token来控制前后端传递数据的安全，有了令牌就可以判断是不是本人了
        String token = jwtUtil.createToken(String.valueOf(user.getUserId()));
        redisTemplate.opsForValue().set("community:user:"+user.getUserId(),token,jwtUtil.getExpire());
        Map<String,Object> map = new HashMap(2);
        map.put("token",token);
        map.put("expire",jwtUtil.getExpire());
        return Result.ok().put("status","success").put("data",map);
    }

    @GetMapping("/checkToken")
    public Result checkToken(HttpServletRequest request){
        String token = request.getHeader("token");
        boolean result = this.jwtUtil.checkToken(token);
        if(result) return Result.ok().put("status","ok");
        return Result.ok().put("status","error");
    }

    @PostMapping("logout")
    public Result logout(HttpSession session){
//        session.removeAttribute("user");
        //这个也是销毁session
        session.invalidate();
        return Result.ok();
    }
}

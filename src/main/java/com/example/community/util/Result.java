package com.example.community.util;

import java.util.HashMap;

/**
 * Description：
 * User: lmp
 * Date: 2023-10-22
 * Time: 19:25(李明浦)
 */
public class Result extends HashMap<String, Object> {

    public static Result ok(){
        Result result = new Result();
        result.put("code", 200);
        result.put("msg", "操作成功");
        return result;
    }

    public static Result error(String msg){
        Result result = new Result();
        result.put("code", 500);
        result.put("msg", msg);
        return result;
    }

    @Override
    public Result put(String key, Object value) {
        super.put(key, value);
        return this;
    }
}

// import { activeEffect } from "./effect";
import { track ,trigger} from "./effect";
export const enum ReactiveFlags{
    IS_REACTIVE = '_v_isReactive'
}
export const mutableHandler = 
    {
        get(target, key ,receiver){
            // debugger
            // activeEffect;
            if(key === ReactiveFlags.IS_REACTIVE){
                return true;
            }
            console.log(target);
            track(target,'get',key);
            // 这里可以监控到用户取值了
            console.log(receiver);
            
            return Reflect.get(target, key ,receiver);
        },
        set(target, key,value ,receiver){
            let oldvalue = target[key];
            let rusult =Reflect.set(target, key ,value,receiver);
            if(oldvalue !== value){
                trigger(target,'set',key,value,oldvalue)

            }
            // 这里可以监控到用户设置值了
            return rusult;
        }
    }
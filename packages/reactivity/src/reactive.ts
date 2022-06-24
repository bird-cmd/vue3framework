import { isObject } from "@vue/shared";
import {mutableHandler,ReactiveFlags} from './baseHandler'
// 将数据转化为响应式的数据，只能做数据的代理
//避免重复代理
const reactiveMap= new WeakMap(); // key只能是对象

export function reactive(target){
    if(!isObject(target)){
        return
    }
    let existingProxy = reactiveMap.get(target);
    if(existingProxy){
        return existingProxy;
    }
    //  第一次普通对象代理 会通过new proxy 代理一次
    // 下一次传递的是proxy是，我们可以看下它又没有代理过，如果访问这个proxy
    // 有get方法，说明代理过了
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target;
    }
    const proxy =  new Proxy(target,mutableHandler)
    reactiveMap.set(target,proxy)
    return proxy;

}
// let target = {
//     _name:'zf',
//     get name(){
//         return this._name //使用reflect this会变为代理，可以监听_name. 否则this 为target
//     }
// }
// const proxy =  new Proxy(target,{
//     get(target, key ,receiver){
//         // return target[key] ;//这样不会监听到_name
//         return Reflect.get(target, key ,receiver); //receiver改变了 this的指向
//     },
//     set(target, key,value ,receiver){
//         // target[key] = value;
//         // return true;
//         return Reflect.set(target, key ,receiver)
//     }
// })
// console.log(proxy.name);



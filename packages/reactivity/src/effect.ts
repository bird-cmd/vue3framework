export let activeEffect =undefined;
function cleanupEffect(effect){
    const {deps} = effect;
    for(let i =0;i<deps.length; i++){
        deps[i].delete(effect);
    }
    effect.deps.length =0;
}
class ReactiveEffect{
    public deps = [];
    public parent = null;
    public active =true;
    constructor(public fn){};
    run(){
        if(!this.active){
            this.fn()
        }
        try{
            this.parent = activeEffect;
            activeEffect = this;
            cleanupEffect(this);
            return this.fn();
        }finally{
            activeEffect = this.parent;
        }
    }
    stop(){
        if(this.active){
            this.active = false;
            cleanupEffect(this);
        }

    }
}

export function effect(fn){
//这里fn可以根据状态变化执行，也可以嵌套执行
  const _effect=  new ReactiveEffect(fn);
  _effect.run();
  const runner =_effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
// 依赖收集
const targetMap = new WeakMap();
export function track(target ,type,key){
if(!activeEffect) return;
let depsMap =targetMap.get(target);
if(!depsMap){
    targetMap.set(target,depsMap=new Map())
};
let dep =depsMap.get(key);
if(!dep){
    depsMap.set(key,dep = new Set());
}
let shouldTrack = dep.has(activeEffect);
if(!shouldTrack){
    dep.add(activeEffect);
    activeEffect.deps.push(dep); //做清理的时候会用到
    //多对多
}
}
export function trigger(target,type,key,value,oldvalue){
    const depsMap =targetMap.get(target);
    if(!depsMap) return;
    let effects = depsMap.get(key);
    if(effects){
        effects = new Set(effects);
        effects.forEach(effect => {
            if(effect !== activeEffect){
                effect.run();
            }
        });
    }
   
}
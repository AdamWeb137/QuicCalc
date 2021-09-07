function new_struct(name,...keys){
    let factory = (...params)=>{
        let obj = {type:name};
        if(params.length != keys.length) throw Error(`Expected ${keys.length} parameters, got ${params.length}`);
        for(let i = 0; i < params.length; i++){
            let key = keys[i];
            if(typeof keys[i] == "object"){
                key = keys[i][0];
                if(!((typeof params[i]) == keys[i][1]) && (!(keys[i][1] == "any"))) throw Error(`Parameter, '${keys[i][0]}', expected type ${keys[i][1]}, got type ${typeof params[i]}`);
            }
            obj[key] = params[i];
        }
        return obj;
    };
    return factory;
}
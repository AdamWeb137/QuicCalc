class MathEval {
    static OPINFO = new_struct("OPINFO",["operator","string"],["left","string"],["right","string"]);
    static operators = {
        "+":(a,b) => a+b,
        "-":(a,b) => a-b,
        "/":(a,b) => a/b,
        "*":(a,b) => a*b,
        "^":(a,b) => a**b,
        "%":(a,b) => a%b
    };

    static PEMDAS = [
        ["^"],
        ["*","/","%"],
        ["+","-"]
    ];

    static scope_funcs = {
        "(": a => a,
        "sin": a => Math.sin(a),
        "cos": a => Math.cos(a),
        "tan": a => Math.tan(a),
        "asin": a => Math.asin(a),
        "acos": a => Math.acos(a),
        "atan": a => Math.atan(a),
        "atan2": a => Math.atan2(a),
        "sqrt": a => Math.sqrt(a),
        "pow2": a => a**2,
        "ln": a => Math.log(a),
        "log":a => Math.log10(a)
    };

    static handle_error(msg){
        return msg;
    }
    
    static scope(scope_arr,scope_func="("){
        for(let i = 0; i < MathEval.PEMDAS.length; i++){
            let j = 1;
            while(j < scope_arr.length-1){
                let item = scope_arr[j];
                if(typeof item != "string" || !MathEval.PEMDAS[i].includes(item)) {
                    j++;
                    continue;
                }
                if(!(typeof scope_arr[j+1] == "number") || !(typeof scope_arr[j-1] == "number")) return MathEval.handle_error("Syntax Error");
                let op_res = MathEval.operators[item](scope_arr[j-1],scope_arr[j+1]);
                if(isNaN(op_res)) return MathEval.handle_error("NaN Error");
                scope_arr.splice(j-1,3,op_res);
                j--;
            }
        }
        if(scope_arr.length == 0) return null;
        if(typeof scope_arr[0] == "string") return NaN;
        return MathEval.scope_funcs[scope_func](scope_arr[0]);
    }

    static get_scopes(arr){
        const SCOPEMARK = new_struct("MARK", ["index","number"]);
        let depth = 0;
        let total_depth = 0;
        let scopes = [{parent:-1,arr:[]}];
        let funcs = ["("];
        for(let i = 0; i< arr.length; i++){
            if(arr[i] == ")"){
                depth = scopes[depth].parent;
            }
            else if(arr[i] in MathEval.scope_funcs){
                scopes.push({parent:depth,arr:[]});
                scopes[depth].arr.push(SCOPEMARK(++total_depth));
                depth = total_depth;
                funcs.push(arr[i]);
            }
            else if(arr[i] in MathEval.operators){
                scopes[depth].arr.push(arr[i]);
            }
            else{
                let n = arr[i];
                if(typeof n != "number") n = Number(n);
                scopes[depth].arr.push(n);
            }
        }
        return {scopes:scopes.map((obj)=>{
            return obj.arr;
        }),funcs:funcs};
    }

    static evaluate(arr){
        let info = MathEval.get_scopes(arr);
        let scopes = info.scopes;
        let funcs = info.funcs;
        for(let i = scopes.length-1; i > -1; i--){
            for(let j = 0; j < scopes[i].length; j++){
                let curr_scope = scopes[i];
                if(curr_scope[j].type && curr_scope[j].type == "MARK") curr_scope[j] = scopes[curr_scope[j].index];
            }
            scopes[i] = MathEval.scope(scopes[i],funcs[i]);
            if(typeof scopes[i] == "string") return scopes[i];
        }
        if(scopes.length == 0) return null;
        if(typeof scopes[0] == "string") return NaN;
        return scopes[0];
    }
}
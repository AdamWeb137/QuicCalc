window.addEventListener("load",function(){
    const output_div = document.querySelector(".output");
    const buttons_div = document.querySelector(".buttons");
    const layouts_btns_div = document.querySelector(".layouts");

    const on_layout_input = (input_index)=>{
        let layout_bind = layouts[current_layout][input_index];
        add_input_text(layout_bind.output,input_pointer);
        input_array.splice(input_pointer+1,0,layout_bind.value);
        input_pointer++;
        scroll_down();
    };


    for(let h = 0; h < layouts_btns_div.children.length; h++){
        let a = h;
        layouts_btns_div.children[h].addEventListener("click",()=>{
            set_layout(a);
        });
    }

    for(let i = 0; i < buttons_div.children.length-1; i++){
        let a = i;
        buttons_div.children[i].addEventListener("click",()=>{
            on_layout_input(a);
        });
    }

    let current_layout = 0;
    const BTNINFO = new_struct("BTNINFO",["name","string"],["output","string"],["value","any"]);
    const layouts = [
        [
            BTNINFO("7","7",7),
            BTNINFO("8","8",8),
            BTNINFO("9","8",9),
            BTNINFO("4","4",4),
            BTNINFO("5","5",5),
            BTNINFO("6","6",6),
            BTNINFO("1","1",1),
            BTNINFO("2","2",2),
            BTNINFO("3","3",3),
            BTNINFO("0","0",0)
        ],
        [
            BTNINFO("(","(","("),
            BTNINFO(")",")",")"),
            BTNINFO("+","+","+"),
            BTNINFO("-","-","-"),
            BTNINFO("*","*","*"),
            BTNINFO("/","/","/"),
            BTNINFO("%","%","%"),
            BTNINFO("^","^","^"),
            BTNINFO("√","√(","sqrt"),
            BTNINFO(".",".",".")
        ],
        [
            BTNINFO("sin","sin(","sin"),
            BTNINFO("cos","cos(","cos"),
            BTNINFO("tan","tan(","tan"),
            BTNINFO("asin","asin(","asin"),
            BTNINFO("acos","acos(","acos"),
            BTNINFO("atan","atan(","atan"),
            BTNINFO("ln","ln(","ln"),
            BTNINFO("log","log(","log"),
            BTNINFO("e","e",Math.E),
            BTNINFO("π","π",Math.PI)
        ],
    ];

    const key_layout_bindings = {
        "z":0,
        "x":1,
        "c":2
    };

    const set_layout = (i)=>{
        layouts_btns_div.querySelector(".btn-selected").classList.remove("btn-selected");
        layouts_btns_div.children[i].classList.add("btn-selected");
        current_layout = i;
        let buttons = buttons_div.querySelectorAll("div");
        for(let i = 0; i < buttons.length-1; i++){
            buttons[i].querySelector("p").innerHTML = layouts[current_layout][i].name;
        }
    };
    set_layout(0);

    const key_bindings = {
        "0":9,
        "3":8,
        "2":7,
        "1":6,
        "6":5,
        "5":4,
        "4":3,
        "9":2,
        "8":1,
        "7":0,
        "Home":0,
        "ArrowUp":1,
        "PageUp":2,
        "ArrowLeft":3,
        "Unidentified":4, //lol rip 5 key
        "ArrowRight":5,
        "End":6,
        "ArrowDown":7,
        "PageDown":8,
        "Insert":9,
        "u":0,
        "i":1,
        "o":2,
        "j":3,
        "k":4,
        "l":5,
        "m":6,
        ",":7,
        ".":8,
        "/":9
    };

    let current_input_div = null;
    let input_array = [];
    let input_pointer = 0;
    const create_new_input = ()=>{
        output_div.querySelectorAll(".selected").forEach(element => {element.classList.remove("selected");});
        input_array = [];
        input_pointer = 0;
        let input_div = document.createElement("div");
        input_div.classList.add("input");
        output_div.appendChild(input_div);
        current_input_div = input_div;
    };
    create_new_input();

    const scroll_down = ()=>{
        output_div.scrollTop = output_div.scrollHeight;
    };

    const add_input_text = (text,index)=>{
        let p = document.createElement("p");
        p.innerText = text;
        current_input_div.querySelectorAll(".selected").forEach(element => {
            element.classList.remove("selected");
        });
        p.classList.add("selected");
        input_pointer = index;
        if(index >= current_input_div.children.length){
            current_input_div.appendChild(p);
            input_pointer -= 1;
            return;
        }
        current_input_div.children[index].after(p);
    };

    const move_selected = (n)=>{
        if(input_pointer+n < 0 || input_pointer+n > input_array.length-1) return;
        current_input_div.querySelectorAll(".selected").forEach(element => {element.classList.remove("selected");});
        input_pointer = input_pointer + n;
        current_input_div.children[input_pointer].classList.add("selected");
    };

    const delete_selected = ()=>{
        current_input_div.children[input_pointer].remove();
        input_array.splice(input_pointer,1);
        if(current_input_div.children.length == 0) return;
        input_pointer = (input_pointer == 0) ? 0 : input_pointer-1;
        current_input_div.children[input_pointer].classList.add("selected");
    };

    const combine_nums = ()=>{
        let result = [];
        let num = "";
        let last_was_op = true;

        const push_num = ()=>{
            if(num.length > 0){
                if(num == ".") num = 0;
                if(num == "-") num = -1;
                num = Number(num);
                result.push(num);
                last_was_op = false;
                num = "";
            }
        };

        for(let i = 0; i < input_array.length; i++){
            if(typeof input_array[i] == "number"){
                num += String(input_array[i]);
                last_was_op = false;
                continue;
            }
            if(input_array[i] == "."){
                num += ".";
                last_was_op = false;
                continue;
            }

            if(input_array[i] == "-" && last_was_op){
                num += "-";
                last_was_op = true;
                continue;
            }

            push_num();

            if(input_array[i] in MathEval.scope_funcs && !last_was_op) result.push("*");

            result.push(input_array[i]);
            last_was_op = true;
        }
        push_num();
        return result;
    };
    
    const create_new_output = (text)=>{
        let result_div = document.createElement("div");
        result_div.classList.add("input");
        output_div.appendChild(result_div);
        let p = document.createElement("p");
        p.innerText = text;
        p.style.textAlign = "right";
        p.style.width = "100%";
        result_div.appendChild(p);
    };

    const enter_event = ()=>{
        if(input_array.length == 0) return;
        let combined = combine_nums();
        console.log(combined);
        let calculated = MathEval.evaluate(combined);
        create_new_output(String(calculated));
        create_new_input();
        scroll_down();
    };
    buttons_div.children[buttons_div.children.length-1].addEventListener("click",enter_event);


    window.addEventListener("keydown",(e)=>{
        if(e.key in key_bindings){
            e.preventDefault();
            on_layout_input(key_bindings[e.key]);
        }

        if(e.key in key_layout_bindings){
            e.preventDefault();
            set_layout(key_layout_bindings[e.key]);
        }

        if(e.key == "a") move_selected(-1);
        if(e.key == "d") move_selected(1);
        if(e.key == "Delete" || e.key == "Backspace") delete_selected();
        if(e.key == "Enter") enter_event();

    });

});

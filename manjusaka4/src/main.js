// manjusaka4.js
// -------------
// The all-in-one js file for generating and running manjusaka messages on
// a HTML file "manjusaka.html".
const compiler = require("./compile");
const runtime  = require("./runtime");

var runtime_continue = function(){};
var answer_debouncing = {};
var app;


async function send_answers(){
    try{
        const now = new Date().getTime();
        const deleted = [];
        for(let question_id in answer_debouncing){
            let answer_deferred = answer_debouncing[question_id];
            if(answer_deferred.after < now){
                app.busy = true;
                await runtime_continue(question_id, answer_deferred.answer);
                deleted.push(question_id);
                app.busy = false;
            }
        }
        deleted.forEach((question_id)=>{
            delete answer_debouncing[question_id];
        });
    } finally {
        setTimeout(send_answers, 200);
    }
}
send_answers();



app = new Vue({
    el: "#app",
    data: {
        busy: false,
        page: init_set_page(),

        compiler_input: "",
        compiler_output: "",

        runtime_input: PRESET_COMPILED,
        runtime_questions: {},
        runtime_messages: [],
    },

    methods: {
        compile: async function(){
            const compiled = await compiler(this.compiler_input);
            const thishtml = await download_this_html();

            const injected = "const PRESET_COMPILED=`\n" + compiled + "\n`;";

            this.compiler_output = inject_preset(thishtml, injected);
        },

        runtime_update_answer: function(question_id, answer){
            answer_debouncing[question_id] = {
                answer: answer,
                after: new Date().getTime() + 200,
            }
            this.runtime_questions[question_id].changed=false;
        }
    },

});




function init_set_page(){
    return (PRESET_COMPILED && PRESET_COMPILED.trim() != "") ?
        "runtime" : "compiler"
}


async function download_this_html(){
    return (await fetch(window.location.pathname)).text();
}

function inject_preset(source, data){
    const startstr = '<script id="preset">';
    const endstr = '</script>';
    const start = source.indexOf(startstr) + startstr.length;
    const end = source.indexOf(endstr, start);

    return source.slice(0, start) + data + source.slice(end);
}



async function runtime_callback(questions, messages){
    console.log("runtime callback", questions, messages);
    for(let k in questions){
        if(undefined === questions[k].answer) questions[k].answer = "";
    }
    app.runtime_questions = questions;
    app.runtime_messages = messages;
}


async function start_runtime(data){
    runtime_continue = await runtime(data, runtime_callback);    
}

if(PRESET_COMPILED && PRESET_COMPILED.trim() != ""){
    // start runtime automatically if preconfigured data
    start_runtime(PRESET_COMPILED);
}



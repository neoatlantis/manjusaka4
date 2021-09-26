(async function(){
//////////////////////////////////////////////////////////////////////////////

const argv = process.argv.slice(2);

if(argv[0] == "compile"){
    const compiler = require("./compile");

    const yamlstr = require("fs").readFileSync(argv[1]);
    console.log(await compiler(yamlstr));


    return;
}




if(argv[0] == "test"){
    const compiler = require("./compile");
    const runtime = require("./runtime");
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const yamlstr = require("fs").readFileSync(argv[1]);
    const setanswer = runtime(await compiler(yamlstr), callback);

    let questions_menu = [];

    function prompt(question){
        return new Promise(function(resolve, reject){
            rl.question(question, (answer)=>{ 
                resolve(answer.trim());
            });
        });
    }

    async function callback(questions, messages){
        console.clear();
        questions_menu = [];
        for(let question_id in questions){
            questions_menu.push({
                prompt: questions[question_id].hint,
                id: question_id,
                answered: questions[question_id].answer !== undefined,
            });
        }

        questions_menu.forEach((q, i)=>{
            console.log(i+1, (q.answered?"OK":"  "), q.prompt);
        });

        console.log("Currently ", messages.length, " message(s) available.");

        let answer_id = await prompt("Choose a question by id, or type 'm' + message id for a message: ");

        if(answer_id.slice(0, 1) == "m"){
            answer_id = answer_id.slice(1);
            try{
                console.log(messages[answer_id-1]);
            } catch(e){
                console.log("Invalid message id. Begin with 1.");
            }
            await prompt("Press any key to continue.");
            callback(questions, messages);
            return;
        }
        const answer = await prompt("Your answer? ");

        setanswer(
            questions_menu[answer_id-1].id, 
            answer
        );
    }



}


//////////////////////////////////////////////////////////////////////////////
})();

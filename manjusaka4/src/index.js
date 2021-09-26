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

    const yamlstr = require("fs").readFileSync(argv[1]);

    const setanswer = runtime(await compiler(yamlstr), console.log);



}


//////////////////////////////////////////////////////////////////////////////
})();

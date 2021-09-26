const argv = process.argv.slice(2);

if(argv[0] == "compile"){
    const compiler = require("./compile");

    const yamlstr = require("fs").readFileSync(argv[1]);
    console.log(compiler(yamlstr));
}

const openpgp = require("openpgp");
const yaml = require("js-yaml");
const crypto = require("crypto");
const _ = require("lodash");

class QuestionCompiler {
    
    constructor(human_id, q, a){
        this.human_id = human_id;
        this.id = this.generate_id();
        this.q = q;
        this.a = a;

        this.AK = this.generate_ak();
    }

    generate_id(){
        const buffer = new Uint8Array(32);
        crypto.randomFillSync(buffer);
        return Array
            .from(buffer)
            .map((i)=>"abcdefghijklmnopqrstuvwxyz012345"[i % 32])
            .join("")
        ;
    }

    generate_ak(){
        const buffer = new Uint8Array(50); // 300 bit entropy
        crypto.randomFillSync(buffer);
        return Array
            .from(buffer)
            .map((i)=>String.fromCharCode((i % 64) + 32))
            .join("")
        ;
    }

    derive_value(answer_str){
        if(!_.isString(answer_str)){
            throw Error("Answer to a question must be a string.");
        }
        return this.AK + "::" + answer_str;
    }

    value(){
        if(_.isString(this.a)){
            return this.derive_value(this.a);
        }
        const ret = {};
        for(let k in this.a){
            ret[k] = this.derive_value(this.a[k]);
        }
        return ret;
    }

    async compile(){
        // returns compiled version for this question:
        // { question: id, hint: ciphertext }
        if(!_.isString(this.q)){
            throw Error("Question hint must be a string.");
        }
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: this.q }),
            passwords: [ this.AK ],
        });

        return {
            "question": this.id,
            "hint": encrypted,
        }
    }

}


module.exports = async function(yamlstr){
    
    const yamldoc = yaml.load(yamlstr);
    const questions = yamldoc.questions;

    const questions_compiled = {}
    for(let question_human_id in questions){
        questions_compiled[question_human_id] = new QuestionCompiler(
            question_human_id,
            questions[question_human_id].q,
            questions[question_human_id].a
        );

        console.log(await questions_compiled[question_human_id].compile())
    }


    return yamldoc;


    
}

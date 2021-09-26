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
        };
        const plaintext = JSON.stringify({
            hint: this.q,
        });

        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: plaintext }),
            passwords: [ this.AK ],
        });

        return {
            "question": this.id,
            "ciphertext": encrypted,
        }
    }

}




class PacketCompiler {

    constructor(questions_compiled, depends, enables, message){
        if(!enables) enables = [];
        if(!depends) depends = [];
        
        // Resolve dependencies. Fetch from every dependent question the
        // question id and the decryption key value.
        const keyparts = [];
        const depend_question_ids = [];
        depends.forEach((spec)=>{
            let { id, value } = this.resolve_dependency(
                questions_compiled, spec);
            depend_question_ids.push(id);
            keyparts.push(value);
        });

        keyparts.sort();
        this.secret = keyparts.join("::");

        this.payload_depends = depend_question_ids;
        this.payload_message = message;
        this.payload_enables = _.zipObject(
            enables.map((e)=>questions_compiled[e].id),
            enables.map((e)=>questions_compiled[e].AK)
        );
    }

    resolve_dependency(questions_compiled, spec){
        // look up the decrypting key for that question
        let ret = null, question_id = null;
        if(spec.indexOf("=") >= 0){
            let question_human_id = spec.split("=")[0];
            let question_value_id = spec.split("=")[1];
            ret = questions_compiled[question_human_id].value()[
                question_value_id];
            question_id = questions_compiled[question_human_id].id;
        } else {
            ret = questions_compiled[spec].value();
            question_id = questions_compiled[spec].id;
        }
        if(!_.isString(ret) || !_.isString(question_id)){
            throw Error("Dependency not resolved for: " + spec);
        }
        return { id: question_id, value: ret };
    }

    async compile(){
        const plaintext = JSON.stringify({
            enables: this.payload_enables,
            message: this.payload_message,
        });
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: plaintext }),
            passwords: [ this.secret ],
        });
        return {
            depends: this.payload_depends,
            ciphertext: encrypted,
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
    }

    
    const packets_compiled = yamldoc.packets.map((packet)=>
        new PacketCompiler(
            questions_compiled,
            packet.depends,
            packet.enables,
            packet.message
    ));

    const ret = {
        questions: {},
        packets: [],
    }

    for(let k in questions_compiled){
        const { question, ciphertext } = await questions_compiled[k].compile();
        ret.questions[question] = ciphertext;
    }

    for(let packet_compiler of packets_compiled){
        ret.packets.push(await packet_compiler.compile());
    }

    return JSON.stringify(ret);


    
}

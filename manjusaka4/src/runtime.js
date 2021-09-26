const openpgp = require("openpgp");
const _ = require("lodash");


async function decrypt_packet(ciphertext, dependency, question_answers){
    const keyparts = dependency.map((question_id)=>(
        question_answers[question_id].AK + "::" + 
        question_answers[question_id].answer
    ));
    keyparts.sort();
    const key = keyparts.join("::");

    try{
        const encrypted_message = await openpgp.readMessage({
            armoredMessage: ciphertext
        });
        const { data: decrypted } = await openpgp.decrypt({
            message: encrypted_message,
            passwords: [key],
        });

        return JSON.parse(decrypted);
    } catch(e){
        console.error(e);
        return null;
    }
}

async function decrypt_question(ciphertext, authentication_key){
    try{
        const encrypted_message = await openpgp.readMessage({
            armoredMessage: ciphertext
        });
        const { data: decrypted } = await openpgp.decrypt({
            message: encrypted_message,
            passwords: [authentication_key],
        });

        const decrypted_question = JSON.parse(decrypted);
        decrypted_question.AK = authentication_key;

        return decrypted_question;
    } catch(e){
        console.error(e);
        return null;
    }
}



function runtime(/*DATA*/){
    const data = JSON.parse(arguments[0]);
    const callback = arguments[1]; // we callback (questions, messages);

    const questions_encrypted = data.questions;
    const packets = data.packets;

    // runtime storage
    const messages = [];
    const questions_enabled = { /* question_id: { hint, AK, answer } */ };

    async function loop(){
        const new_packets = []; // collect new packets decrypted

        // First, examine if based on current answers to enabled questions, any
        // packets can be decrypted. If decryption successes, buffer them.

        for(let i=0; i<packets.length; i++){
            let packet = packets[i];

            let dependencies = packet.depends;
            let dependency_satisfied = true;
            for(let dependency of dependencies){
                if(!(
                    _.has(questions_enabled, dependency) &&
                    questions_enabled[dependency].answer !== undefined
                )){
                    dependency_satisfied = false;
                    break;
                }
            }

            if(dependency_satisfied){
                // try to decrypt
                const data = await decrypt_packet(
                    packet.ciphertext,
                    dependencies,
                    questions_enabled
                );
                if(data !== null){
                    new_packets.push(data);
                    _.pull(packets, packet);
                }
            }
        }

        // Second, iterate over all collected new packets, add the messages,
        // and parse the new authentication keys if any.

        for(let { enables, message } of new_packets){
            if(message !== undefined){ messages.push(message); }
            if(enables === undefined) enables = {};
            for(let enabled_qid in enables){
                console.log("enabling", enabled_qid);
                if(!_.isString(questions_encrypted[enabled_qid])) continue;
                let ak = enables[enabled_qid];
                let decrypted_question = await decrypt_question(
                    questions_encrypted[enabled_qid],
                    ak
                );
                if(decrypted_question !== null){
                    questions_enabled[enabled_qid] = decrypted_question;
                }
            }
        }
        
        callback(JSON.parse(JSON.stringify(questions_enabled)), messages);
    }

    loop();

    return function set_answer(question_id, answer){
        if(!_.has(questions_enabled, question_id)){
            throw Error("Invalid question id.");
        }
        questions_enabled[question_id].answer = answer;
        loop();
    }
}

module.exports = runtime;

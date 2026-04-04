const { hash } = require("node:crypto")




function checkHashLength(text, hashArray, patternArray) {
    textLength = text.length

    //  If 32 characters, remove all but MD5, NTLM (MD4), argon2
	// - If 64 characters, it may be SHA-256
	// - If 96 characters, it may be SHA-384
	// - If 128 characters, it may be SHA-512

    if (textLength == 32) {
        patternArray.push("32 Characters long")
        hashArray.push(["MD5", "NTLM"])
        // return "MD5 or NTLM"
    } else if (textLength == 64){
        patternArray.push("64 Characters long")
        hashArray.push("SHA-256")
        return "SHA-256"
    } else if (textLength == 96){
        patternArray.push("96 Characters long")
        hashArray.push("SHA-384")
        return "SHA-384"
    } else if (textLength == 128){
        patternArray.push("128 Characters long")
        hashArray.push("SHA-512")
        return "SHA-512"
    } else {
        patternArray.push("Variable character length")
        return "Other"
    }
}

function checkHashCharacters(text, hashArray, patternArray) {
    const textArr = text.split('')

    for (let index = 0; index < textArr.length; index++) {
        const element = textArr[index];

        if (["%", "/", ".", "$", "!", ","].includes(element)) {
            patternArray.push("Contains '% / . $ ! ,' ")
            hashArray.push("bcrypt", "argon2")
            return "bcrypt or argon2"
        }
    }

    patternArray.push("Contains alphanumeric characters only")
    return "other"
}

function checkHashPrefix(text, hashArray, patternArray) {
    console.log(text.substring(0, 7))

    if (text.substring(0, 7)  == "$argon2") {
        var index = hashArray.indexOf("bcrypt");

        if (index !== -1) {
            hashArray.splice(index, 1);
        }

        patternArray.push("contains prefix 'argon2' ")
        // hashArray.push("argon2")
    } else {
        patternArray.push("no unique prefixes found")
    }
}

async function main() {
    // const result = await prompts({
    //     type: 'text',
    //     name: 'value',
    //     message: 'Enter Hash: '

    // })

    // const prompts = require('prompts');
    var hashPatterns = []
    var possibleHashes = []

    const hashType = document.getElementById("hashType");
    const description = document.getElementById("hashDescription");

    const input = document.getElementById("hashInput").value.trim();

    console.log("Hash: " + input)
    checkHashLength(input, possibleHashes, hashPatterns)
    checkHashCharacters(input, possibleHashes, hashPatterns)
    checkHashPrefix(input, possibleHashes, hashPatterns)

    console.log(possibleHashes)
    console.log(hashPatterns)
    
    hashType.textContent = `Possible Hashes: `
    hashType.textContent = `Possible Hashes: ${possibleHashes}`;

    description.textContent = ``
    description.textContent = hashPatterns;
}

main();



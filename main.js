class HashAlgorithm {
    constructor(name, identifiers) {
        this.name = name; // String
        this.identifiers = identifiers // Array
    } 
}

const SHA1 = new HashAlgorithm("SHA-1", ["Alphanumeric Characters Only", "40 Characters Long"]);
const SHA256 = new HashAlgorithm("SHA-256", ["Alphanumeric Characters Only", "64 Characters Long"]);
const SHA384 = new HashAlgorithm("SHA-384", ["Alphanumeric Characters Only", "96 Characters Long"]);
const SHA512 = new HashAlgorithm("SHA-512", ["Alphanumeric Characters Only", "128 Characters Long"]);
const SHA3 = new HashAlgorithm("SHA-3", ["Alphanumeric Characters Only", "56 Characters Long"]);
const MD5 = new HashAlgorithm("MD5", ["Alphanumeric Characters Only", "32 Characters Long"]);
const NTLM = new HashAlgorithm("NTLM", ["Alphanumeric Characters Only", "32 Characters Long"]);
const Argon2 = new HashAlgorithm("Argon2", ["Contains $", "Contains =", "Contains ,", "Variable character length", "Begins with $argon2"]);
const Bcrypt = new HashAlgorithm("bcrypt", ["Contains $", "60 Characters Long"]);

let HashList = [SHA1, SHA256, SHA384, SHA512, SHA3, MD5, NTLM, Argon2, Bcrypt]

// arr1.filter(x => arr2.includes(x));

// var hashPatterns = []
var Hashinput = " ";

const identifiers = [""]


function checkHashPresence(textHash) {
    return textHash.length == 0;
}

function exportError() {
    return alert("No Hash to Export")
}

function main() {
    let hashPatterns = []
    let possibleHashes = []


    function checkHashLength(text) {
        textLength = text.length

        const charLength = document.getElementById("charCount")
        charLength.textContent = `Characters: ${textLength}`

        hashPatterns.push(textLength + " Characters Long")
    }

    function checkHashCharacters(text) {
        // check bcrypt/argon characters first
        if (text.includes("$")) {
            hashPatterns.push("Contains $")
        }

        if (text.includes("=")) {
            hashPatterns.push("Contains =")
        }

        if (text.includes(",")) {
            hashPatterns.push("Contains ,")
        }

        // regex to check if alphanumeric
        if (/^[a-zA-Z0-9]+$/.test(text)) {
            hashPatterns.push("Alphanumeric Characters Only")
        }
    }

    function checkHashPrefix(text) {
        if (text.substring(0, 7)  == "$argon2") {
            hashPatterns.push("Begins with $argon2")
        }
    }

    function compareHashes(){
        for (let index = 0; index < HashList.length; index++) {
            var element = HashList[index];

            var match = hashPatterns.filter(x => element.identifiers.includes(x));

            if (match.length == hashPatterns.length) {
                possibleHashes.push(element.name)
            }
        }
    }
    
    const hashInputField = document.getElementById("hashInput");
    Hashinput = hashInputField.value.trim();

    // const hashType = document.getElementById("hashType");
    const description = document.getElementById("hashDescription");
    // const inputtedhash = document.getElementById("inputtedhash");

    if (checkHashPresence(Hashinput)) {
        return alert("No Hash Inputted");
    
    } else {
        Hashinput = Hashinput.toLocaleLowerCase();
        inputtedhash.innerText = "Inputted Hash: " + Hashinput;

        checkHashLength(Hashinput)
        checkHashCharacters(Hashinput)
        checkHashPrefix(Hashinput)
        compareHashes()
        
        hashType.textContent = `Possible Hashes: `
        hashType.textContent = `Possible Hashes: ${possibleHashes}`;

        description.textContent = ``
        description.textContent = hashPatterns;
    }
}

function exportPDF() {
    if (checkHashPresence(Hashinput)) {
        exportError();
        return;
    }
    
    const element = document.getElementById('hash-info');
    html2pdf(element);
}

function exportCSV() {
    if (checkHashPresence(Hashinput)) {
        exportError;
        return;
    }
    
    let csvRows = [];
    csvRows.push("Possible Hashes,Description");
    
    const hashesString = possibleHashes.join(", ");
    const patternsString = hashPatterns.join(", ");
    
    csvRows.push(`"${hashesString}","${patternsString}"`);
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `hash_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportJSON() {
    if (checkHashPresence(Hashinput)) {
        exportError;
        return;
    }
    
    const exportData = {
        hash: Hashinput,
        hashLength: Hashinput.length,
        possibleHashes: possibleHashes,
        hashPatterns: hashPatterns,
        exportDate: Date.now()
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `hash_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

var hashPatterns = []
var possibleHashes = []
var Hashinput = " ";

function checkHashLength(text, hashArray, patternArray) {
    textLength = text.length

    const charLength = document.getElementById("charCount")
    charLength.textContent = `Characters: ${textLength}`

    //  If 32 characters, remove all but MD5, NTLM (MD4), argon2
	// - If 64 characters, it may be SHA-256
	// - If 96 characters, it may be SHA-384
	// - If 128 characters, it may be SHA-512

    if (textLength == 32) {
        patternArray.push("32 Characters long")
        hashArray.push(["MD5", "NTLM"])
        return "MD5 or NTLM";
    } else if (textLength == 40) {
        patternArray.push("40 Characters long")
        hashArray.push("SHA-1")
    } else if (textLength == 56) {
        patternArray.push("56 Characters long")
        hashArray.push("SHA-3")
        return "SHA-2"
    }  else if (textLength == 64){
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
    // check bcrypt/argon characters first
    if (text.includes("$")) {
        if (text.includes("=") && text.includes("'")) {
            patternArray.push("Contains both '=' and '$' ")
            hashArray.push("argon2")
            return 0
        } else {
            patternArray.push("Contains only '$' ")
            console.log("bcrypt")
            return 0
        }
    }

    // regex to check if alphanumeric
    if (/^[a-zA-Z0-9]+$/.test(text)) {
        patternArray.push("Contains alphanumeric characters only")
        return 0
    } else {
        patternArray.push("Contains multiple types of characters")
    }

    return "other"
}

function checkHashPrefix(text, hashArray, patternArray) {
    console.log(text.substring(0, 7))

    if (text.substring(0, 7)  == "$argon2") {
        patternArray.push("contains prefix 'argon2' ")
        hashArray.push("argon2")
    } else {
        patternArray.push("no unique prefixes found")
    }
}

function checkHashPresence(textHash) {
    console.log(textHash.length);
    return textHash.length == 0;
}

function exportError() {
    return alert("No Hash to Export")
}

function main() {
    hashPatterns = []
    possibleHashes = []

    const hashType = document.getElementById("hashType");
    const description = document.getElementById("hashDescription");
    const hashInputField = document.getElementById("hashInput");
    const inputtedhash = document.getElementById("inputtedhash");

    Hashinput = hashInputField.value.trim();

    if (checkHashPresence(Hashinput)) {
        alert("No Hash Inputted")
        return;
    } else {
        Hashinput = Hashinput.toLocaleLowerCase();
        inputtedhash.innerText = "Inputted Hash: " + Hashinput;

        checkHashLength(Hashinput, possibleHashes, hashPatterns)
        checkHashCharacters(Hashinput, possibleHashes, hashPatterns)
        checkHashPrefix(Hashinput, possibleHashes, hashPatterns)
        
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

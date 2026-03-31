const { exec } = require("child_process");
const path = require("path");

const enginePath = path.join(__dirname, "../../core/target/release/veldb.exe");

function runQuery(query) {
    return new Promise((resolve, reject) => {
        exec(`"${enginePath}" "${query}"`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = { runQuery };
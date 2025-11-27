import { spawn } from "child_process";
import e from "express";
import path from "path";

async function runBertModel(docxFilePath: string) {
    const pyInterpreter = path.join(
        __dirname,
        "../../venv/Scripts/python.exe"
    );

    const pyScript = path.join(__dirname, "../../microservice/__init__.py");

//     const outputCsv = docxFilePath.replace(/\.docx$/i, ".csv");

    return new Promise<string>((resolve, reject) => {
        const py = spawn(
            `"${pyInterpreter}"`,
            [
                `"${pyScript}"`,
                `"${docxFilePath}"`,
                // `"${outputCsv}"`
            ],
            { shell: true, env: { ...process.env, PYTHONUTF8: "1" } }
        );

        py.stdout.on("data", (data) => {
            console.log("BERT:", data.toString());
        });

        py.stderr.on("data", (err) => {
            console.error("BERT error:", err.toString());
        });

        py.on("close", (code) => {
            if (code === 0) {
                // resolve(outputCsv);
            } else {
                reject(new Error("BERT process failed"));
            }
        });
    });
}

export { runBertModel };
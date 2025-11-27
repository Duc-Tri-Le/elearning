import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export interface CsvFileInfo {
    id: number;
    name: string;
    url: string;
}

/**
 * Lấy danh sách file CSV trong thư mục uploads/csv
 */
export function getCsvFilesList(baseUrl: string): CsvFileInfo[] {
    // const csvDir = path.join(__dirname, "../../data/uploads/csv");
    const csvDir = path.join(__dirname, "../../data/outputs");

    console.log("Đường dẫn thư mục CSV:", csvDir);

    if (!fs.existsSync(csvDir)) {
        console.warn(" Thư mục uploads/csv chưa tồn tại, tạo mới...");
        fs.mkdirSync(csvDir, { recursive: true });
    }

    const files = fs.readdirSync(csvDir).filter((f) => f.endsWith(".csv"));

    return files.map((file, index) => ({
        id: index + 1,
        name: file,
        // url: `${baseUrl}/data/uploads/csv/${file}`,
        url: `${baseUrl}/data/outputs/${file}`,
    }));
}

export function getById(filename: string): any[] {
    // const csvDir = path.join(__dirname, "../../data/uploads/csv");
    const csvDir = path.join(__dirname, "../../data/outputs");
    if (!fs.existsSync(csvDir)) { throw new Error("Thư mục CSV không tồn tại"); }
    
    const filePath = path.join(csvDir, filename);
    if (!fs.existsSync(filePath)) { throw new Error("File không tồn tại"); }

    const csvText = fs.readFileSync(filePath, "utf-8");
    const records = parse(csvText, { columns: true, skip_empty_lines: true, });
    return records;
}

// chưa dùng đến
export function saveCsvFile(filename: string, data: any[]) {
    const csvDir = path.join(process.cwd(), "../../data/uploads/csv");
    const filePath = path.join(csvDir, filename);

    if (!fs.existsSync(csvDir)) {
        fs.mkdirSync(csvDir, { recursive: true });
    }

    const csvContent = stringify(data, { header: true });

    fs.writeFileSync(filePath, csvContent, "utf-8");
}
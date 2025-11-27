import Papa from "papaparse";

/**
 * Kiểu dữ liệu của một dòng trong CSV
 */
interface CsvFile {
    id: number;
    name: string;
    url: string;
}

/**
 * Lấy CSV từ server và parse thành JSON
 * @param fileUrl URL CSV trên server
 * @param token (optional) Token xác thực
 * @returns Mảng object đại diện cho từng dòng CSV
 */
export async function fetchCsvContent(fileUrl: string, token?: string): Promise<CsvFile[]> {
    try {
        console.log(fileUrl);
        
        const res = await fetch(fileUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Không tải được file CSV từ server");

        const csvText = await res.json();

        return csvText.data
    } catch (error) {
        console.error("Lỗi fetchCsvContent:", error);
        throw error;
    }
}

/**
 * Upload CSV từ máy người dùng lên server (import dữ liệu)
 * @param uploadUrl Endpoint backend để import CSV
 * @param file File CSV được chọn từ input
 * @param token Token xác thực
 * @returns JSON response từ backend
 */
export async function uploadCsvFile(uploadUrl: string, file: File, token?: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Đang upload file:", file);

    try {
        const res = await fetch(uploadUrl, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        if (!res.ok) throw new Error("Upload CSV thất bại");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Lỗi uploadCsvFile:", error);
        throw error;
    }
}

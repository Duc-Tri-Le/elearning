export const fetchQuestions = async (API_URL: string, page: number, token: string) => {
    const res = await fetch(`${API_URL}/questions?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Không thể lấy danh sách câu hỏi");

    return await res.json(); 
};

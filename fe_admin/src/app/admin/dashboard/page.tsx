import styles from "./Dashboard.module.css";
import Card from "@/component/dashboard/card/Card";
import LineChartBox from "@/component/dashboard/line/LineChartBox";
import Table from "@/component/dashboard/table/Table";
import BarChartBox from "@/component/dashboard/bar/BarChartBox";
import PieChartBox from "@/component/dashboard/pie/PieChartBox";

// -------------------------------
// 🔹 1. DATA BAR
// -------------------------------
const dauData = {
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  datasets: [
    {
      label: 'DAU',
      data: [500, 520, 480, 550, 600, 580, 610],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const wauData = {
  labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
  datasets: [
    {
      label: 'WAU',
      data: [3200, 3400, 3550, 3600, 3700],
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    },
  ],
};

const mauData = {
  labels: ['Tháng 9', 'Tháng 10', 'Tháng 11'],
  datasets: [
    {
      label: 'MAU',
      data: [12000, 12500, 13000],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
};

// -------------------------------
// 🔹 2. DATA LINE
// -------------------------------
const lineData = [
  { date: "Oct 8", value: 42 },
  { date: "Oct 9", value: 58 },
  { date: "Oct 10", value: 61 },
  { date: "Oct 11", value: 70 },
  { date: "Oct 12", value: 68 },
  { date: "Oct 13", value: 90 },
  { date: "Oct 14", value: 85 },
];

// -------------------------------
// 🔹 3. DATA PIE
// -------------------------------
const pieDataBySubject = {
  "Toán": [25, 40, 25, 10],
  "Vật lý": [18, 50, 22, 10],
  "Hóa học": [15, 45, 30, 10],
  "Tiếng Anh": [30, 35, 25, 10],
  "Ngữ văn": [22, 42, 26, 10],
};

const labelspie = ['Giỏi (≥8)', 'Khá (6.5–7.9)', 'Trung bình (5–6.4)', 'Yếu (<5)'];

const pieDataBySubject2 = {
  "Toán": 1800,
  "Vật lý": 1200,
  "Hóa học": 1000,
  "Tiếng Anh": 2500,
  "Ngữ văn": 1500,
};

const pieDataBySubject3 = {
  "Toán": 1500,
  "Vật lý": 900,
  "Hóa học": 1100,
  "Tiếng Anh": 2000,
  "Ngữ văn": 1300,
};

// -------------------------------
// 🔹 4. DATA TABLE
// -------------------------------
type UserStats = {
  date: string;
  activeUsers: number;
  userRatio: number;
  avgSession: number;
  medianSession: number;
};

const userStats: UserStats[] = [
  { date: "1/11/2025", activeUsers: 500, userRatio: 0.25, avgSession: 35.2, medianSession: 30 },
  { date: "2/11/2025", activeUsers: 520, userRatio: 0.26, avgSession: 36.1, medianSession: 31 },
  { date: "3/11/2025", activeUsers: 480, userRatio: 0.24, avgSession: 34.5, medianSession: 29 },
];

const labels2 = ["Toán", "Vật lý", "Hóa học", "Tiếng Anh", "Ngữ văn"];

// -------------------------------
// 🔹 5. COMPONENT CHÍNH
// -------------------------------
export default function DashboardPage() {
  return (
    <div className={styles.dashboard_container}>
      {/* Tổng quan */}
      <div className={styles.sections}>
        <h1 className={styles.title}>Tổng quan</h1>
        <section className={styles.grid}>
          <Card title="Số học sinh tham gia" value="1,245" change="+12.3%" tooltip="Tổng số học sinh đã tham gia kỳ thi trong tháng này, so với tháng trước." />
          <Card title="Bài thi đã nộp" value="6,824" change="+8.7%" tooltip="Số lượng bài thi đã được nộp thành công, bao gồm cả thi thử và chính thức so với tháng trước." />
          <Card title="Điểm trung bình" value="6.72 / 10" change="+0.3" tooltip="Điểm trung bình của tất cả học sinh trong kỳ thi gần nhất, so với kỳ trước." />
          <Card title="Tỷ lệ hoàn thành" value="85%" change="-2.1%" tooltip="Tỷ lệ học sinh hoàn thành toàn bộ bài thi, so với kỳ trước." />
          <Card title="Môn phổ biến nhất" value="Toán" change="+210 lượt" tooltip="Môn học có số lượt tham gia nhiều nhất trong kỳ thi này." />
          <Card title="Học sinh mới" value="154" change="+5.4%" tooltip="Số lượng học sinh mới đăng ký tham gia hệ thống trong tháng này, so với tháng trước." />
        </section>
      </div>

      {/* Biểu đồ */}
      <div className={styles.charts}>
        {/* Line Chart */}
        <div className={styles.sections}>
          <h1 className={styles.title}>Biểu đồ theo thời gian</h1>
          <div className={styles.line}>
            <LineChartBox data={lineData} />
          </div>
        </div>

        {/* Bar Charts (DAU / WAU / MAU) */}
        <div className={styles.sections}>
          <h1 className={styles.title}>Biểu đồ người dùng hoạt động</h1>
          <div className={styles.bar}>
            <BarChartBox title="DAU - 7 ngày gần nhất" datasets={dauData} />
            <BarChartBox title="WAU - 5 tuần gần nhất" datasets={wauData} />
            <BarChartBox title="MAU - 3 tháng gần nhất" datasets={mauData} />
          </div>
        </div>

        {/* Pie Charts */}
        <div className={styles.sections}>
          <h1 className={styles.title}>Biểu đồ theo tỉ lệ</h1>
          <div className={styles.pie_chart}>
            <PieChartBox title="Tỷ lệ học sinh theo mức điểm" pieDataBySubject={pieDataBySubject} labels={labelspie} />
            <PieChartBox title="Môn được học sinh làm nhiều nhất" pieDataBySubject={pieDataBySubject2} labels={labels2} />
            <PieChartBox title="Môn được học sinh hoàn thành nhiều nhất" pieDataBySubject={pieDataBySubject3} labels={labels2} />
          </div>
        </div>
      </div>

      {/* Bảng thống kê */}
      <h1 className={styles.title}>Thống kê điểm theo môn học</h1>
      <Table userStats={userStats} />
    </div>
  );
}

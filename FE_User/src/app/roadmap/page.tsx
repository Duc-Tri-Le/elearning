"use client";
import React, { useEffect, useState } from "react";
import styles from  "./RoadMap.module.css";

interface RoadmapStep {
  roadmap_step_id: number;
  title: string;
  description: string;
  topic_id?: number | null;
}

export default function RoadMap() {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);

  // Giả lập gọi API
  useEffect(() => {
    // TODO: thay bằng fetch(`${API}/roadmap`)
    setSteps([
      {
        roadmap_step_id: 1,
        title: "Ôn tập nền tảng",
        description:
          "Củng cố kiến thức cơ bản, nắm vững lý thuyết từng môn học.",
      },
      {
        roadmap_step_id: 2,
        title: "Luyện tập theo chủ đề",
        description:
          "Thực hành các dạng bài theo từng chủ đề, từ cơ bản đến nâng cao.",
      },
      {
        roadmap_step_id: 3,
        title: "Đề gợi ý theo năng lực",
        description:
          "Hệ thống tự động chọn đề phù hợp với trình độ hiện tại của bạn.",
      },
      {
        roadmap_step_id: 4,
        title: "Thi thử toàn diện",
        description:
          "Thi thử mô phỏng kỳ thi THPT Quốc Gia, có thời gian giới hạn và chấm điểm tự động.",
      },
      {
        roadmap_step_id: 5,
        title: "Phân tích kết quả & cải thiện",
        description:
          "Xem thống kê chi tiết, phát hiện điểm yếu và nhận gợi ý ôn tập thông minh.",
      },
    ]);
  }, []);

  return (
    <div className={styles.roadmapContainer}>
      <h2 className={styles.roadmapTitle}>Lộ Trình Ôn Thi THPT Quốc Gia</h2>
      <p className={styles.roadmapSubtitle}>
        Làm theo từng bước dưới đây để ôn thi hiệu quả và bền vững.
      </p>

      <div className={styles.roadmapLine}>
        {steps.map((step, index) => (
          <div key={step.roadmap_step_id} className={styles.roadmapStep}>
            <div className={styles.stepCircle}>{index + 1}</div>
            <div className={styles.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

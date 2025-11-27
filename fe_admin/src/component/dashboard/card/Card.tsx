import styles from "./Card.module.css";
import { Info } from "lucide-react"; // dùng icon dấu hỏi từ lucide-react (bộ icon phổ biến)

interface CardProps {
  title: string;
  value: string;
  change?: string;
  tooltip?: string; // thêm prop mô tả chi tiết khi hover
}

export default function Card({ title, value, change, tooltip }: CardProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>
        {title}
        {tooltip && (
          <span className={styles.tooltipWrapper}>
            <Info size={16} className={styles.infoIcon} />
            <span className={styles.tooltipText}>{tooltip}</span>
          </span>
        )}
      </h4>

      <div className={styles.value}>{value}</div>
      <div
        className={`${styles.change} ${change?.includes("-") ? styles.negative : styles.positive
          }`}
      >
        {change}
      </div>
    </div>
  );
}

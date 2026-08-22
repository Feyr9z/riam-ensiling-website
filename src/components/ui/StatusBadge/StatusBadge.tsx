import styles from "./StatusBadge.module.scss";

// Maps to the booking status states defined in PRD Section 10 / FR-10
export type BookingStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "expired"
  | "completed"
  | "info";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   "Menunggu Pembayaran",
  paid:      "Sudah Dibayar",
  cancelled: "Dibatalkan",
  expired:   "Kedaluwarsa",
  completed: "Selesai",
  info:      "Info",
};

interface StatusBadgeProps {
  status: BookingStatus;
  /** Override the default label */
  label?: string;
  showDot?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const cn = [
    styles.badge,
    styles[`badge--${status}`],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cn} role="status" aria-label={`Status: ${label ?? STATUS_LABELS[status]}`}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}

import type { Payment } from "../../types/payment"
import PaymentCard from "./PaymentCard"

interface PaymentListProps {
  payments: Payment[];
  onDelete: (payment: Payment) => void;
}

export function PaymentList({ payments, onDelete }: PaymentListProps) {
  if (payments.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          isLatest={index === 0}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default PaymentList;
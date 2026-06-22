import axios, { AxiosError } from "axios";
import { useModal } from "../../context/modal/ModalContext";

const reasons = [
  "payment_method_required",
  "subscription_past_due"
];

export const useBilling = () => {
  const getBillingErrorReason = (err: any) => {
    if (!axios.isAxiosError(err)) return false;
    if (err.response?.status !== 402) return false;

    const detail = err.response.data?.detail;
    if (reasons.includes(detail)) {
      return detail;
    }

    return null;
  }

  return {
    getBillingErrorReason,
  };
};

import { CircleCheck, FilePenLine, Send, TriangleAlert } from "lucide-react";

export const invoiceStatusStyles = {
  overdue: {
    label: "Overdue",
    icon: TriangleAlert,
    borderClass: "border-overdue-tint",
    colorClass: "bg-overdue-tint text-overdue",
  },
  draft: {
    label: "Draft",
    icon: FilePenLine,
    borderClass: "border-draft-tint",
    colorClass: "bg-draft-tint text-draft",
  },
  sent: {
    label: "Sent",
    icon: Send,
    borderClass: "border-sent-tint",
    colorClass: "bg-sent-tint text-sent",
  },
  paid: {
    label: "Paid",
    icon: CircleCheck,
    borderClass: "border-paid-tint",
    colorClass: "bg-paid-tint text-paid",
  },
};

import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice as InvoiceType } from "@prisma/client";
import { memo } from "react";
import { z } from "zod";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { FormInput } from "../form";
import { trpc } from "../../utils/trpc";
import { PDFViewer } from "@react-pdf/renderer";
import Invoice from "../pdf/Invoice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data: InvoiceType;
  recipeId: string;
}

export const PreviewModal = memo(function AddModal({
  isOpen,
  onClose,
  title,
  description,
  invoiceId,
}: ModalProps) {
  const {
    data: invoiceData,
    refetch,
    isLoading,
  } = trpc.useQuery(["invoice.getForInvoice", { id: invoiceId as string }]);

  if (isLoading) return <p>Loading...</p>;
  if (!invoiceData) return <p>Cannot display preview</p>;

  console.log(invoiceData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <PDFViewer
        // showToolbar
        width={"100%"}
        className="col-span-12"
        height={760}
        style={{ borderRadius: "10px" }}
      >
        <Invoice invoice={invoiceData} />
      </PDFViewer>
    </Modal>
  );
});

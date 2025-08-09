import { invoicePosted } from "../common/events";
import { getPrisma } from "../db";

export const onInvoicePosted = invoicePosted.subscribe(async ({ invoiceId, tenant }) => {
  const prisma = getPrisma(tenant);
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return;
  await prisma.journalEntry.create({
    data: {
      ref: invoiceId,
      lines: {
        create: [
          { accountCode: "1100", debit: invoice.total, credit: 0 },
          { accountCode: "4000", debit: 0, credit: invoice.subtotal },
          { accountCode: "2100", debit: 0, credit: invoice.tax },
        ],
      },
    },
  });
});

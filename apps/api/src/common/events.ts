import { events } from "encore.dev";

export interface ProductEvent {
  id: string;
  tenant: string;
}

export interface InvoicePostedEvent {
  invoiceId: string;
  tenant: string;
}

export const productCreated = events.topic<ProductEvent>("product.created");
export const productUpdated = events.topic<ProductEvent>("product.updated");
export const invoicePosted = events.topic<InvoicePostedEvent>("invoice.posted");

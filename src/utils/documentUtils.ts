import jsPDF from "jspdf";
import { NDA_TEMPLATE, SERVICE_AGREEMENT_TEMPLATE } from "@/data/crmData";

export function fillTemplate(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (doc, [key, value]) => doc.replaceAll(`{{${key}}}`, value),
    template,
  );
}

export interface ClientDocData {
  name: string;
  projectId: string;
  bookTitle?: string;
  genre?: string;
  services?: string[];
  estimatedCompletion?: string;
  signatureName: string;
}

export function generateSignedDocument(type: "NDA" | "ServiceAgreement", clientData: ClientDocData) {
  const template = type === "NDA" ? NDA_TEMPLATE : SERVICE_AGREEMENT_TEMPLATE;
  return fillTemplate(template, {
    CLIENT_NAME: clientData.name,
    PROJECT_ID: clientData.projectId,
    DATE: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    BOOK_TITLE: clientData.bookTitle || "",
    GENRE: clientData.genre || "",
    SERVICES_LIST: (clientData.services || []).join("\n- "),
    ESTIMATED_COMPLETION: clientData.estimatedCompletion || "",
    SIGNATURE: clientData.signatureName,
  });
}

export interface SignedDocument {
  type: "NDA" | "ServiceAgreement";
  projectId: string;
  signedBy: string;
  signedAt: string;
  documentContent: string;
}

export function downloadSignedPDF(doc: SignedDocument) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  pdf.setFillColor(11, 31, 75);
  pdf.rect(0, 0, 210, 28, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text("American Writers Hub", 14, 12);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Project ID: ${doc.projectId}`, 14, 20);
  pdf.text(`Document: ${doc.type}`, 90, 20);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 20);

  pdf.setFillColor(21, 128, 61);
  pdf.rect(0, 28, 210, 10, "F");
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`DIGITALLY SIGNED by ${doc.signedBy} on ${doc.signedAt}`, 14, 35);

  pdf.setTextColor(20, 20, 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(doc.documentContent, 182);
  pdf.text(lines, 14, 50);

  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 282, 210, 15, "F");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text("American Writers Hub — Confidential Document", 14, 290);
  pdf.text(`Project ID: ${doc.projectId} | Signed: ${doc.signedAt}`, 14, 295);

  pdf.save(`${doc.type}_${doc.projectId}.pdf`);
}

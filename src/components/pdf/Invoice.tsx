import React from "react";
import { Page, Document, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "../../../src/logo.png";
import InvoiceHeader from "./InvoiceHeader";
import { Expense, Invoice, Worklog } from "@prisma/client";
import InvoiceNo from "./InvoiceNo";
import InvoiceWorklogs from "./InvoiceWorklogs";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

const Invoice = ({
  invoice,
}: {
  invoice: Invoice & { worklogs: Worklog[]; expenses: Expense[] };
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* <Image style={styles.logo} src={logo} /> */}
      <InvoiceHeader title="Invoice" />
      <InvoiceNo invoice={invoice} />
      <InvoiceWorklogs invoice={invoice} />
    </Page>
  </Document>
);

export default Invoice;

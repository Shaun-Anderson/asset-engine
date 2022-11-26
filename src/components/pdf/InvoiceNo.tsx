import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "@prisma/client";

const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 36,
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },
});

const InvoiceNo = ({ invoice }: { invoice: Invoice }) => (
  <Fragment>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.label}>Invoice No:</Text>
      <Text style={styles.invoiceDate}>{invoice.id}</Text>
    </View>
    <View style={styles.invoiceDateContainer}>
      <Text style={styles.label}>Date: </Text>
      <Text>{invoice.created_at.toDateString()}</Text>
    </View>
  </Fragment>
);

export default InvoiceNo;

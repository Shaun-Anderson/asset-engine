import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Invoice, Worklog } from "@prisma/client";

const styles = StyleSheet.create({
  worklogContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 36,
    borderBottom: "1px solid black",
  },
  worklogRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  worklogDesciption: {
    fontStyle: "semibold",
    flexGrow: 0.8,
  },
  worklogValue: {
    flexGrow: 0.2,
  },
  worklogRate: {
    flexGrow: 0.2,
  },
  label: {
    width: 60,
  },
});

const InvoiceWorklogs = ({
  invoice,
}: {
  invoice: Invoice & { worklogs: Worklog[] };
}) => (
  <Fragment>
    <Text>Worklogs</Text>
    {invoice.worklogs.map((worklog, i) => {
      return (
        <View key={i} style={styles.worklogContainer}>
          <Text style={styles.worklogDesciption}>{worklog.description}</Text>
          <Text style={styles.worklogValue}>{worklog.value}</Text>
          <Text style={styles.worklogRate}>{worklog.rate}</Text>
        </View>
      );
    })}
  </Fragment>
);

export default InvoiceWorklogs;

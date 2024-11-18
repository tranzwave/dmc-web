import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { RestaurantVoucherData } from "..";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
  },
  header: {
    backgroundColor: "#287F71", // Primary green
    padding: 12,
    textAlign: "center",
    color: "white",
  },
  section: {
    marginBottom: 16,
    lineHeight: 2
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopWidth: 0, // Removes double-line border between cells
    borderLeftWidth: 0, // Removes double-line border between cells
  },
  footer: {
    backgroundColor: "#287F71",
    height: 32,
  },
  textBold: {
    fontWeight: "bold",
  },
  textRight: {
    textAlign: "right",
  },
  title: {
    fontWeight: "bold", // Makes title bold
    textAlign: "center",
  }
});


export type RestaurantVoucherPDFProps= {
    voucher: RestaurantVoucherData;
    organization: any,
    user:any
    cancellation?: boolean
  };

const RestaurantVoucherDownloadablePDF = ({ voucher, organization, user }:RestaurantVoucherPDFProps) => {
  const formattedDate = new Date().toLocaleDateString();

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Image src={organization?.imageUrl ?? ""} style={{ height: 32, marginBottom: 4 }} /> */}
          <Text>{organization?.name}</Text>
          {organization?.address && <Text>{organization?.address}</Text>}
          {organization?.contactNumber && <Text>{organization?.contactNumber}</Text>}
          {organization?.website && <Text>{organization?.website}</Text>}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>
            {voucher.status === "cancelled"
              ? "Cancellation Voucher"
              : `Restaurant Reservation Voucher${voucher.status === "amended" ? " - Amendment" : ""}`}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text>Restaurant Name: {voucher?.restaurant.name}</Text>
          <Text>Voucher ID: {voucher?.voucherLines[0]?.id ?? ""}</Text>
          <Text>Tour ID: {voucher?.bookingLineId}</Text>
          <Text>
            Country: {voucher.bookingLineId.split("-")[1]?.split("-")[0] ?? "N/A"}
          </Text>
          <Text>Adults: {voucher.voucherLines[0]?.adultsCount}</Text>
          <Text>Kids: {voucher.voucherLines[0]?.kidsCount}</Text>
        </View>

        {/* Table */}
        <View style={[styles.table, { marginBottom: 16 }]}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {["Date", "Meal Type", "Adults Count", "Kids Count", "Amount"].map(
              (header) => (
                <Text key={header} style={[styles.tableCell, styles.textBold]}>
                  {header}
                </Text>
              )
            )}
          </View>

          {/* Table Rows */}
          {voucher.voucherLines?.map((line, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{line.date ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.mealType ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.adultsCount ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.kidsCount ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.rate ?? "N/A"}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={[styles.section, styles.textRight]}>
          <Text>
            Total (USD):{" "}
            {voucher.voucherLines[0]?.rate
              ? Number(voucher.voucherLines[0]?.rate ?? 0).toFixed(2)
              : "0.00"}
          </Text>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          {voucher.availabilityConfirmedTo && (
            <Text>
              Availability confirmed by {voucher.availabilityConfirmedBy}{" "}
              {voucher.availabilityConfirmedTo ? `to ${voucher.availabilityConfirmedTo}` : ""}
            </Text>
          )}
          {voucher.ratesConfirmedTo && (
            <Text>
              Rates confirmed by {voucher.ratesConfirmedBy}{" "}
              {voucher.ratesConfirmedTo ? `to ${voucher.ratesConfirmedTo}` : ""}
            </Text>
          )}
        </View>

        {/* Special Notes */}
        <View style={styles.section}>
          <Text>Special Notes: {voucher.voucherLines[0]?.remarks}</Text>
          {voucher.status === "amended" && (
            <Text>Reason for amendment: {voucher.reasonToAmend}</Text>
          )}
          {voucher.status === "cancelled" && (
            <Text>Reason for cancellation: {voucher.reasonToAmend}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Text>Printed Date: {formattedDate}</Text>
          <Text>Prepared By: {user?.fullName ?? "N/A"}</Text>
          <Text>This is a computer-generated Voucher & does not require a signature.</Text>
        </View>

        <View style={styles.footer} />
      </Page>
    </Document>
  );
};

export default RestaurantVoucherDownloadablePDF;

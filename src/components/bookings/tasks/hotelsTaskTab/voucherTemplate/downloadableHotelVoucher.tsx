import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { HotelVoucherData } from "..";

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

export type HotelVoucherPDFProps = {
  voucher: HotelVoucherData;
  organization: any,
  user: any
  cancellation?: boolean
};

const HotelVoucherDownloadablePDF = ({ voucher, organization, user }: HotelVoucherPDFProps) => {
  const formattedDate = new Date().toLocaleDateString();

  const calculateTotal = () => {
    let sum = 0
    voucher.voucherLines.forEach(l => {
      sum += l.roomCount * (Number(l.rate) ?? 0)
    })
    return sum;
  }


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
              : voucher.status === "amended" ? "Hotel Reservation Voucher - Amendment" : "Hotel Reservation Voucher"}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text>Hotel Name: {voucher?.hotel.name}</Text>
          <Text>Tour ID: {voucher?.bookingLineId}</Text>
          <Text>Voucher ID: {voucher?.id ?? ""}</Text>
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
            {["Occupancy", "Meal Plan", "Room Category", "Check In", "Check Out", "Quantity", "Rate", "Amount"].map(
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
              <Text style={styles.tableCell}>{line.roomType ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.basis ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.roomCategory ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.checkInDate ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.checkOutDate ?? "N/A"}</Text>
              <Text style={styles.tableCell}>{line.roomCount}</Text>
              <Text style={styles.tableCell}>{line.rate ?? "-"}</Text>
              <Text style={styles.tableCell}>
                {line.rate ? ((Number(line.rate) ?? 0) * line.roomCount).toFixed(2) : "-"}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={[styles.section, styles.textRight]}>
          {/* <Text>
            Total (USD):{" "}
            {voucher.voucherLines[0]?.rate
              ? (Number(voucher.voucherLines[0]?.rate ?? 0) * (voucher.voucherLines[0]?.roomCount ?? 0)).toFixed(2)
              : "0.00"}
          </Text> */}
          <Text>
            Total (USD):{" "}
            {calculateTotal()}
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
          <Text>{voucher.reasonToAmend !== null ? `Reason for amend : ${voucher.reasonToAmend ?? ""} ` : ""}</Text>
          {voucher.status === "cancelled" && (
            <Text>Reason for cancellation: {voucher.reasonToCancel ?? ""}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Text>Printed Date: {formattedDate}</Text>
          <Text>Prepared By: {user?.fullName ?? "N/A"}</Text>
          <Text>Contact Number: {(user?.publicMetadata as any)?.info?.contact ?? ""}</Text>
          <Text>This is a computer-generated Voucher & does not require a signature.</Text>
        </View>

        <View style={styles.footer} />
      </Page>
    </Document>
  );
};

export default HotelVoucherDownloadablePDF;

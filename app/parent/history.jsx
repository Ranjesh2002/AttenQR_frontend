import api from "@/utils/api";
import { BarChart3, Calendar, CalendarDays } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendarDays(monthIndex, attendanceData, year) {
  const days = [];
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const attendance = attendanceData.find((r) => r.date === dateStr);
    days.push({ day, date: dateStr, status: attendance?.status || null });
  }

  return days;
}

export default function AttendanceScreen() {
  const [viewMode, setViewMode] = useState("calendar");
  const [data, setData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0,
  });

  const today = new Date();
  const displayMonthIndex = today.getMonth();
  const displayYear = today.getFullYear();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/parent-attendance-history/");
        setData(
          res.data.attendance_records.map((r) => ({
            data: r.data,
            status: "present",
          }))
        );
        setMonthlyStats({
          totalDays: res.data.stats.total_classes,
          presentDays: res.data.stats.present,
          absentDays: res.data.stats.absent,
          percentage: res.data.stats.percentage,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);

  const calendarDays = generateCalendarDays(
    data,
    displayMonthIndex,
    displayYear
  );

  const presentPct = monthlyStats.totalDays
    ? Math.round((monthlyStats.presentDays / monthlyStats.totalDays) * 100)
    : 0;
  const absentPct = monthlyStats.totalDays
    ? Math.round((monthlyStats.absentDays / monthlyStats.totalDays) * 100)
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>
          Track Ratik's attendance history
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "calendar"
                ? styles.toggleActive
                : styles.toggleInactive,
            ]}
            onPress={() => setViewMode("calendar")}
            activeOpacity={0.8}
          >
            <View style={styles.toggleContent}>
              <CalendarDays
                size={16}
                color={viewMode === "calendar" ? "#fff" : "#374151"}
              />
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "calendar" && { color: "#fff" },
                ]}
              >
                Calendar
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "stats"
                ? styles.toggleActive
                : styles.toggleInactive,
            ]}
            onPress={() => setViewMode("stats")}
            activeOpacity={0.8}
          >
            <View style={styles.toggleContent}>
              <BarChart3
                size={16}
                color={viewMode === "stats" ? "#fff" : "#374151"}
              />
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "stats" && { color: "#fff" },
                ]}
              >
                Statistics
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {viewMode === "calendar" ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar size={18} color="#2563EB" />
              <Text style={styles.cardTitle}>
                {monthNames[displayMonthIndex]} {displayYear}
              </Text>
            </View>

            <View style={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <Text key={d} style={styles.dayLabel}>
                  {d}
                </Text>
              ))}

              {calendarDays.map((d, idx) => (
                <View key={`cell-${idx}`} style={styles.calendarCell}>
                  {d ? (
                    <View
                      style={[
                        styles.dayCircle,
                        d.status === "present" && styles.presentCircle,
                        d.status === "absent" && styles.absentCircle,
                        d.status === null && styles.neutralDay,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          d.status === null && styles.neutralDayText,
                        ]}
                      >
                        {d.day}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.emptyCell} />
                  )}
                </View>
              ))}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#16A34A" }]}
                />
                <Text style={styles.legendText}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                />
                <Text style={styles.legendText}>Absent</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <BarChart3 size={18} color="#2563EB" />
              <Text style={styles.cardTitle}>Monthly Statistics</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: "#16A34A" }]}>
                  {monthlyStats.presentDays}
                </Text>
                <Text style={styles.statLabel}>Present Days</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: "#EF4444" }]}>
                  {monthlyStats.absentDays}
                </Text>
                <Text style={styles.statLabel}>Absent Days</Text>
              </View>
            </View>

            <View style={styles.centerBlock}>
              <Text style={styles.rateNumber}>{monthlyStats.percentage}%</Text>
              <Text style={styles.rateLabel}>Attendance Rate</Text>

              <View style={styles.mainProgressTrack}>
                <View
                  style={[
                    styles.mainProgressFill,
                    { width: `${monthlyStats.percentage}%` },
                  ]}
                />
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Present</Text>
                <Text style={styles.progressCount}>
                  {monthlyStats.presentDays}/{monthlyStats.totalDays}
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${presentPct}%`, backgroundColor: "#16A34A" },
                  ]}
                />
              </View>

              <View style={[styles.progressRow, { marginTop: 12 }]}>
                <Text style={styles.progressLabel}>Absent</Text>
                <Text style={styles.progressCount}>
                  {monthlyStats.absentDays}/{monthlyStats.totalDays}
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${absentPct}%`, backgroundColor: "#EF4444" },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.smallMuted}>This Month</Text>
              <Text style={styles.summaryText}>
                {monthlyStats.presentDays}/{monthlyStats.totalDays} days
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                monthlyStats.percentage >= 80
                  ? styles.goodBadge
                  : styles.badBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {monthlyStats.percentage >= 80 ? "Good" : "Needs Improvement"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  headerSubtitle: { color: "rgba(255,255,255,0.9)", marginTop: 6 },

  toggleRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  toggleBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleActive: { backgroundColor: "#2563EB" },
  toggleInactive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E7EB",
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: { marginLeft: 8, fontWeight: "600", color: "#111827" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: "600" },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  dayLabel: {
    flexBasis: "14.2857%",
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  calendarCell: {
    flexBasis: "14.2857%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  presentCircle: { backgroundColor: "#16A34A" },
  absentCircle: { backgroundColor: "#EF4444" },
  neutralDay: { backgroundColor: "transparent" },
  dayText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  neutralDayText: { color: "#374151" },
  emptyCell: { width: 36, height: 36 },

  legendRow: { flexDirection: "row", justifyContent: "center", marginTop: 6 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { marginLeft: 8, color: "#6B7280", fontSize: 13 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 13, color: "#6B7280", marginTop: 6 },

  centerBlock: { alignItems: "center", marginBottom: 4 },
  rateNumber: { fontSize: 36, fontWeight: "800", color: "#2563EB" },
  rateLabel: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  mainProgressTrack: {
    height: 10,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    width: "100%",
  },
  mainProgressFill: { height: 10, backgroundColor: "#2563EB", borderRadius: 8 },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { color: "#374151", fontSize: 14 },
  progressCount: { fontSize: 13, color: "#111827", fontWeight: "600" },
  track: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginTop: 6,
  },
  fill: { height: 8, borderRadius: 8 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallMuted: { fontSize: 13, color: "#6B7280" },
  summaryText: { fontSize: 16, fontWeight: "700" },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  goodBadge: { backgroundColor: "#2563EB" },
  badBadge: { backgroundColor: "#EF4444" },
  badgeText: { color: "#fff", fontWeight: "700" },
});

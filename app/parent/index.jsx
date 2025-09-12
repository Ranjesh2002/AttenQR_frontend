import {
  Bell,
  Calendar,
  Check,
  Clock,
  TrendingUp,
  X,
} from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const todayAttendance = {
  status: "present",
  time: "8:45 AM",
  date: new Date().toLocaleDateString(),
};

const weeklyStats = {
  present: 4,
  total: 5,
  percentage: 80,
};

const recentAnnouncements = [
  {
    id: 1,
    title: "Parent-Teacher Meeting Scheduled",
    content:
      "Annual parent-teacher meeting scheduled for this Saturday at 10 AM.",
    date: "2 hours ago",
    type: "event",
  },
  {
    id: 2,
    title: "Mathematics Test Results",
    content:
      "Mathematics test results have been published. Check your child's performance.",
    date: "1 day ago",
    type: "academic",
  },
];

export default function Home() {
  const getStatusIcon = () => {
    switch (todayAttendance.status) {
      case "present":
        return <Check size={16} color="green" />;
      case "absent":
        return <X size={16} color="red" />;
      default:
        return <Clock size={16} color="orange" />;
    }
  };

  const getStatusText = () => {
    switch (todayAttendance.status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      default:
        return "Not Marked";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good morning, Anil!</Text>
        <Text style={styles.headerSubtitle}>
          Here's Ratik's attendance summary
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color="#007AFF" />
          <Text style={styles.cardTitle}>Today's Attendance</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.statusRow}>
            {getStatusIcon()}
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
          {todayAttendance.status === "present" && (
            <Text style={styles.subText}>Marked at {todayAttendance.time}</Text>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color="#007AFF" />
          <Text style={styles.cardTitle}>This Week</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.bigText}>
                {weeklyStats.present}/{weeklyStats.total}
              </Text>
              <Text style={styles.subText}>days present</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.bigText, { color: "green" }]}>
                {weeklyStats.percentage}%
              </Text>
              <Text style={styles.subText}>attendance</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${weeklyStats.percentage}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Bell size={20} color="#007AFF" />
          <Text style={styles.cardTitle}>Recent Announcements</Text>
        </View>
        <View style={styles.cardContent}>
          {recentAnnouncements.map((a) => (
            <View key={a.id} style={styles.announcement}>
              <Text style={styles.announcementTitle}>{a.title}</Text>
              <Text style={styles.subText}>{a.content}</Text>
              <Text style={styles.announcementDate}>{a.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
  cardContent: { marginTop: 4 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { marginLeft: 6, fontSize: 16, fontWeight: "500" },
  subText: { fontSize: 13, color: "#666", marginTop: 4 },
  bigText: { fontSize: 22, fontWeight: "bold" },
  progressBar: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 12,
  },
  progressFill: { height: 8, backgroundColor: "green", borderRadius: 10 },
  announcement: {
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    paddingLeft: 8,
    marginBottom: 12,
  },
  announcementTitle: { fontWeight: "600", fontSize: 15 },
  announcementDate: { fontSize: 12, color: "#888", marginTop: 2 },
});

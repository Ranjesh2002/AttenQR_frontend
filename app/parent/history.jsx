import { colors, fontSizes, shadows, spacing } from "@/constants/theme";
import { format } from "date-fns";
import {
  Calendar,
  CircleCheck as CheckCircle,
  Filter,
  Circle as XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import api from "../../utils/api";

export default function HistoryScreen() {
  const [filter, setFilter] = useState("all");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/student-attendance/", {
          withCredentials: true,
        });
        setAttendance(res.data.attendance_history);
      } catch (error) {
        console.log("failed to fetch attendance", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = attendance.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      style={styles.attendanceItem}
    >
      <View style={styles.dateContainer}>
        <Calendar size={16} color={colors.textLight} />
        <Text style={styles.dateText}>{format(item.date, "MMM dd, yyyy")}</Text>
      </View>

      <View style={styles.subjectContainer}>
        <Text style={styles.subjectText}>{item.subject}</Text>
      </View>

      <View
        style={[
          styles.statusContainer,
          item.status === "present"
            ? styles.presentStatus
            : styles.absentStatus,
        ]}
      >
        {item.status === "present" ? (
          <>
            <CheckCircle size={16} color={colors.success} />
            <Text style={styles.presentText}>Present</Text>
          </>
        ) : (
          <>
            <XCircle size={16} color={colors.error} />
            <Text style={styles.absentText}>Absent</Text>
          </>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance History</Text>

        <View style={styles.filterContainer}>
          <Filter size={20} color={colors.textLight} />
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "all" && styles.activeFilterButton,
              ]}
              onPress={() => setFilter("all")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "all" && styles.activeFilterText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "present" && styles.activeFilterButton,
              ]}
              onPress={() => setFilter("present")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "present" && styles.activeFilterText,
                ]}
              >
                Present
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "absent" && styles.activeFilterButton,
              ]}
              onPress={() => setFilter("absent")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "absent" && styles.activeFilterText,
                ]}
              >
                Absent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attendance records found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.md,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontFamily: "Inter-Bold",
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  filterLabel: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Medium",
    color: colors.textLight,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  filterButtons: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  filterButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Medium",
    color: colors.textLight,
  },
  activeFilterText: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
  },
  attendanceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  dateText: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Regular",
    color: colors.textLight,
  },
  subjectContainer: {
    flex: 1.5,
    paddingHorizontal: spacing.sm,
  },
  subjectText: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Medium",
    color: colors.textDark,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  presentStatus: {
    backgroundColor: "rgba(72, 187, 120, 0.1)",
  },
  absentStatus: {
    backgroundColor: "rgba(245, 101, 101, 0.1)",
  },
  presentText: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Medium",
    color: colors.success,
  },
  absentText: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Medium",
    color: colors.error,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Medium",
    color: colors.textLight,
  },
});

import { colors, fontSizes, shadows, spacing } from "@/constants/theme";
import {
  BookOpen,
  CalendarCheck,
  CreditCard as Edit2,
  Flame,
  LogOut,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import api from "../../utils/api";
import { logout } from "../../utils/auth";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [atten, setAtten] = useState(null);
  const [streaks, setStreaks] = useState(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.post("/student-profile/", {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (error) {
        console.log(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    const fetch = async () => {
      try {
        const resp = await api.get("/student-atten-percentage/", {
          withCredentials: true,
        });
        setAtten(resp.data);
      } catch (error) {
        console.log(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    const streak = async () => {
      try {
        const res = await api.get("/streak/", {
          withCredentials: true,
        });
        setStreaks(res.data);
      } catch (error) {
        console.log(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };
    fetchProfile();
    fetch();
    streak();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Edit2 size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>
          {profile ? profile.fullname : "no name"}
        </Text>
        <Text style={styles.studentId}>{profile ? profile.id : "no id"}</Text>
      </View>

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.infoCard}
      >
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {profile ? profile.email : "no email"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Department</Text>
          <Text style={styles.infoValue}>
            {profile ? profile.department : "no department"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year</Text>
          <Text style={styles.infoValue}>
            {profile ? profile.year : "no year"}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: "rgba(72, 187, 120, 0.1)" },
            ]}
          >
            <CalendarCheck size={18} color={colors.success} />
          </View>
          <Text style={styles.statValue}>
            {atten?.attendance_percentage ?? "N/A"}%
          </Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: "rgba(74, 144, 226, 0.1)" },
            ]}
          >
            <BookOpen size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>
            {profile ? profile.last_attendance_date : "no date"}
          </Text>
          <Text style={styles.statLabel}>Last-Atten</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: "rgba(236, 201, 75, 0.1)" },
            ]}
          >
            <Flame size={18} color={colors.warning} />
          </View>
          <Text style={styles.statValue}>{streaks?.streak ?? "N/A"}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primaryDark,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    fontSize: fontSizes.xxl,
    fontFamily: "Inter-Bold",
    color: colors.white,
    marginBottom: spacing.xs,
  },
  studentId: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    ...shadows.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoLabel: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Medium",
    color: colors.textLight,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Medium",
    color: colors.textDark,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSizes.xs,
    fontFamily: "Inter-Bold",
    color: colors.textDark,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Regular",
    color: colors.textLight,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245, 101, 101, 0.1)",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Medium",
    color: colors.error,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  versionText: {
    fontSize: fontSizes.sm,
    fontFamily: "Inter-Regular",
    color: colors.textLight,
  },
});

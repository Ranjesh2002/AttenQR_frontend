import { colors, fontSizes, shadows, spacing } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AuthGuard } from "../../components/AuthGaurd";
import api from "../../utils/api";

export default function TeacherHomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("Teacher");
  const [classSession, setClassSession] = useState(null);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setUsername(user.first_name || "Teacher");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const Class = async () => {
      try {
        const res = await api.post("/todays-class/", {
          withCredentials: true,
        });
        setClassSession(res.data);
      } catch (error) {
        console.log(
          "error fetching the session",
          error.response?.data || error.message
        );
      }
    };
    Class();
  });

  return (
    <AuthGuard role="teacher">
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {username} 👋</Text>
          <Text style={styles.subtitle}>
            Generate QR Code to mark attendance
          </Text>
        </View>

        <View style={styles.card}>
          {classSession ? (
            <>
              <Text style={styles.cardTitle}>
                📚 Today: {classSession.subject}
              </Text>
              <Text style={styles.cardText}>
                🕙 Time: {classSession.start_time} - {classSession.end_time}
              </Text>
              <Text style={styles.cardText}>
                👥 Students: {classSession.total_students}
              </Text>

              <TouchableOpacity
                style={styles.qrButton}
                onPress={() => router.push("/QR")}
              >
                <Text style={styles.qrButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.cardText}>No class scheduled for today.</Text>
          )}
        </View>
      </SafeAreaView>
    </AuthGuard>
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
  greeting: {
    fontSize: fontSizes.xxl,
    fontFamily: "Inter-Bold",
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Regular",
    color: colors.textLight,
  },
  card: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontFamily: "Inter-SemiBold",
    marginBottom: spacing.sm,
    color: colors.textDark,
  },
  cardText: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Regular",
    marginBottom: spacing.xs,
    color: colors.textLight,
  },
  qrButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  qrButtonText: {
    fontSize: fontSizes.md,
    fontFamily: "Inter-Bold",
    color: colors.white,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: colors.white,
  },
});

import Colors from "@/constants/Colors";
import { fontSizes, shadows } from "@/constants/theme";
import { BookOpen, LogOut, Mail, Settings, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import api from "../../utils/api";
import { logout } from "../../utils/auth";

export default function ProfileScreen() {
  const [classSession, setClassSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchClassSession = async () => {
      try {
        const res = await api.post("/todays-class/", {
          withCredentials: true,
        });
        setClassSession(res.data);
      } catch (error) {
        console.log(
          "Error fetching class session:",
          error.response?.data || error.message
        );
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await api.post("/teacher-profile/", {
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

    fetchClassSession();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Avatar.Text
            size={40}
            label={
              profile?.fullname
                ? profile.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "?"
            }
            style={{ backgroundColor: "#3b82f6" }}
            color="white"
          />
          <Text style={styles.name}>
            {profile ? profile.fullname : "no name"}
          </Text>
          <Text style={styles.studentId}>786438</Text>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Personal Information</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <User size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {profile ? profile.fullname : "no name"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Mail size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>
                {profile ? profile.email : "no email"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <BookOpen size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue}>
                {classSession ? classSession.subject : "No subject"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.light.secondary,
  },
  profileCard: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    alignItems: "center",
    ...shadows.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    ...shadows.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 56,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.light.error,
    borderRadius: 12,
    paddingVertical: 14,
    ...shadows.sm,
  },
  logoutText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
});

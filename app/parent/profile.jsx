import api from "@/utils/api";
import {
  Bell,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import { logout } from "../../utils/auth";

const quickActions = [
  {
    icon: Settings,
    label: "Account Settings",
    description: "Manage your account preferences",
  },
  {
    icon: Bell,
    label: "Notification Settings",
    description: "Configure alerts and reminders",
  },
  {
    icon: Shield,
    label: "Privacy & Security",
    description: "Update password and security settings",
  },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/parent_profile/");
        setProfile(res.data);
      } catch (err) {
        console.log("Error fetching parent profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Loading parent profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account information
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={20} color="#3b82f6" />
            <Text style={styles.cardHeaderText}>Parent Information</Text>
          </View>

          <View style={styles.row}>
            <Avatar.Text
              size={40}
              label={
                profile?.name
                  ? profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"
              }
              style={{ backgroundColor: "#3b82f6" }}
              color="white"
            />
            <View style={styles.flex1}>
              <Text style={styles.name}>{profile?.name || "N/A"}</Text>
              <Text style={styles.muted}>Father</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Mail size={16} color="#6b7280" />
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email || "N/A"}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Phone size={16} color="#6b7280" />
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {profile?.phone_number || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <GraduationCap size={20} color="#3b82f6" />
            <Text style={styles.cardHeaderText}>Student Information</Text>
          </View>

          <View style={styles.row}>
            <Avatar.Text
              size={40}
              label={
                profile.student?.name
                  ? profile.student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"
              }
              style={{ backgroundColor: "#22c55e" }}
              color="white"
            />
            <View style={styles.flex1}>
              <Text style={styles.name}>{profile.student?.name || "N/A"}</Text>
              <Text style={styles.muted}>
                {profile.student?.department || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.infoLabel}>Student ID</Text>
              <Text style={styles.infoValue}>
                {profile.student?.student_id || "N/A"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoValue}>
                {profile.student?.year || "N/A"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {profile.student?.email || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeaderText}>Quick Actions</Text>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <View style={styles.actionIcon}>
                  <Icon size={16} color="#3b82f6" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.muted}>{action.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#ef4444" style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AttenQR Parent Portal v1.0</Text>
          <Text style={styles.footerSubText}>© 2024 All rights reserved</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#3b82f6",
    padding: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: { color: "rgba(255,255,255,0.8)" },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardHeaderText: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: "15px",
  },
  flex1: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  muted: { color: "#6b7280", fontSize: 13 },
  separator: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
  infoGroup: { gap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 13, fontWeight: "500" },
  infoValue: { fontSize: 13, color: "#6b7280" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "50%", marginBottom: 12 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    marginBottom: 8,
  },
  actionIcon: {
    padding: 6,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    marginRight: 8,
  },
  actionLabel: { fontWeight: "500" },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: { color: "#ef4444", fontWeight: "500" },
  footer: { alignItems: "center", paddingVertical: 16 },
  footerText: { fontSize: 12, color: "#6b7280" },
  footerSubText: { fontSize: 12, color: "#9ca3af" },
});

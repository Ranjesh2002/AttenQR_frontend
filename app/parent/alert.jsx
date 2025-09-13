import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const messages = [
  {
    id: 1,
    title: "Parent-Teacher Meeting Scheduled",
    content:
      "Annual parent-teacher meeting scheduled for this Saturday at 10 AM in the school auditorium. Please confirm your attendance by replying to this message.",
    type: "event",
    date: "2 hours ago",
    sender: "Principal Mrs. Johnson",
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    title: "Mathematics Test Results Published",
    content:
      "Mathematics test results have been published. Emily scored 92/100. Overall class performance was excellent with an average of 85%.",
    type: "academic",
    date: "1 day ago",
    sender: "Math Teacher Mr. Smith",
    isRead: true,
    priority: "medium",
  },
  {
    id: 3,
    title: "School Closure Notice",
    content:
      "Due to severe weather conditions, the school will remain closed tomorrow, January 17th. Online classes will be conducted as per regular schedule.",
    type: "alert",
    date: "2 days ago",
    sender: "Administration Office",
    isRead: true,
    priority: "high",
  },
  {
    id: 4,
    title: "Science Fair Participation",
    content:
      "Invitation to participate in the annual science fair. Registration deadline is February 1st. Please encourage your child to participate.",
    type: "event",
    date: "3 days ago",
    sender: "Science Department",
    isRead: true,
    priority: "medium",
  },
  {
    id: 5,
    title: "Fee Payment Reminder",
    content:
      "Friendly reminder that the monthly fee payment is due by January 25th. Please ensure timely payment to avoid any inconvenience.",
    type: "announcement",
    date: "1 week ago",
    sender: "Accounts Department",
    isRead: true,
    priority: "medium",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "announcement":
      return { name: "notifications", color: "#3b82f6" };
    case "event":
      return { name: "chatbubbles", color: "#10b981" };
    case "academic":
      return { name: "document-text", color: "#f59e0b" };
    case "alert":
      return { name: "alert-circle", color: "#ef4444" };
    default:
      return { name: "chatbubble-outline", color: "#6b7280" };
  }
};

export default function MessagesScreen() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const renderMessage = ({ item }) => {
    const { name, color } = getIcon(item.type);
    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.unreadCard]}
        onPress={() => setSelectedMessage(item)}
      >
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
            <Ionicons name={name} size={20} color={color} />
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.content} numberOfLines={1}>
              {item.content}
            </Text>
            <View style={styles.footer}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedMessage) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedMessage(null)}>
          <Text style={styles.back}>← Back to messages</Text>
        </TouchableOpacity>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{selectedMessage.title}</Text>
          <Text style={styles.sender}>From: {selectedMessage.sender}</Text>
          <Text style={styles.date}>{selectedMessage.date}</Text>
          <Text style={styles.detailContent}>{selectedMessage.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          {unreadCount > 0
            ? `${unreadCount} unread messages`
            : "All messages read"}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#3b82f6" }]}>
            {messages.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#f59e0b" }]}>
            {unreadCount}
          </Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#10b981" }]}>
            {messages.length - unreadCount}
          </Text>
          <Text style={styles.statLabel}>Read</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { color: "#e0e7ff", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: "#3b82f6" },
  row: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: { flex: 1 },
  title: { fontWeight: "600", fontSize: 14, marginBottom: 2 },
  content: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  sender: { fontSize: 12, color: "#4b5563" },
  date: { fontSize: 12, color: "#9ca3af" },
  detailCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  detailTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  detailContent: { fontSize: 14, marginTop: 8, color: "#374151" },
  back: { marginBottom: 12, color: "#3b82f6", fontWeight: "600" },
});

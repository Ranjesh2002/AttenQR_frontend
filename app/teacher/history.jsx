import { useRouter } from "expo-router";
import { History } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../utils/api";

const HistoryPage = () => {
  const [classSession, setClassSession] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get("/attendance-history/", {
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
    fetchSession();
  }, []);

  return (
    <ScrollView>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            View attendance records for your recent classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classSession &&
            classSession.map((session) => (
              <View key={session.id} style={styles.sessionRow}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.courseText}>{session.subject}</Text>
                  <Text style={styles.dateText}>{session.date}</Text>
                  <Text style={styles.attendanceText}>
                    Attendance: {session.attendees}/{session.total} (
                    {session.percentage}%)
                  </Text>
                </View>
                <Button
                  variant="outline"
                  onPress={() =>
                    router.push(`/attendance?sessionId=${session.id}`)
                  }
                  style={styles.detailsButton}
                >
                  <History size={16} style={styles.historyIcon} />
                  <Text>Details</Text>
                </Button>
              </View>
            ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sessionRow: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionInfo: {
    flex: 1,
  },
  courseText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  attendanceText: {
    fontSize: 12,
    color: "#888",
  },
  detailsButton: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  historyIcon: {
    marginRight: 8,
  },
});

export default HistoryPage;

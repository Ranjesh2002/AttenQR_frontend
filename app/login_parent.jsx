import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../utils/api";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/login/", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { user, tokens } = response.data;
        if (user.role !== role) {
          Alert.alert("selected role does not match the user role");
          alert("selected role does not match the user role");
          setIsLoading(false);
          return;
        }
        await AsyncStorage.multiSet([
          ["user", JSON.stringify(user)],
          ["accessToken", tokens.access],
          ["refreshToken", tokens.refresh],
        ]);

        alert("Login successful");

        if (user.role === "teacher") {
          router.push("/parent");
        } else {
          router.push("/student");
        }
      }
    } catch (error) {
      console.log("Login error:", error?.response?.data || error.message);
      alert("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to access your account
        </Text>

        <View style={styles.roleBtn}>
          <TouchableOpacity
            style={[
              styles.rolebtn,
              role === "student" ? styles.active : styles.inactive,
            ]}
            onPress={() => setRole("student")}
          >
            <Text style={styles.roleT}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rolebtn,
              role === "teacher" ? styles.active : styles.inactive,
            ]}
            onPress={() => setRole("teacher")}
          >
            <Text style={styles.roleT}>Teacher</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Sign in as {role}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#6c757d",
    marginBottom: 16,
  },
  roleBtn: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
    justifyContent: "space-between",
  },
  rolebtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#007bff",
  },
  inactive: {
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
  },
  roleT: {
    color: "#000",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6c757d",
  },
  lText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

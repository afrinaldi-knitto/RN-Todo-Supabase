import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import useAuthStore from "../store/useAuthStore";
import { COLORS } from "../lib/constant";

interface AuthScreenProps {
  onLogin: (userId: number) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, login, register, setError } = useAuthStore();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      setError(null);
    }
  }, [error, setError]);

  const emptyFields = () =>
    !username.trim() || !password.trim()
      ? Alert.alert("Peringatan", "Username & password wajib diisi.")
      : false;

  const handleLogin = async () => {
    if (emptyFields()) return;
    const id = await login(username.trim(), password);
    if (id) {
      onLogin(id);
      Alert.alert("Login Berhasil", `Selamat datang ${username.trim()}`);
    }
  };

  const handleRegister = () => {
    if (!emptyFields()) register(username.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO App</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#94A3B8"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.buttonText} />
        ) : (
          <Text style={styles.buttonLabel}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonOutline, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={[styles.buttonLabel, { color: COLORS.primary }]}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.buttonText,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

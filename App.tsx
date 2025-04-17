import { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./screens/AuthScreen";
import TodoScreen from "./screens/TodoScreen";

export default function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userId");
      if (stored) setUserId(Number(stored));
      setReady(true);
    })();
  }, []);

  const handleLogin = useCallback(async (id: number) => {
    await AsyncStorage.setItem("userId", String(id));
    setUserId(id);
  }, []);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem("userId");
    setUserId(null);
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userId ? (
        <TodoScreen userId={userId} onLogout={handleLogout} />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </SafeAreaView>
  );
}

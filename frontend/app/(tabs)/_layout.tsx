import { Tabs } from "expo-router";
import React from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Web3AuthWrapper } from "@/components/web3Auth/Web3AuthWrapper";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Web3AuthWrapper>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View style={styles.container}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarShowLabel: false, // Hide labels for a more minimal look
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "home" : "home-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="camera"
              options={{
                title: "",
                tabBarButton: ({ onPress }) => (
                  <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={onPress}
                    >
                      <Ionicons name="camera" color="white" size={30} />
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Tabs.Screen
              name="account"
              options={{
                title: "Account",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "person" : "person-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </View>
      </SafeAreaView>
    </Web3AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 33,
  },
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: "white", // Or use Colors[colorScheme].background for theme support
    borderTopWidth: 0, // Remove top border for a cleaner look
    elevation: 8, // Add shadow on Android
    shadowColor: "#000", // Add shadow on iOS
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cameraButtonContainer: {
    top: -30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    width: 90,
    height: 90,
    borderRadius: 35,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

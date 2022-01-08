import { LogBox, StyleSheet, Text, SafeAreaView, View } from "react-native";
import { LandingPage } from "./components/LandingPage";
import { Home } from "./components/Home"
import { Professor } from "./components/Professor"
import { Course } from "./components/Course"
import { Navigation } from "./components/Navigation"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "./RootStackParams"
import tailwind from "tailwind-rn"

const Stack = createNativeStackNavigator<RootStackParamList>()
LogBox.ignoreAllLogs()
export default function App() {
  return (
      
    <NavigationContainer>
      <Navigation />
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LandingPage} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Professor" component={Professor} />
        <Stack.Screen name="Course" component={Course} />
      </ Stack.Navigator>
    </ NavigationContainer>
  );
}

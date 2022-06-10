import { LogBox } from 'react-native'
import { LandingPage } from './components/Screens/LandingPage'
import { Signup } from './components/Screens/Signup'
import { Home } from './components/Screens/Home'
import { Professor } from './components/Screens/Professor'
import { Course } from './components/Screens/Course'
import { Navigation } from './components/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './RootStackParams'
import { Account } from './components/Screens/Account'
import { Courses } from './components/Screens/Courses'
import React from 'react'

const Stack = createNativeStackNavigator<RootStackParamList>()
LogBox.ignoreAllLogs()

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/*SCREENS*/}
        <Stack.Screen name="Login" component={LandingPage} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Professor" component={Professor} />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Courses" component={Courses} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

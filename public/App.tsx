import { LogBox, Text } from 'react-native'
import { LandingPage } from './components/LandingPage'
import { Signup } from './components/Signup'
import { Home } from './components/Home'
import { Professor } from './components/Professor'
import { Course } from './components/Course'
import { Navigation } from './components/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './RootStackParams'
import { Account } from './components/Account'
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

import { StatusBar, LogBox } from 'react-native'
import { Login } from './components/screens/Login'
import { Signup } from './components/screens/Signup'
import { Home } from './components/screens/Home'
import { Professor } from './components/screens/Professor'
import { Course } from './components/screens/Course'
import { Navigation } from './components/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './RootStackParams'
import { Account } from './components/screens/Account'
import { Courses } from './components/screens/Courses'
import React from 'react'
import NavContext from './utils/NavContext'
import SplashScreen from 'expo-splash-screen'

const Stack = createNativeStackNavigator<RootStackParamList>()
LogBox.ignoreAllLogs()

export default function App() {
  const [currentNav, setCurrentNav] = React.useState('home')
  const navSettings = {
    currentNav: currentNav,
    setCurrentNav: setCurrentNav,
  }

  return (
    <NavContext.Provider value={navSettings}>
      <NavigationContainer>
        <StatusBar
          animated={true}
          barStyle={'light-content'}
          showHideTransition={'fade'}
        />
        <Navigation />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {/*SCREENS*/}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Professor" component={Professor} />
          <Stack.Screen name="Course" component={Course} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Courses" component={Courses} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavContext.Provider>
  )
}

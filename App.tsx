import { StatusBar, LogBox, SafeAreaView } from 'react-native'
import { Login } from './components/screens/Login'
import { Signup } from './components/screens/Signup'
import { Home } from './components/screens/Home'
import { Favorites } from './components/screens/Favorites'
import { Professor } from './components/screens/Professor'
import { Course } from './components/screens/Course'
import { Navigation } from './components/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './RootStackParams'
import { Account } from './components/screens/Account'
import { Courses } from './components/screens/Courses'
import React, { useState } from 'react'
import GlobalContext from './utils/NavContext'

const Stack = createNativeStackNavigator<RootStackParamList>()
LogBox.ignoreAllLogs()

export default function App() {
    const [currentNav, setCurrentNav] = useState('home')

    let navSettings = {
        currentNav: currentNav,
        setCurrentNav: setCurrentNav
    }

    return (
        <SafeAreaView
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'black'
            }}
        >
            <GlobalContext.Provider value={navSettings}>
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
                            animation: 'default'
                        }}
                    >
                        {/*SCREENS*/}
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Favorites"
                            component={Favorites}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={Signup}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen name="Professor" component={Professor} />
                        <Stack.Screen
                            name="Course"
                            component={Course}
                            options={{ animation: 'slide_from_right' }}
                        />
                        <Stack.Screen
                            name="Account"
                            component={Account}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Courses"
                            component={Courses}
                            options={{ animation: 'slide_from_right' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </GlobalContext.Provider>
        </SafeAreaView>
    )
}

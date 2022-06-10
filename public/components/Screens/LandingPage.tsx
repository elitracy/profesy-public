//IMPORTS
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { colors } from '../../assets/colors'
import { sha256 } from 'js-sha256'
import React from 'react'
import { getItem, storeItem } from '../../assets/localStorage'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

// loginAPI - Params(username:string, password:string) => {message:{}, loggedIn:bool}
async function loginAPI(username: string, password: string) {
  return fetch(
    `https://profesy.herokuapp.com/login?username=${username}&password=${password}`
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.error(err)
    })
}

export function LandingPage() {
  // SET STATES
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [badLogin, setBadLogin] = useState(false)
  // const [loggedIn, setLoggedIn] = useState('false')

  const navigation = useNavigation<loginScreenProp>()

  // not logged in
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
      }}
    >
      <View
        style={{
          width: '100%',
          height: '60%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={'light-content'}
          showHideTransition={'none'}
        />

        <View style={{ padding: 15 }}>
          <Text style={styles.titleStyles}>Profesy</Text>
        </View>
        <View style={{ width: '70%' }}>
          <TextInput
            onChangeText={setUsername}
            autoCapitalize="none"
            value={username}
            clearTextOnFocus={true}
            placeholder="Username"
            placeholderTextColor={colors.GREY}
            keyboardAppearance="dark"
            style={[
              styles.inputStyles,
              {
                marginBottom: 10,
                borderColor: 'white',
                backgroundColor: 'white',
              },
            ]}
          />
          <TextInput
            onChangeText={setPassword}
            autoCapitalize="none"
            clearTextOnFocus={true}
            keyboardAppearance="dark"
            style={[
              styles.inputStyles,
              {
                marginBottom: 6,
                borderColor: 'white',
                backgroundColor: 'white',
              },
            ]}
            value={password}
            placeholder="Password"
            placeholderTextColor={colors.GREY}
            secureTextEntry={true}
          />
          <View
            style={{
              flexDirection: 'column',
              height: badLogin ? '16%' : '10%',
            }}
          >
            {badLogin ? (
              <Text style={styles.incorrectLoginStyles}>Incorrect login</Text>
            ) : null}

            {/*NOTE - Implement forgot password functionality*/}
            {/* <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => console.log('USER FORGOT PASSWORD')}
          >
            <Text
              style={[
                styles.forgotPasswordStyles,
                { paddingTop: badLogin ? 4 : 8 },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity> */}

            {/*SIGN UP*/}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupPasswordStyles}>
                {"Don't have an account?"}
              </Text>
            </TouchableOpacity>
          </View>
          {/*LOGIN BUTTON*/}
          <TouchableOpacity
            style={{
              borderColor: colors.GREEN,
              width: '100%',
              borderWidth: 2,
              borderRadius: 20,
              marginTop: 5,
            }}
            onPress={() => {
              loginAPI(username, sha256(password)).then((res) => {
                if (res.loggedIn) {
                  // store user info in cache
                  storeItem('name', res.message.name)
                  storeItem('username', res.message.username)
                  storeItem('email', res.message.email)
                  storeItem('loggedIn', 'true')
                  setBadLogin(false)
                } else setBadLogin(true)
                res.loggedIn ? navigation.navigate('Home') : null
              })
            }}
          >
            <Text style={styles.loginStyles}>Login</Text>
          </TouchableOpacity>

          {/*SKIP LOGIN*/}
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{ width: '100%', marginTop: 5 }}
          >
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 5,
                color: 'white',
                fontSize: 15,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

// STYLES - NOTE: move to inline
const styles = StyleSheet.create({
  titleStyles: {
    color: 'white',
    fontSize: 80,
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 5,
    fontSize: 15,
    color: 'black',
  },
  incorrectLoginStyles: {
    textAlign: 'center',
    padding: 4,
    paddingTop: 4,
    color: 'red',
    fontStyle: 'italic',
  },
  forgotPasswordStyles: {
    textAlign: 'center',
    paddingTop: 8,
  },
  signupPasswordStyles: {
    textAlign: 'center',
    color: 'white',
    paddingTop: 2,
  },
  loginStyles: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    padding: 8,
    paddingBottom: 14,
    fontWeight: '300',
    letterSpacing: 5,
  },
})

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
import { colors } from '../../utils/colors'
import { sha256 } from 'js-sha256'
import React from 'react'
import { getItem, storeItem } from '../../utils/localStorage'
import loginAPI from '../../api/loginAPI'
import NavContext from '../../utils/NavContext'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

export function Login() {
  // SET STATES
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [badLogin, setBadLogin] = useState(false)

  const navigation = useNavigation<loginScreenProp>()
  const { currentNav, setCurrentNav } = React.useContext(NavContext)

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
          height: '75%',
          display: 'flex',
          justifyContent: 'center',
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
          {badLogin && (
            <Text style={styles.incorrectLoginStyles}>Incorrect login</Text>
          )}

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
          {/*LOGIN BUTTON*/}
          <TouchableOpacity
            style={{
              borderColor: colors.GREEN,
              width: '100%',
              borderWidth: 2,
              borderRadius: 20,
              marginTop: 4,
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
                  navigation.navigate('Home')
                  setCurrentNav('home')
                } else setBadLogin(true)
              })
            }}
          >
            <Text style={styles.loginStyles}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupPasswordStyles}>
              {"Don't have an account?"}
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
    color: 'red',
  },
  forgotPasswordStyles: {
    textAlign: 'center',
    paddingTop: 8,
  },
  signupPasswordStyles: {
    textAlign: 'center',
    color: 'white',
    marginTop: 6,
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

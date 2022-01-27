import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tailwind from 'tailwind-rn'
import { useState } from 'react'
import {
  useNavigation,
} from '@react-navigation/native'
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { RootStackParamList } from '../RootStackParams'
import { colors } from '../assets/colors'
import { sha256 } from 'js-sha256'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

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

const storeItem = async (key: string, value: any) => {
  try {
    const val = await AsyncStorage.setItem(key, value)
    return val
  } catch (e: any) {
    console.log('error', e.message)
  }
}

const getItem = async (key: string, setItemState: Function) => {
  try {
    const val = await AsyncStorage.getItem(key)
    setItemState(val)
    return val
  } catch (e: any) {
    console.log('error', e.message)
  }
}

export function LandingPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameBG, setUsernameBG] = useState('rgba(150, 150, 150, .5)')
  const [passwordBG, setPasswordBG] = useState('rgba(150, 150, 150, .5)')
  const [badLogin, setBadLogin] = useState(false)
  const [loggedIn, setLoggedIn] = useState('false')

  const navigation = useNavigation<loginScreenProp>()
  getItem('loggedIn', setLoggedIn)
  if (loggedIn === 'true') {
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView
      style={tailwind('w-full h-full justify-start items-center mt-20')}
    >
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={'dark-content'}
        showHideTransition={'slide'}
      />
      <View style={styles.titleBorderStyles}>
        <Text style={styles.titleStyles}>Profesi</Text>
      </View>
      <View style={{ width: '65%', marginTop: 15 }}>
        <TextInput
          onChangeText={setUsername}
          autoCapitalize="none"
          onFocus={() => setUsernameBG('#10b981')}
          onBlur={() => setUsernameBG('rgba(150, 150, 150, .5)')}
          value={username}
          clearTextOnFocus={true}
          placeholder="Username"
          style={[
            styles.inputStyles,
            {
              marginBottom: 10,
              borderColor: usernameBG,
              color: username === 'username' ? colors.GREY : 'black',
            },
          ]}
        />
        <TextInput
          onChangeText={setPassword}
          autoCapitalize="none"
          clearTextOnFocus={true}
          onFocus={() => setPasswordBG('#10b981')}
          onBlur={() => setPasswordBG('rgba(150, 150, 150, .5)')}
          style={[
            styles.inputStyles,
            {
              marginBottom: 6,
              borderColor: passwordBG,
              color: password === 'password' ? colors.GREY : 'black',
            },
          ]}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
        />
        <View
          style={{ flexDirection: 'column', height: badLogin ? '16%' : '10%' }}
        >
          {badLogin ? (
            <Text style={styles.incorrectLoginStyles}>Incorrect login</Text>
          ) : null}
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

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupPasswordStyles}>
              Don't have an account?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            borderColor: 'black',
            width: '100%',
            borderWidth: 2,
            borderRadius: 20,
          }}
          onPress={() => {
            loginAPI(username, sha256(password)).then((res) => {
              if (res.loggedIn) {
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ width: '100%', marginTop: 5 }}
        >
          <Text
            style={{
              textAlign: 'center',
              paddingVertical: 5,
              color: colors.GRAY,
              fontSize: 15,
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleStyles: {
    color: 'black',
    fontSize: 80,
    shadowColor: colors.PURPLE,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  titleBorderStyles: {
    borderBottomWidth: 2,
    borderBottomColor: colors.GREY,
    marginBottom: '3%',
    paddingRight: '8%',
    paddingLeft: '8%',
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 5,
    fontSize: 15,
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
    padding: 4,
    paddingTop: 8,
  },
  signupPasswordStyles: {
    textAlign: 'center',
    padding: 2,
    color: 'black',
  },
  loginStyles: {
    color: 'black',
    fontSize: 40,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '300',
    letterSpacing: 5,
    shadowColor: colors.GREEN,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
})

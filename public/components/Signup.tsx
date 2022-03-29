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
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../RootStackParams'
import { colors } from '../assets/colors'
import { sha256 } from 'js-sha256'
import React from 'react'

type signupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>

async function signupAPI(
  username: string,
  password: string,
  email: string,
  name: string,
  setUsernameExists: any,
  setEmailExists: any
) {
  return fetch(
    `https://profesy.herokuapp.com/signup?username=${username}&password=${password}&email=${email}&name=${name}`
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      if (data.userInsert === 0) {
        setEmailExists(data.emailExists)
        setUsernameExists(data.usernameExists)
      }
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

export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [usernameBG, setUsernameBG] = useState('rgba(150, 150, 150, .5)')
  const [passwordBG, setPasswordBG] = useState('rgba(150, 150, 150, .5)')
  const [passwordConfBG, setPasswordConfBG] = useState(
    'rgba(150, 150, 150, .5)'
  )
  const [nameBG, setNameBG] = useState('rgba(150, 150, 150, .5)')
  const [emailBG, setEmailBG] = useState('rgba(150, 150, 150, .5)')
  const [usernameExists, setUsernameExists] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailExists, setEmailExists] = useState(false)

  const navigation = useNavigation<signupScreenProp>()
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
            },
          ]}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={setPasswordConf}
          autoCapitalize="none"
          clearTextOnFocus={true}
          onFocus={() => setPasswordConfBG('#10b981')}
          onBlur={() => setPasswordConfBG('rgba(150, 150, 150, .5)')}
          style={[
            styles.inputStyles,
            {
              marginBottom: 6,
              borderColor: passwordConfBG,
            },
          ]}
          value={passwordConf}
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={setEmail}
          autoCapitalize="none"
          clearTextOnFocus={true}
          onFocus={() => setEmailBG('#10b981')}
          onBlur={() => setEmailBG('rgba(150, 150, 150, .5)')}
          style={[
            styles.inputStyles,
            {
              marginBottom: 6,
              borderColor: emailBG,
            },
          ]}
          value={email}
          placeholder="Email"
        />
        <TextInput
          onChangeText={setName}
          autoCapitalize="none"
          clearTextOnFocus={true}
          onFocus={() => setNameBG('#10b981')}
          onBlur={() => setNameBG('rgba(150, 150, 150, .5)')}
          style={[
            styles.inputStyles,
            {
              marginBottom: 6,
              borderColor: nameBG,
            },
          ]}
          value={name}
          placeholder="Name"
        />

        <View style={{ flexDirection: 'column' }}>
          {!passwordMatch ? (
            <Text style={styles.incorrectSignupStyles}>
              Passwords do not match
            </Text>
          ) : null}

          {usernameExists ? (
            <Text style={styles.incorrectSignupStyles}>
              Username already exists
            </Text>
          ) : null}

          {emailExists ? (
            <Text style={styles.incorrectSignupStyles}>
              Email already exists
            </Text>
          ) : null}

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signupPasswordStyles}>Have an account?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            borderColor: 'black',
            width: '100%',
            borderWidth: 2,
            borderRadius: 20,
            marginTop: 5,
          }}
          onPress={() => {
            setPasswordMatch(password === passwordConf)
            if (passwordMatch) {
              signupAPI(
                username,
                sha256(password),
                email,
                name,
                setUsernameExists,
                setEmailExists
              ).then((res) => {
                if (res.userInsert === 1) {
                  storeItem('name', res.name)
                  storeItem('username', res.username)
                  storeItem('email', res.email)
                }
                res.userInsert === 1 ? navigation.navigate('Home') : null
              })
            }
          }}
        >
          <Text style={styles.signupStyles}>Sign Up</Text>
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
    paddingBottom: '-0%',
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 5,
    fontSize: 15,
  },
  incorrectSignupStyles: {
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
  signupStyles: {
    color: 'black',
    fontSize: 40,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '300',
    letterSpacing: 5,
    shadowColor: colors.GREEN,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
})

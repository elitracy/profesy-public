// IMPORTS
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

type signupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>

// signupAPI - Params(username:string,password:string,email:string,name:string,setUsernameExists:function,setEmailExists:function)
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

export function Signup() {
  // SET STATES
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [usernameExists, setUsernameExists] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailExists, setEmailExists] = useState(false)

  const navigation = useNavigation<signupScreenProp>()

  return (
    <SafeAreaView
      // style={tailwind('w-full h-full justify-start items-center mt-20')}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
          barStyle={'dark-content'}
          showHideTransition={'slide'}
        />
        <View style={styles.titleBorderStyles}>
          <Text style={styles.titleStyles}>Profesy</Text>
        </View>

        {/*INPUTS*/}
        <View style={{ width: '70%' }}>
          {/*Username*/}
          <TextInput
            onChangeText={setUsername}
            autoCapitalize="none"
            value={username}
            clearTextOnFocus={true}
            placeholder="Username"
            style={[styles.inputStyles]}
          />
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/*Password*/}
            <TextInput
              onChangeText={setPassword}
              autoCapitalize="none"
              clearTextOnFocus={true}
              style={[styles.inputStyles, { width: '49%' }]}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
            />
            {/*Confirm Password*/}
            <TextInput
              onChangeText={setPasswordConf}
              autoCapitalize="none"
              clearTextOnFocus={true}
              style={[styles.inputStyles, { width: '49%' }]}
              value={passwordConf}
              placeholder="Confirm Password"
              secureTextEntry={true}
            />
          </View>
          {/*Email*/}
          <TextInput
            onChangeText={setEmail}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={email}
            placeholder="Email"
          />
          {/*Name*/}
          <TextInput
            onChangeText={setName}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={name}
            placeholder="Name"
          />

          {/*Error checking for inputs*/}
          <View style={{ flexDirection: 'column' }}>
            {/*passwords don't match*/}
            {!passwordMatch ? (
              <Text style={styles.incorrectSignupStyles}>
                Passwords do not match
              </Text>
            ) : null}

            {/*username already exists*/}
            {usernameExists ? (
              <Text style={styles.incorrectSignupStyles}>
                Username already exists
              </Text>
            ) : null}

            {/*email already exists*/}
            {emailExists ? (
              <Text style={styles.incorrectSignupStyles}>
                Email already exists
              </Text>
            ) : null}

            {/*user has account => go to login screen*/}
          </View>
          {/*Signup Button*/}
          <TouchableOpacity
            style={{
              width: '100%',
              paddingBottom: 4,
              borderWidth: 2,
              borderRadius: 20,
              marginTop: 15,
              borderColor: colors.BLUE,
            }}
            onPress={() => {
              setPasswordMatch(password === passwordConf)
              if (passwordMatch) {
                //check database
                signupAPI(
                  username,
                  sha256(password),
                  email,
                  name,
                  setUsernameExists,
                  setEmailExists
                ).then((res) => {
                  if (res.userInsert === 1) {
                    //store user info in cache
                    storeItem('name', res.name)
                    storeItem('username', res.username)
                    storeItem('email', res.email)
                    storeItem('loggedIn', 'true')
                    //intialize search history
                    storeItem('profHistory', [])
                    storeItem('courseHistory', [])
                  }
                  res.userInsert === 1 ? navigation.navigate('Home') : null
                })
              }
            }}
          >
            <Text style={styles.signupStyles}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signupPasswordStyles}>Have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

// STYLES - NOTE: convert to inline
const styles = StyleSheet.create({
  titleStyles: {
    color: 'white',
    fontSize: 80,
  },
  titleBorderStyles: {
    marginBottom: '3%',
    paddingRight: '8%',
    paddingLeft: '8%',
    paddingBottom: '-0%',
  },
  inputStyles: {
    borderRadius: 5,
    padding: 8,
    paddingLeft: 10,
    fontSize: 15,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  incorrectSignupStyles: {
    textAlign: 'center',
    padding: 4,
    paddingTop: 4,
    color: colors.PURPLE,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  forgotPasswordStyles: {
    textAlign: 'center',
    padding: 4,
    paddingTop: 8,
  },
  signupPasswordStyles: {
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  signupStyles: {
    color: colors.BLUE,
    fontSize: 40,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '300',
    letterSpacing: 5,
  },
})

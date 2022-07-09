// IMPORTS
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { colors } from '../../utils/colors'
import { sha256 } from 'js-sha256'
import React from 'react'
import { storeItem } from '../../utils/localStorage'
import signupAPI from '../../api/signupAPI'
import { Feather } from '@expo/vector-icons'

type signupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>

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
  const [passShort, setPassShort] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfPass, setShowConfPass] = useState(false)

  const navigation = useNavigation<signupScreenProp>()

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '85%',
        display: 'flex',
        justifyContent: 'center',
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
        <View style={styles.titleBorderStyles}>
          <Text style={styles.titleStyles}>Profesy</Text>
        </View>

        {/*INPUTS*/}
        <View
          style={{
            width: '70%',
            display: 'flex',
            height: '70%',
            justifyContent: 'space-around',
          }}
        >
          {/*Name*/}
          <TextInput
            onChangeText={setName}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={name}
            placeholder="Name"
            placeholderTextColor={colors.GREY}
          />
          {/*Username*/}
          <TextInput
            onChangeText={setUsername}
            autoCapitalize="none"
            value={username}
            clearTextOnFocus={true}
            placeholder="Username"
            placeholderTextColor={colors.GREY}
            style={[styles.inputStyles]}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/*Password*/}
            <TextInput
              onChangeText={setPassword}
              autoCapitalize="none"
              clearTextOnFocus={true}
              style={[styles.inputStyles, { flex: 1 }]}
              value={password}
              placeholder="Password"
              placeholderTextColor={colors.GREY}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass(!showPass)}>
              <Feather
                name={showPass ? 'eye' : 'eye-off'}
                color="white"
                size={25}
                style={{ paddingLeft: 9, paddingRight: 4, paddingBottom: 5 }}
              />
            </Pressable>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/*Confirm Password*/}
            <TextInput
              onChangeText={setPasswordConf}
              autoCapitalize="none"
              clearTextOnFocus={true}
              style={[styles.inputStyles, { flex: 1 }]}
              value={passwordConf}
              placeholder="Confirm Password"
              placeholderTextColor={colors.GREY}
              secureTextEntry={!showConfPass}
            />
            <Pressable onPress={() => setShowConfPass(!showConfPass)}>
              <Feather
                name={showConfPass ? 'eye' : 'eye-off'}
                color="white"
                size={25}
                style={{ paddingLeft: 9, paddingRight: 4, paddingBottom: 5 }}
              />
            </Pressable>
          </View>

          {/*Email*/}
          <TextInput
            onChangeText={setEmail}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={email}
            placeholder="Email"
            placeholderTextColor={colors.GREY}
          />

          {/*Error checking for inputs*/}
          <View style={{ flexDirection: 'column' }}>
            {/*passwords don't match*/}
            {!passwordMatch && (
              <Text style={styles.incorrectSignupStyles}>
                Passwords do not match
              </Text>
            )}

            {/*username already exists*/}
            {usernameExists && (
              <Text style={styles.incorrectSignupStyles}>
                Username already exists
              </Text>
            )}

            {/*email already exists*/}
            {emailExists && (
              <Text style={styles.incorrectSignupStyles}>
                Email already exists
              </Text>
            )}
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
                    navigation.navigate('Home')

                    //intialize search history
                    // storeItem('profHistory', "")
                    // storeItem('courseHistory', "")
                  } else {
                    storeItem('loggedIn', 'false')
                  }
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

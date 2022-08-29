// IMPORTS
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView
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
import { Feather, AntDesign } from '@expo/vector-icons'
import NavContext from '../../utils/NavContext'

type signupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>

function validPass(
  validUpper: boolean,
  validLower: boolean,
  validNum: boolean,
  validSpecial: boolean,
  validLen: boolean
) {
  return validUpper && validLower && validNum && validSpecial && validLen
}

export function Signup() {
  // SET STATES
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [usernameExists, setUsernameExists] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfPass, setShowConfPass] = useState(false)
  const [showPassReqs, setShowPassReqs] = useState(false)

  const [validUpper, setValidUpper] = useState(false)
  const [validLower, setValidLower] = useState(false)
  const [validNum, setValidNum] = useState(false)
  const [validSpecial, setValidSpecial] = useState(false)
  const [validLen, setValidLen] = useState(false)

  const navigation = useNavigation<signupScreenProp>()
  const { currentNav, setCurrentNav } = React.useContext(NavContext)

  const upperReg = new RegExp('.*[A-Z].*')
  const lowerReg = new RegExp('.*[a-z].*')
  const numReg = new RegExp('.*[0-9].*')
  const specialReg = new RegExp('.*[!@#$&*()].*')
  const lenReg = new RegExp('.{8,}')

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '95%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black'
      }}
    >
      <ScrollView
        style={{ width: '100%', paddingHorizontal: '13%' }}
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '70%'
        }}
      >
        <Text style={styles.titleStyles}>Create Account</Text>
        {/*INPUTS*/}
        {/*Name*/}
        <View style={{ width: '100%' }}>
          <TextInput
            onChangeText={setName}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={name}
            placeholder="Name"
            placeholderTextColor={'rgba(255,255,255,.8)'}
            keyboardAppearance="dark"
            returnKeyType="done"
          />
        </View>
        {/*Username*/}
        <View style={{ width: '100%' }}>
          <TextInput
            onChangeText={setUsername}
            autoCapitalize="none"
            value={username}
            clearTextOnFocus={true}
            placeholder="Username"
            placeholderTextColor={'rgba(255,255,255,.8)'}
            style={[styles.inputStyles]}
            keyboardAppearance="dark"
            returnKeyType="done"
          />
        </View>
        {/*username already exists*/}
        {usernameExists && (
          <Text style={styles.incorrectSignupStyles}>
            Username already exists
          </Text>
        )}

        {/*Password*/}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <TextInput
            onChangeText={text => {
              setValidUpper(upperReg.test(text))
              setValidLower(lowerReg.test(text))
              setValidNum(numReg.test(text))
              setValidSpecial(specialReg.test(text))
              setValidLen(lenReg.test(text))
              setPasswordMatch(text === passwordConf)
              setPassword(text)
            }}
            onFocus={() => {
              setPassword('')
              setValidUpper(false)
              setValidLower(false)
              setValidNum(false)
              setValidSpecial(false)
              setValidLen(false)
              setPasswordMatch(false)
            }}
            onBlur={() => setShowPassReqs(!showPassReqs)}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[
              styles.inputStyles,
              {
                flex: 1,
                borderWidth: 3,
                borderColor: validPass(
                  validUpper,
                  validLower,
                  validNum,
                  validSpecial,
                  validLen
                )
                  ? colors.GREEN
                  : colors.PURPLE
              }
            ]}
            value={password}
            placeholder="Password"
            placeholderTextColor={'rgba(255,255,255,.8)'}
            secureTextEntry={!showPass}
            keyboardAppearance="dark"
            returnKeyType="done"
          />
          <Pressable onPress={() => setShowPass(!showPass)}>
            <Feather
              name={showPass ? 'eye' : 'eye-off'}
              color="white"
              size={25}
              style={{ paddingLeft: 9, paddingRight: 4 }}
            />
          </Pressable>
          <Pressable onPress={() => setShowPassReqs(!showPassReqs)}>
            <AntDesign
              name="questioncircleo"
              color="white"
              size={25}
              style={{ paddingLeft: 9, paddingRight: 4 }}
            />
          </Pressable>
        </View>

        {/*Checking Password Requirements*/}
        {showPassReqs && (
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {
              <Text
                style={[
                  styles.incorrectSignupStyles,
                  { color: validUpper ? colors.BLUE : colors.PURPLE }
                ]}
              >
                - One uppercase character
              </Text>
            }
            {
              <Text
                style={[
                  styles.incorrectSignupStyles,
                  { color: validLower ? colors.BLUE : colors.PURPLE }
                ]}
              >
                - One lowercase character
              </Text>
            }
            {
              <Text
                style={[
                  styles.incorrectSignupStyles,
                  { color: validNum ? colors.BLUE : colors.PURPLE }
                ]}
              >
                - One number
              </Text>
            }
            {
              <Text
                style={[
                  styles.incorrectSignupStyles,
                  { color: validSpecial ? colors.BLUE : colors.PURPLE }
                ]}
              >
                - One special character (!@#$&*)
              </Text>
            }
            {
              <Text
                style={[
                  styles.incorrectSignupStyles,
                  { color: validLen ? colors.BLUE : colors.PURPLE }
                ]}
              >
                - At least 8 characters long
              </Text>
            }
          </View>
        )}

        {/*Confirm Password*/}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <TextInput
            onChangeText={text => {
              setPasswordMatch(password === text && text.length > 0)
              setPasswordConf(text)
            }}
            onFocus={() => {
              setPasswordConf('')
              setPasswordMatch(false)
            }}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[
              styles.inputStyles,
              {
                flex: 1,
                borderWidth: 3,
                borderColor: passwordMatch ? colors.GREEN : colors.PURPLE
              }
            ]}
            value={passwordConf}
            placeholder="Confirm Password"
            placeholderTextColor={'rgba(255,255,255,.8)'}
            secureTextEntry={!showConfPass}
            keyboardAppearance="dark"
            returnKeyType="done"
          />
          <Pressable onPress={() => setShowConfPass(!showConfPass)}>
            <Feather
              name={showConfPass ? 'eye' : 'eye-off'}
              color="white"
              size={25}
              style={{ paddingLeft: 9, paddingRight: 4 }}
            />
          </Pressable>
        </View>
        {/*passwords don't match*/}
        {!passwordMatch && passwordConf.length > 0 && (
          <Text style={[styles.incorrectSignupStyles, { textAlign: 'left' }]}>
            - Passwords do not match
          </Text>
        )}

        {/*Email*/}
        <View style={{ width: '100%' }}>
          <TextInput
            onChangeText={setEmail}
            autoCapitalize="none"
            clearTextOnFocus={true}
            style={[styles.inputStyles]}
            value={email}
            placeholder="Email"
            placeholderTextColor={'rgba(255,255,255,.8)'}
            keyboardAppearance="dark"
            returnKeyType="done"
          />
        </View>
        {/*email already exists*/}
        {emailExists && (
          <Text style={styles.incorrectSignupStyles}>Email already exists</Text>
        )}

        {/*Signup Button and Final Checks*/}
        <TouchableOpacity
          style={{
            width: '100%',
            paddingBottom: 4,
            borderWidth: 2,
            borderRadius: 15,
            marginTop: 12,
            borderColor: colors.GREEN
          }}
          onPress={() => {
            if (
              validPass(
                validUpper,
                validLower,
                validNum,
                validSpecial,
                validLen
              ) &&
              passwordMatch
            ) {
              //check database
              signupAPI(
                username,
                sha256(password),
                email,
                name,
                setUsernameExists,
                setEmailExists
              ).then(res => {
                if (res.userInsert === 1) {
                  //store user info in cache
                  storeItem('name', res.name)
                  storeItem('username', res.username)
                  storeItem('email', res.email)
                  storeItem('loggedIn', 'true')
                  navigation.navigate('Home')
                  setCurrentNav('home')

                  //intialize search history
                  // storeItem('profHistory', "")
                  // storeItem('courseHistory', "")
                } else {
                  storeItem('loggedIn', 'false')
                }
              })
            } else setShowPassReqs(true)
          }}
        >
          <Text style={styles.signupButtonStyles}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.haveAccount}>Have an account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

// STYLES - NOTE: convert to inline
const styles = StyleSheet.create({
  titleStyles: {
    color: 'white',
    fontSize: 38,
    textAlign: 'center',
    width: '100%',
    fontWeight: '600'
  },
  inputStyles: {
    borderRadius: 8,
    padding: 8,
    paddingLeft: 10,
    fontSize: 15,
    backgroundColor: 'rgba(128,128,128,.4)',
    marginVertical: 6,
    color: 'white'
  },
  incorrectSignupStyles: {
    padding: 4,
    color: colors.PURPLE,
    fontWeight: '600',
    fontSize: 16
  },
  haveAccount: {
    textAlign: 'center',
    margin: 10,
    color: 'white',
    fontSize: 18
  },
  signupButtonStyles: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '600'
  }
})

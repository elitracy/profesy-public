// IMPORTS
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { colors } from '../../assets/colors'
import React from 'react'
import { getItem, storeItem } from '../../assets/localStorage'

// getCode - Params(email:string, setPassCode: function) => Promise
async function getCode(email: string, setPassCode: any): Promise<any> {
  return await fetch(`https://profesy.herokuapp.com/resetPass?email=${email}`)
    .then((result) => result.json())
    .then((result) => {
      setPassCode(result.code)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}

type accountScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Account'
>

export function Account(Props: any) {
  // SET STATES
  const [username, setUsername] = useState('N/A')
  const [email, setEmail] = useState('N/A')
  const [name, setName] = useState('N/A')
  const [loggedIn, setLoggedIn] = useState('false')
  // const [passCode, setPassCode] = useState('')
  const navigation = useNavigation<accountScreenProp>()

  getItem('username', setUsername)
  getItem('email', setEmail)
  getItem('name', setName)
  getItem('loggedIn', setLoggedIn)

  return (
    <SafeAreaView
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black',
        height: '100%',
      }}
    >
      <View
        style={{
          width: '100%',
          height: '50%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 40,
            marginBottom: 8,
          }}
        >
          Account
        </Text>

        {/*user is logged in*/}
        {loggedIn === 'true' && (
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/*NAME/USERNAME*/}
            <View
              style={{
                width: '75%',
                padding: 10,
                alignItems: 'center',
                backgroundColor: colors.GREEN,
                borderRadius: 5,
                shadowColor: colors.GRAY,
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 0,
                shadowOpacity: 0,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  fontWeight: '700',
                }}
              >
                {name}
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    fontWeight: '400',
                    letterSpacing: 1,
                    opacity: 0.7,
                  }}
                >
                  {' '}
                  {username}
                </Text>
              </Text>
            </View>

            {/*EMAIL*/}
            <View
              style={{
                width: '75%',
                padding: 10,
                alignItems: 'center',
                backgroundColor: colors.ORANGE,
                borderRadius: 5,
                shadowColor: colors.GRAY,
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 0,
                shadowOpacity: 0,
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: 'white',
                  fontWeight: '500',
                  letterSpacing: 1,
                }}
              >
                {email}
              </Text>
            </View>

            {/*CHANGE PASS*/}
            {/* <TouchableOpacity
            style={{
              width: '75%',
              padding: 10,
              alignItems: 'center',
              backgroundColor: colors.ORANGE,
              borderRadius: 5,
              shadowColor: colors.GRAY,
              shadowOffset: { width: 2, height: 2 },
              shadowRadius: 0,
              shadowOpacity: 1,
              marginTop: 0,
              marginBottom: 20,
            }}
            onPress={() => {
              getCode(email, setPassCode)
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: 'white',
                fontWeight: '500',
                letterSpacing: 1,
              }}
            >
              Reset Password
            </Text>
          </TouchableOpacity> */}
          </View>
        )}

        {/*user is logged out*/}

        {/*LOGOUT BUTTON*/}
        <TouchableOpacity
          style={{
            width: '75%',
            padding: 10,
            paddingBottom: 12,
            alignItems: 'center',
            borderRadius: 15,
            marginBottom: 20,
            borderColor: 'white',
            borderWidth: 2,
          }}
          onPress={() => {
            storeItem('name', 'N/A')
            storeItem('username', 'N/A')
            storeItem('email', 'N/A')
            storeItem('loggedIn', 'false')
            navigation.navigate('Login')
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: 'white',
              fontWeight: '700',
              letterSpacing: 1,
            }}
          >
            {loggedIn === 'true' ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
        {loggedIn === 'false' && (
          <TouchableOpacity
            style={{
              width: '75%',
              padding: 10,
              paddingBottom: 12,
              alignItems: 'center',
              borderRadius: 15,
              marginBottom: 20,
              borderColor: 'white',
              borderWidth: 2,
            }}
            onPress={() => {
              storeItem('name', 'N/A')
              storeItem('username', 'N/A')
              storeItem('email', 'N/A')
              storeItem('loggedIn', 'false')
              navigation.navigate('Signup')
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: 'white',
                fontWeight: '700',
                letterSpacing: 1,
              }}
            >
              {'Sign Up'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

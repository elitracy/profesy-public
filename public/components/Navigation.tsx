// IMPORTS
import { Image, StyleSheet, Pressable, View } from 'react-native'
import { useState } from 'react'
import { colors } from '../assets/colors'
import accountIcon from '../assets/accountIcon.png'
import searchIcon from '../assets/searchIcon.png'
import { RootStackParamList } from '../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

type navScreenProp = NativeStackNavigationProp<RootStackParamList>

export function Navigation() {
  // SET STATES
  const navigation = useNavigation<navScreenProp>()
  const [navSelected, setNavSelected] = useState('home')

  return (
    <View style={styles.navContainer}>
      {/*HOME BUTTON*/}
      <Pressable
        onPress={() => {
          navigation.navigate('Home')
          setNavSelected('home')
        }}
        style={[
          navSelected === 'home' && styles.pressed,
          {
            backgroundColor: 'white',
            borderRadius: 50,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Image
          source={searchIcon}
          style={{
            width: 34,
            height: 34,
            padding: 6,
            marginBottom: 3,
            transform: [{ rotate: '75deg' }],
          }}
        />
      </Pressable>

      {/*FAVORITES BUTTON*/}
      {/* <Pressable
        onPress={() => {
          console.log('favorites pressed!')
          setNavSelected('favorites')
        }}
        style={[
          navSelected === 'favorites' && styles.pressed,
          {
            backgroundColor: 'white',
            borderRadius: 50,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Image
          source={favoriteIcon}
          style={{ width: 40, height: 40, padding: 5 }}
        />
      </Pressable> */}

      {/*ACCOUNT BUTTON*/}
      <Pressable
        onPress={() => {
          setNavSelected('account')
          navigation.navigate('Account')
        }}
        style={[
          navSelected === 'account' && styles.pressed,
          {
            backgroundColor: 'white',
            borderRadius: 50,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
        ]}
      >
        <Image
          source={accountIcon}
          style={{ width: 45, height: 45, marginBottom: -5 }}
        />
      </Pressable>
    </View>
  )
}

// STYLES - NOTE: convert to inline
const styles = StyleSheet.create({
  navContainer: {
    height: '15%',
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    paddingBottom: 15,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopWidth: 6,
  },
  pressed: {
    borderWidth: 3,
    borderColor: colors.RED,
  },
})

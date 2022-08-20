// IMPORTS
import { Image, StyleSheet, Pressable, View } from 'react-native'
import { colors } from '../utils/colors'
import { RootStackParamList } from '../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import NavContext from '../utils/NavContext'

type navScreenProp = NativeStackNavigationProp<RootStackParamList>

export function Navigation() {
  // SET STATES
  const navigation = useNavigation<navScreenProp>()
  const { currentNav, setCurrentNav } = React.useContext(NavContext)

  return (
    <View style={styles.navContainer}>
      {/*HOME BUTTON*/}
      <Pressable
        onPress={() => {
          navigation.navigate('Home')
          setCurrentNav('home')
        }}
        style={[
          currentNav === 'home' && styles.pressed,
          {
            backgroundColor: 'white',
            borderRadius: 50,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >
        <Image
          source={require('../utils/searchIcon.png')}
          style={{
            width: 34,
            height: 34,
            padding: 6,
            marginBottom: 3,
            transform: [{ rotate: '75deg' }]
          }}
        />
      </Pressable>

      {/*ACCOUNT BUTTON*/}
      <Pressable
        onPress={() => {
          setCurrentNav('account')
          navigation.navigate('Account')
        }}
        style={[
          currentNav === 'account' && styles.pressed,
          {
            backgroundColor: 'white',
            borderRadius: 50,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }
        ]}
      >
        <Image
          source={require('../utils/accountIcon.png')}
          style={{ width: 45, height: 45, marginBottom: -5 }}
        />
      </Pressable>
    </View>
  )
}

// STYLES - NOTE: convert to inline
const styles = StyleSheet.create({
  navContainer: {
    height: '20%',
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  pressed: {
    borderWidth: 2,
    borderColor: colors.RED
  }
})

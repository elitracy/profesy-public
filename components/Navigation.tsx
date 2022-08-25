// IMPORTS
import { StyleSheet, Pressable, View } from 'react-native'
import { RootStackParamList } from '../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import GlobalContext from '../utils/NavContext'
import { MaterialIcons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

type navScreenProp = NativeStackNavigationProp<RootStackParamList>

export function Navigation() {
  // SET STATES
  const navigation = useNavigation<navScreenProp>()
  const {
    currentNav,
    setCurrentNav,
  } = React.useContext(GlobalContext)

  return (
    <View style={styles.navContainer}>
      {/*HOME BUTTON*/}
      <Pressable
        onPress={() => {
          navigation.navigate('Home')
          setCurrentNav('home')
        }}
        style={[
          {
            backgroundColor: currentNav !== 'home' ? 'black' : 'white',
            borderRadius: 50,
            borderWidth: 3,
            borderColor: 'white',
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >
        <Ionicons
          name="search"
          size={24}
          color={`${currentNav !== 'home' ? 'white' : 'black'}`}
        />
      </Pressable>

      {/*FAVORITES BUTTON*/}
      <Pressable
        onPress={() => {
          navigation.navigate('Favorites')
          setCurrentNav('favorites')
        }}
        style={[
          {
            backgroundColor: currentNav !== 'favorites' ? 'black' : 'white',
            borderRadius: 50,
            borderWidth: 3,
            borderColor: 'white',
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >
        <MaterialIcons
          name="favorite-outline"
          size={25}
          color={`${currentNav !== 'favorites' ? 'white' : 'black'}`}
          style={{ marginTop: 4 }}
        />
      </Pressable>

      {/*ACCOUNT BUTTON*/}
      <Pressable
        onPress={() => {
          navigation.navigate('Account')
          setCurrentNav('account')
        }}
        style={[
          {
            backgroundColor: currentNav !== 'account' ? 'black' : 'white',
            borderRadius: 50,
            borderWidth: 3,
            borderColor: 'white',
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >
        <AntDesign
          name="user"
          size={28}
          color={`${currentNav !== 'account' ? 'white' : 'black'}`}
        />
      </Pressable>
    </View>
  )
}

// STYLES - NOTE: convert to inline
const styles = StyleSheet.create({
  navContainer: {
    height: '12%',
    paddingVertical: 10,
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly'
  }
})

//imports
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { colors } from '../assets/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList, Course } from '../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import React from 'react'

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

// getProfessor - Params(name: string, setFilteredData: function) => Promise
async function getProfessor(name: string, setFilteredData: any): Promise<any> {
  return await fetch(`https://profesy.herokuapp.com/professors?name=${name}`)
    .then((result) => result.json())
    .then((result) => {
      setFilteredData(result.professors)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}

// getItem - Params(key: string, setStateItem: function) => string
const getItem = async (key: string, setStateItem: any) => {
  try {
    const val = await AsyncStorage.getItem(key)
    setStateItem(val)
    return val
  } catch (e: any) {
    console.log('error', e.message)
  }
}

export const Home = () => {
  // set states
  const [searchBG, setSearchBG] = useState(colors.PURPLE)
  const [filteredData, setFilteredData] = useState([])
  const [wordEntered, setWordEntered] = useState('')
  const [nameTitle, setNameTitle] = useState('')
  const [loggedIn, setLoggedIn] = useState('false')

  getItem('name', setNameTitle)
  getItem('loggedIn', setLoggedIn)

  const navigation = useNavigation<homeScreenProp>()

  return (
    <SafeAreaView style={styles.container}>
      {/*header titles*/}
      <View style={styles.nav}>
        <Text style={styles.title}>Profesi</Text>
        <Text
          style={[styles.username, { opacity: loggedIn === 'true' ? 1 : 0 }]}
        >
          {nameTitle}
        </Text>
        {/* NOTE: add user images*/}
        {/* 
        <Image
          source={{ uri: 'https://picsum.photos/50/50' }}
          style={[styles.userImage, { opacity: loggedIn === 'true' ? 1 : 0 }]}
        /> */}
      </View>

      {/*search bar*/}
      <View style={{ width: '80%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
          }}
        >
          <Icon
            name="search"
            style={{ opacity: 0.7 }}
            tvParallaxProperties={null}
          />
          <TextInput
            onChangeText={(data) => {
              getProfessor(data, setFilteredData)
              setWordEntered(data === undefined ? '' : data)
            }}
            onFocus={() => setSearchBG(colors.GREEN)}
            onBlur={() => setSearchBG(colors.PURPLE)}
            value={wordEntered}
            //clearTextOnFocus={true}
            placeholder="search for professor"
            //defaultValue="search by professor"
            style={[
              styles.inputStyles,
              { borderColor: searchBG, flex: 5, marginLeft: -30 },
            ]}
          />
        </View>
      </View>

      {/*search results*/}
      {filteredData.length != 0 && (
        <ScrollView
          style={{
            width: '94%',
            height: 'auto',
            flexDirection: 'column',
            // justifyContent: 'center',
            marginTop: 0,
          }}
        >
          {filteredData
            .slice(0, 15)
            .map(
              (value: {
                name: string
                university: string
                overallGPA: string
                courses: Course[]
                department: string
              }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.resultContainer,
                      {
                        shadowColor:
                          parseFloat(value.overallGPA) > 3.6
                            ? colors.BLUE
                            : parseFloat(value.overallGPA) > 3.0
                            ? colors.GREEN
                            : parseFloat(value.overallGPA) > 2.4
                            ? colors.ORANGE
                            : colors.RED,
                      },
                    ]}
                    onPress={() =>
                      navigation.navigate('Professor', {
                        profName: value.name,
                        courses: value.courses,
                      })
                    }
                    key={undefined}
                  >
                    <Text
                      style={{
                        padding: 5,
                        color: 'white',
                        fontSize: 25,
                        textAlign: 'center',
                        fontWeight: '500',
                      }}
                    >
                      {value.name}{' '}
                      <Text
                        style={{
                          textAlign: 'right',
                          fontWeight: '800',
                          fontSize: 25,
                          color:
                            parseFloat(value.overallGPA) > 3.6
                              ? colors.BLUE
                              : parseFloat(value.overallGPA) > 3.0
                              ? colors.GREEN
                              : parseFloat(value.overallGPA) > 2.4
                              ? colors.ORANGE
                              : colors.RED,
                        }}
                      >
                        {parseFloat(value.overallGPA).toFixed(2)}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        marginTop: -6,
                        paddingBottom: 3,
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 18,
                        opacity: 0.85,
                      }}
                    >
                      {value.university}{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {value.department}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )
              }
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

//Styles - NOTE(Need to be converted into inline)
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 35,
    textAlign: 'left',
    flex: 3,
    fontWeight: '700',
  },
  nav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginTop: 8,
    marginBottom: 15,
  },
  username: {
    flex: 3,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 25,
    shadowColor: colors.BLUE,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 0,
    shadowOpacity: 0.7,
  },
  userImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 30,
    fontSize: 15,
  },
  resultContainer: {
    borderRadius: 25,
    backgroundColor: colors.GRAY,
    width: '90%',
    height: 'auto',
    flexDirection: 'column',
    padding: 5,
    margin: 10,
    //shadowColor: colors.PURPLE,
    shadowOffset: { width: 4, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
})

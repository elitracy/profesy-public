//IMPORTS
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { colors } from '../assets/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList, Course } from '../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import React from 'react'
import { getItem } from '../assets/localStorage'

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

async function getCourses(course: string, setFilteredData: any): Promise<any> {
  // return await fetch(`https://profesy.herokuapp.com/?name=${name}`)
  return await fetch(
    `https://profesy.herokuapp.com/courses?course=${course.replace(/\s+/g, '')}`
  )
    .then((result) => result.json())
    .then((result) => {
      setFilteredData(result.message)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}

export const Home = () => {
  // set states
  const [searchBG, setSearchBG] = useState('black')
  const [filteredProfData, setFilteredProfData] = useState([])
  const [filteredCourseData, setFilteredCourseData] = useState([])
  const [wordEntered, setWordEntered] = useState('')
  const [nameTitle, setNameTitle] = useState('')
  const [loggedIn, setLoggedIn] = useState('false')
  const [filterType, setFilterType] = useState('p')

  getItem('name', setNameTitle)
  getItem('loggedIn', setLoggedIn)

  const navigation = useNavigation<homeScreenProp>()

  return (
    <SafeAreaView style={styles.container}>
      {/*header titles*/}
      <View style={styles.nav}>
        <Text style={styles.title}>Profesy</Text>
        <Text
          style={[styles.username, { opacity: loggedIn === 'true' ? 1 : 0 }]}
        >
          {nameTitle}
        </Text>
      </View>

      {/*search bar*/}
      <View
        style={{
          width: '95%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            width: '100%',
          }}
        >
          <Icon
            name="search"
            style={{ opacity: 0.7, marginLeft: 5 }}
            tvParallaxProperties={null}
          />
          <TextInput
            // queries both at first time for better UX
            onChangeText={(data) => {
              setWordEntered(data === undefined ? '' : data)
              getProfessor(data, setFilteredProfData)
              getCourses(data, setFilteredCourseData)
            }}
            value={wordEntered}
            placeholder={
              filterType === 'c' ? 'search by course' : 'search by professor'
            }
            placeholderTextColor={colors.GREY}
            keyboardAppearance="dark"
            style={[
              styles.inputStyles,
              { borderColor: searchBG, width: '100%', marginLeft: -30 },
            ]}
          />
        </View>

        {/*filter buttons*/}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 5,
          }}
        >
          <Pressable
            style={{
              backgroundColor: filterType === 'p' ? colors.GREY : 'black',
              width: '49%',
              borderColor: colors.GREY,
              borderWidth: 2,
              borderRadius: 5,
            }}
            onPress={() => {
              setFilterType('p')
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '800',
                textAlign: 'center',
                padding: 5,
                paddingVertical: 7,
              }}
            >
              Professor
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: filterType === 'c' ? colors.GREY : null,
              width: '49%',
              borderColor: colors.GREY,
              borderColor: colors.GREY,
              borderWidth: 2,
              borderRadius: 5,
            }}
            onPress={() => {
              setFilterType('c')
            }}
          >
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                padding: 5,
                paddingVertical: 7,
                fontWeight: '800',
              }}
            >
              Course
            </Text>
          </Pressable>
        </View>
      </View>

      {/*search results*/}
      {filteredProfData.length !== 0 ||
      filteredCourseData.length !== 0 ||
      wordEntered.length === 0 ? (
        <ScrollView
          style={{
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
          }}
        >
          {/**Professor Result Container**/}
          {filterType === 'p' &&
            filteredProfData
              .slice(0, 10)
              .sort((a: any, b: any) => {
                return b.overallGPA - a.overallGPA
              })
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
                        styles.profResultContainer,
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
                          paddingLeft: 15,
                          color: 'white',
                          fontSize: 25,
                          textAlign: 'left',
                          fontWeight: '500',
                        }}
                      >
                        {value.name}{' '}
                      </Text>
                      <Text
                        style={{
                          paddingRight: 15,
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
                      {/*<Text
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
                      </Text>*/}
                    </TouchableOpacity>
                  )
                }
              )}

          {/**Courses Result Container**/}
          {filterType === 'c' &&
            filteredCourseData
              .sort()
              .slice(0, 10)
              .map((value: string) => {
                return (
                  <TouchableOpacity
                    style={[styles.courseResultContainer]}
                    onPress={() =>
                      navigation.navigate('Courses', {
                        courseName: value,
                      })
                    }
                    key={undefined}
                  >
                    <Text
                      style={{
                        padding: 5,
                        paddingLeft: 15,
                        color: 'white',
                        fontSize: 25,
                        textAlign: 'left',
                        fontWeight: '500',
                      }}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                )
              })}
        </ScrollView>
      ) : (
        <View
          style={{
            width: '100%',
            height: '5%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 15 }}>Loading ...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

//Styles - NOTE(Need to be converted into inline)
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    height: '88%',
    backgroundColor: 'black',
    width: '100%',
  },
  title: {
    fontSize: 35,
    textAlign: 'left',
    flex: 3,
    fontWeight: '700',
    color: 'white',
    width: '100%',
  },
  nav: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 8,
    marginTop: 8,
    color: 'white',
  },
  username: {
    flex: 3,
    textAlign: 'right',
    paddingRight: 0,
    fontSize: 25,
    color: 'white',
  },
  inputStyles: {
    borderWidth: 2,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    padding: 10,
    paddingLeft: 30,
    fontSize: 15,
  },
  profResultContainer: {
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    padding: 5,
    paddingVertical: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseResultContainer: {
    borderRadius: 15,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'column',
    padding: 5,
    marginVertical: 6,
    shadowOffset: { width: 4, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
})

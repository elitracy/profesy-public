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
  Image,
} from 'react-native'
import { colors } from '../assets/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList, Course } from '../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon as RNIcon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import React from 'react'
import { getItem, storeItem } from '../assets/localStorage'
import Icon from 'react-native-vector-icons/Ionicons'

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
  const [filteredProfData, setFilteredProfData] = useState([])
  const [filteredCourseData, setFilteredCourseData] = useState([])
  const [wordEntered, setWordEntered] = useState('')
  const [nameTitle, setNameTitle] = useState('')
  const [loggedIn, setLoggedIn] = useState('false')
  const [filterType, setFilterType] = useState('p')
  const [profHistory, setProfHistory] = useState([])
  const [courseHistory, setCourseHistory] = useState([])

  useEffect(() => {
    getItem('name', setNameTitle)
    getItem('loggedIn', setLoggedIn)
    // !getItem('profHistory', setProfHistory) && setProfHistory([])
    // getItem('courseHistory', setCourseHistory)
  }, [])

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
          <RNIcon
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
            style={[styles.inputStyles, { width: '100%', marginLeft: -30 }]}
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
      {wordEntered.replace(/\s+/g, '').length > 0 ? (
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
                      onPress={() => {
                        navigation.navigate('Professor', {
                          profName: value.name,
                          courses: value.courses,
                        })
                        !profHistory
                          ? setProfHistory([value])
                          : profHistory.push(value)
                      }}
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
                    </TouchableOpacity>
                  )
                }
              )}

          {/**Courses Result Container**/}
          {filterType === 'c' &&
            filteredCourseData
              .sort()
              .slice(0, 10)
              .map((value: never) => {
                return (
                  <TouchableOpacity
                    style={[styles.courseResultContainer]}
                    onPress={() => {
                      navigation.navigate('Courses', {
                        courseName: value,
                      })
                      courseHistory.push(value)
                    }}
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
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {filterType === 'p'
            ? profHistory &&
              profHistory.length > 0 &&
              profHistory.slice(0, 10).map((prof) => {
                return (
                  <View
                    key={undefined}
                    style={{
                      width: '92%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: 8,
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        navigation.navigate('Professor', {
                          profName: prof.name,
                          courses: prof.courses,
                        })
                      }
                      style={{ width: '100%' }}
                    >
                      <Text
                        key={undefined}
                        style={{
                          color: 'rgba(255,255,255,.8)',
                          width: '100%',
                          fontSize: 28,
                        }}
                      >
                        {prof.name}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        setProfHistory(
                          profHistory.filter((elem) => {
                            return elem.name !== prof.name
                          })
                        )
                      }
                    >
                      <Icon
                        name="close"
                        size={20}
                        style={{
                          color: 'rgba(255,255,255,.8)',
                        }}
                      />
                    </Pressable>
                  </View>
                )
              })
            : courseHistory &&
              courseHistory.length > 0 &&
              courseHistory.slice(0, 10).map((course) => {
                return (
                  <View
                    key={undefined}
                    style={{
                      width: '92%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: 8,
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        navigation.navigate('Courses', {
                          courseName: course,
                        })
                      }
                      style={{ width: '100%' }}
                    >
                      <Text
                        key={undefined}
                        style={{
                          color: 'rgba(255,255,255,.8)',
                          width: '100%',
                          fontSize: 28,
                        }}
                      >
                        {course}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        setCourseHistory(
                          courseHistory.filter((elem) => {
                            return elem !== course
                          })
                        )
                      }
                    >
                      <Icon
                        name="close"
                        size={20}
                        style={{
                          color: 'rgba(255,255,255,.8)',
                        }}
                      />
                    </Pressable>
                  </View>
                )
              })}
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

//IMPORTS
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { colors, gpaColorizer } from '../../assets/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList, Course } from '../../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon as RNIcon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import React from 'react'
import { getItem, storeItem } from '../../assets/localStorage'
import { SearchFilter } from '../SearchFilter'
import { HistoryResult } from '../HistoryResult'
import { styles } from '../../styles/homeStyles'
import { removeWS } from '../../assets/stringHelpers'

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

// getProfessor - Params(name: string, setFilteredData: function) => Promise
async function getProfessor(name: string, setFilteredData: any): Promise<any> {
  return await fetch(
    `https://profesy.herokuapp.com/professors?name=${name.toUpperCase()}`
  )
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
    `https://profesy.herokuapp.com/courses?course=${removeWS(course)}`
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
  }, [])

  const navigation = useNavigation<homeScreenProp>()

  return (
    <SafeAreaView style={styles.container}>
      {/*header titles*/}
      <View style={styles.header}>
        <Text style={styles.title}>Profesy</Text>
        <Text
          style={[styles.username, { opacity: loggedIn === 'true' ? 1 : 0 }]}
        >
          {nameTitle}
        </Text>
      </View>

      {/*search bar*/}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
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
        <View style={styles.filtersContainer}>
          <SearchFilter
            filterType={filterType}
            setFilterType={setFilterType}
            filterValue={'p'}
            filterTitle={'Professor'}
          />
          <SearchFilter
            filterType={filterType}
            setFilterType={setFilterType}
            filterValue={'c'}
            filterTitle={'Course'}
          />
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
              // .sort((a: any, b: any) => {
              //   const parsedWord = wordEntered.toUpperCase()
              //   if (a.name === parsedWord) return a
              //   if (b.name === parsedWord) return b
              //   return parsedWord - a.name < parsedWord - b.name
              // })
              .slice(0, 20)
              .map(
                (value: {
                  name: string
                  overallGPA: string
                  courses: Course[]
                }) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.profResultContainer,
                        {
                          shadowColor: gpaColorizer(value.overallGPA),
                        },
                      ]}
                      onPress={() => {
                        navigation.navigate('Professor', {
                          profName: value.name,
                          courses: value.courses,
                        })
                        !profHistory
                          ? setProfHistory([value])
                          : profHistory.unshift(value)
                      }}
                      key={undefined}
                    >
                      <Text style={styles.profResultTextName}>
                        {value.name}{' '}
                      </Text>
                      <Text
                        style={[
                          styles.profResultTextGPA,
                          { color: gpaColorizer(value.overallGPA) },
                        ]}
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
              .sort((a: string, b: string) => {
                const parsedWord = removeWS(wordEntered).toUpperCase()

                if (a === parsedWord) return a
                if (b === parsedWord) return b
                return a - parsedWord > b - parsedWord
              })
              .slice(0, 20)
              .map((value: never) => {
                return (
                  <TouchableOpacity
                    style={styles.courseResultContainer}
                    onPress={() => {
                      navigation.navigate('Courses', {
                        courseName: value,
                      })
                      courseHistory.unshift(value)
                    }}
                    key={undefined}
                  >
                    <Text style={styles.courseResultText}>{value}</Text>
                  </TouchableOpacity>
                )
              })}
        </ScrollView>
      ) : (
        /*Search History*/
        <ScrollView style={styles.searchHistoryContainer}>
          {!wordEntered &&
            (filterType === 'p'
              ? profHistory &&
                profHistory.map((prof) => {
                  return (
                    <HistoryResult
                      navigation={navigation}
                      nextScreen={'Professor'}
                      nextScreenParams={{
                        profName: prof['name'],
                        courses: prof['courses'],
                      }}
                      displayText={prof['name']}
                      filterItem={prof}
                      history={profHistory}
                      setHistory={setProfHistory}
                      key={undefined}
                    />
                  )
                })
              : courseHistory &&
                courseHistory.map((course) => {
                  return (
                    <HistoryResult
                      navigation={navigation}
                      nextScreen={'Courses'}
                      nextScreenParams={{ courseName: course }}
                      displayText={course}
                      filterItem={course}
                      history={courseHistory}
                      setHistory={setCourseHistory}
                      key={undefined}
                    />
                  )
                }))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

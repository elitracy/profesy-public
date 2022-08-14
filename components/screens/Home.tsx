//IMPORTS
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from 'react-native'
import { colors, gpaColorizer } from '../../utils/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native'
import { RootStackParamList, Course } from '../../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useState, useEffect } from 'react'
import React from 'react'
import { getItem } from '../../utils/localStorage'
import { SearchFilter } from '../SearchFilter'
import { HistoryResult } from '../HistoryResult'
import { styles } from '../../styles/homeStyles'
import getProfessor from '../../api/getProfessor'
import getCourses from '../../api/getCourses'

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

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
  const [loading, setLoading] = useState(false)
  const [activeSearch, setActiveSearch] = useState(false)

  const isFocused = useIsFocused()
  useEffect(() => {
    getItem('name', setNameTitle)
    getItem('loggedIn', setLoggedIn)
  }, [isFocused])

  const navigation = useNavigation<homeScreenProp>()

  return (
    <SafeAreaView style={styles.container}>
      {/*header titles*/}
      <View style={styles.header}>
        <Text style={styles.title}>Profesy</Text>
        <Pressable onPress={() => navigation.navigate('Account')}>
          {loggedIn === 'true' ? (
            <Text style={styles.username}>{nameTitle}</Text>
          ) : (
            <MaterialCommunityIcons name="account" color="white" size={40} />
          )}
        </Pressable>
      </View>

      {/*search bar*/}
      <View style={styles.searchContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={[
              styles.searchBarContainer,
              {
                width: wordEntered.length > 0 || activeSearch ? '80%' : '100%',
              },
            ]}
          >
            <Ionicons
              name="search"
              style={{ opacity: 0.3, marginLeft: 8, marginRight: 4 }}
              size={20}
              color={'white'}
            />
            <TextInput
              // queries both at first time for better UX
              onChangeText={(data) => {
                setLoading(true)
                setWordEntered(data === undefined ? '' : data)
                filterType === 'p'
                  ? getProfessor(data, setFilteredProfData).then(() =>
                      setLoading(false)
                    )
                  : getCourses(data, setFilteredCourseData).then(() =>
                      setLoading(false)
                    )
              }}
              value={wordEntered}
              placeholder={
                filterType === 'c'
                  ? 'search courses'
                  : 'search professors by last name'
              }
              placeholderTextColor={colors.GREY}
              keyboardAppearance="dark"
              style={[styles.inputStyles, { width: '100%', marginLeft: -30 }]}
              onFocus={() => setActiveSearch(true)}
              onBlur={() => setActiveSearch(false)}
            />
          </View>
          {(wordEntered.length > 0 || activeSearch) && (
            <Pressable
              style={{ width: '20%' }}
              onPress={() => {
                setActiveSearch(false)
                Keyboard.dismiss()
                setWordEntered('')
              }}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                  paddingHorizontal: 5,
                  fontWeight: '600',
                }}
              >
                Cancel
              </Text>
            </Pressable>
          )}
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
          showsVerticalScrollIndicator={false}
          onScroll={() => Keyboard.dismiss()}
        >
          {/**Professor Result Container**/}
          {filterType === 'p' &&
            filteredProfData
              .slice(0, 20)
              .map(
                (value: {
                  name: string
                  overallGPA: string
                  courses: Course[]
                }) => {
                  return (
                    <TouchableOpacity
                      key={value.name}
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
                    >
                      <Text style={styles.profResultTextName} key={value.name}>
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
            filteredCourseData.slice(0, 20).map((value: never) => {
              return (
                <TouchableOpacity
                  style={styles.courseResultContainer}
                  onPress={() => {
                    navigation.navigate('Courses', {
                      courseName: value,
                    })
                    courseHistory.unshift(value)
                  }}
                  key={value}
                >
                  <Text style={styles.courseResultText}>{value}</Text>
                </TouchableOpacity>
              )
            })}
          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
        </ScrollView>
      ) : (
        /*Search History*/
        <ScrollView
          style={styles.searchHistoryContainer}
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          {!wordEntered &&
            (filterType === 'p'
              ? profHistory &&
                profHistory
                  .filter(
                    (prof, index) =>
                      profHistory.findIndex((p) => p.name === prof.name) ===
                      index
                  )
                  .map((prof, index) => {
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
                        key={index}
                      />
                    )
                  })
              : courseHistory &&
                courseHistory
                  .filter(
                    (course, index) => courseHistory.indexOf(course) === index
                  )
                  .map((course, index) => {
                    console.log(course + ' ' + index)
                    return (
                      <HistoryResult
                        navigation={navigation}
                        nextScreen={'Courses'}
                        nextScreenParams={{ courseName: course }}
                        displayText={course}
                        filterItem={course}
                        history={courseHistory}
                        setHistory={setCourseHistory}
                        key={index}
                      />
                    )
                  }))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

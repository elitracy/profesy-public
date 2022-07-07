//IMPORTS
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
import { getItem, storeItem } from '../../utils/localStorage'
import { SearchFilter } from '../SearchFilter'
import { HistoryResult } from '../HistoryResult'
import { styles } from '../../styles/homeStyles'
import getProfessor from '../../api/getProfessor'
import getCourses from '../../api/getCourses'
import debounce from 'lodash.debounce'

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

export const Home = (Props: Props) => {
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
        {loggedIn === 'true' ? (
          <Text style={styles.username}>{nameTitle}</Text>
        ) : (
          <MaterialCommunityIcons name="account" color="white" size={40} />
        )}
      </View>

      {/*search bar*/}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            style={{ opacity: 0.7, marginLeft: 3, marginRight: 3 }}
            size={20}
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
                  key={undefined}
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
                profHistory.map((prof, index) => {
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
                courseHistory.map((course, index) => {
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

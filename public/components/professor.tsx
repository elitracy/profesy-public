import {
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native'
import { colors, randomColor } from '../assets/colors'
import { RootStackParamList, Course } from '../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Icon } from 'react-native-elements'
import fuzzysort from 'fuzzysort'
import React from 'react'

interface Props {
  route: { params: { profName: string; courses: Course[] } }
}

type professorScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Professor'
>

const seasons: {
  [SPRING: string]: number
  SUMMER: number
  FALL: number
  WINTER: number
} = {
  SPRING: 3,
  SUMMER: 2,
  FALL: 1,
  WINTER: 0,
}

export function Professor(Props: Props) {
  const allCourses = Array.from([
    ...new Set(
      Props.route.params.courses.map((obj) => {
        return obj.course
      })
    ),
  ]).sort()

  const [wordEntered, setWordEntered] = useState('')
  const [searchBG, setSearchBG] = useState(colors.PURPLE)
  const navigation = useNavigation<professorScreenProp>()

  const [courses, setCourses] = useState(allCourses)

  function handleSearch(search: string, courses: string[], setCourses: any) {
    setCourses(
      search.length === 0
        ? allCourses
        : fuzzysort.go(search, courses).map((item) => {
            return item.target
          })
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[styles.title, { paddingHorizontal: 10 }]}>
          {Props.route.params.profName}
        </Text>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: colors.GRAY,
            opacity: 0.7,
            paddingVertical: 6,
          }}
        >
          <Text style={styles.departmentTitle}>Courses</Text>
        </View>
        <View style={{ width: '90%', marginLeft: 15, marginTop: 5 }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              paddingBottom: 10,
            }}
          >
            <Icon
              name="search"
              style={{ opacity: 0.7 }}
              tvParallaxProperties={null}
            />
            <TextInput
              onChangeText={(word) => {
                setWordEntered(word)
                handleSearch(word, courses, setCourses)
              }}
              onFocus={() => setSearchBG(colors.GREEN)}
              onBlur={() => setSearchBG(colors.PURPLE)}
              value={wordEntered}
              clearTextOnFocus={true}
              placeholder="search for course"
              style={[
                styles.inputStyles,
                { borderColor: searchBG, flex: 5, marginLeft: -30 },
              ]}
            />
          </View>
        </View>
        <ScrollView style={styles.departments}>
          {courses.map((course) => {
            return (
              <TouchableOpacity
                style={[
                  styles.departmentContainer,
                  { shadowColor: randomColor() },
                ]}
                onPress={() => {
                  navigation.navigate('Course', {
                    courses: Props.route.params.courses
                      .filter((c) => {
                        return c.course.includes(course)
                      })
                      .sort((a, b) => {
                        const aY = parseInt(
                          a.semester.substring(
                            a.semester.length - 4,
                            a.semester.length
                          )
                        )
                        const bY = parseInt(
                          b.semester.substring(
                            b.semester.length - 4,
                            b.semester.length
                          )
                        )
                        const aS = a.semester.substring(
                          0,
                          a.semester.length - 5
                        )
                        const bS = b.semester.substring(
                          0,
                          b.semester.length - 5
                        )
                        return aY !== bY ? aY - bY : seasons[bS] - seasons[aS]
                      }),
                    profName: Props.route.params.profName,
                    courseName: course,
                    allCourses: Props.route.params.courses,
                  })
                }}
                key={undefined}
              >
                <Text style={styles.department}>
                  {course.substring(0, 4)}
                  <Text
                    style={{
                      color: 'white',
                      opacity: 0.8,
                      fontWeight: '300',
                      /*(parseFloat(value.overallGPA) > 3.4) ? colors.BLUE
                : (parseFloat(value.overallGPA) > 2.8) ? colors.GREEN 
                : (parseFloat(value.overallGPA)> 2.0) ? colors.ORANGE 
                : colors.RED*/
                    }}
                  >
                    {course.substring(4, course.length)}
                  </Text>
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    height: '88%',
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    marginTop: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  departmentTitle: {
    fontSize: 30,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  departmentContainer: {
    backgroundColor: colors.GREEN,
    borderRadius: 30,
    marginHorizontal: 30,
    marginVertical: 10,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  department: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    letterSpacing: 5,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  departments: {
    // flex: 6,
    // justifyContent: 'flex-start',
    // paddingBottom: 100,
    // height: '80%',
  },
  inputStyles: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 30,
    fontSize: 15,
  },
})

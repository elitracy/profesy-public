// IMPORTS
import {
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native'
import { randomColor } from '../../utils/colors'
import { RootStackParamList, Course } from '../../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import fuzzysort from 'fuzzysort'
import React from 'react'
import styles from '../../styles/professorStyles'

interface Props {
  route: { params: { profName: string; courses: Course[] } }
}

type professorScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Professor'
>

export function Professor(Props: Props) {
  // sort all of professor courses
  const allCourses = Array.from([
    ...new Set(
      Props.route.params.courses.map((obj) => {
        return obj.course
      })
    ),
  ]).sort()

  // SET STATES
  const [wordEntered, setWordEntered] = useState('')
  const [courses, setCourses] = useState(allCourses)

  const navigation = useNavigation<professorScreenProp>()

  // FZF String match
  // handleSearch - Params(search:string, course:string[], setCourses:function)
  function handleSearch(search: string, courses: string[], setCourses: any) {
    search = search.replace(/\s+/g, '')
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
        {/*HEADERS*/}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '90%',
            marginBottom: 5,
          }}
        >
          <Text style={[styles.title, { width: '100%' }]}>
            {Props.route.params.profName}{' '}
            <Text
              style={{
                color: 'white',
                fontSize: 25,
                fontWeight: '300',
                textAlign: 'right',
              }}
            >
              Courses
            </Text>
          </Text>
        </View>

        {/*SEARCH*/}
        <View style={{ width: '95%', marginBottom: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <TextInput
              onChangeText={(word) => {
                setWordEntered(word)
                handleSearch(word, courses, setCourses)
              }}
              value={wordEntered}
              clearTextOnFocus={true}
              placeholder="search for course"
              style={[styles.inputStyles]}
            />
          </View>
        </View>

        {/*COURSE LIST*/}
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
                    course: course,
                    prof: Props.route.params.profName,
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

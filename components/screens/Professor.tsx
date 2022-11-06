// IMPORTS
import {
    TouchableOpacity,
    TextInput,
    View,
    ScrollView,
    SafeAreaView,
    Text
} from 'react-native'
import { randomColor } from '../../utils/colors'
import { RootStackParamList, Course } from '../../RootStackParams'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import fuzzysort from 'fuzzysort'
import React, { useEffect } from 'react'
import styles from '../../styles/professorStyles'
import getProfessor from '../../api/getProfessor'

interface Props {
    route: {
        params: {
            profName: string
            courses: Course[]
            courseAvgs: { course: string; courseAverage: string }[]
        }
    }
}

type professorScreenProp = NativeStackNavigationProp<
RootStackParamList,
'Professor'
>

export function Professor(Props: Props) {
    const { profName, courseAvgs} = Props.route.params
    // sort all of professor courses
    const allCourses = Array.from([
        ...new Set(
            Props.route.params.courses.map(obj => {
                return obj.course
            })
        )
    ]).sort()

    // SET STATES
    const [wordEntered, setWordEntered] = useState('')
    const [courses, setCourses] = useState(allCourses)
    const [profData, setProfData] = useState<any>()
    const [courseAverages, setCourseAverages] = useState<{ course: string; courseAverage: string }[]>([])

    const navigation = useNavigation<professorScreenProp>()

    // FZF String match
    // handleSearch - Params(search:string, course:string[], setCourses:function)
    function handleSearch(search: string, courses: string[], setCourses: any) {
        search = search.replace(/\s+/g, '')
        setCourses(
            search.length === 0
                ? allCourses
                : fuzzysort.go(search, courses).map(item => {
                    return item.target
                })
        )
    }

    useEffect(() => {
        if(!courseAvgs){
            getProfessor(profName, setProfData).then((data) => {
                setCourseAverages(data.professors[0].courseAverages)
            })
        }else setCourseAverages(courseAvgs)
    },[])

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
                        marginBottom: 5
                    }}
                >
                    <Text style={[styles.title, { width: '100%' }]}>
                        {profName}{' '}
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 25,
                                fontWeight: '300',
                                textAlign: 'right'
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
                            alignItems: 'center'
                        }}
                    >
                        <TextInput
                            onChangeText={word => {
                                setWordEntered(word)
                                handleSearch(word, courses, setCourses)
                            }}
                            value={wordEntered}
                            clearTextOnFocus={true}
                            placeholder="search for course"
                            placeholderTextColor={'rgba(255,255,255,.6)'}
                            style={[styles.inputStyles]}
                            />
                    </View>
                </View>

                {/*COURSE LIST*/}
                <ScrollView style={styles.departments} scrollEventThrottle={1}>
                    {courses.map(course => {
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.departmentContainer,
                                    { shadowColor: randomColor() }
                                ]}
                                onPress={() => {
                                    navigation.navigate('Course', {
                                        course: course,
                                        prof: profName,
                                        courseAverage: courseAverages.find(c => c.course === course)
                                        .courseAverage
                                    })
                                }}
                                key={course}
                            >
                                <Text style={styles.department}>
                                    {course.substring(0, 4)}
                                    <Text
                                        style={{
                                            color: 'white',
                                            opacity: 0.8,
                                            fontWeight: '300'
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

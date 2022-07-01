//IMPORTS
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native'
import { colors } from '../../utils/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { useEffect, useState } from 'react'
import React from 'react'
import getProfsByCourse from '../../api/getProfsByCourse'

type coursesScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Courses'
>

interface Props {
  route: {
    params: {
      courseName: string
    }
  }
}

// FZF STRING MATCH
// handleSearch - Params(text:string)
const handleSearch = (
  text: string,
  profList: string[],
  setProfList: any,
  originalProfList: string[]
) => {
  const searchWord = text
  setProfList(searchWord)

  const newFilter: [{ name: string; courseAverage: string }] = profList.filter(
    (value: { name: string; courseAverage: string }) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase())
    }
  )
  if (searchWord === undefined) {
    setProfList(originalProfList)
  } else {
    setProfList(newFilter)
  }
}

export const Courses = (Props: Props) => {
  const [profList, setProfList] = useState([])
  const [originalProfList, setOriginalProfList] = useState([])
  const [wordEntered, setWordEntered] = useState('')

  const navigation = useNavigation<coursesScreenProp>()

  useEffect(
    (): any =>
      getProfsByCourse(
        Props.route.params.courseName,
        setProfList,
        setOriginalProfList
      ),
    [Props.route.params.courseName]
  )

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'black',
        height: '85%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: '90%',
          marginBottom: 5,
          paddingLeft: 15,
        }}
      >
        <Text
          style={{
            textAlign: 'left',
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold',
          }}
        >
          {Props.route.params.courseName}
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
        key={undefined}
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
              data.length === 0
                ? setProfList(originalProfList)
                : handleSearch(data, profList, setProfList, originalProfList)

              setWordEntered(data === undefined ? '' : data)
            }}
            value={wordEntered}
            placeholder="search"
            keyboardAppearance="dark"
            style={{
              borderWidth: 2,
              borderRightWidth: 0,
              borderLeftWidth: 0,
              padding: 10,
              paddingLeft: 30,
              fontSize: 15,
              width: '100%',
              marginLeft: -30,
            }}
          />
        </View>
        <ScrollView style={{ width: '100%', height: '90%' }}>
          {profList.length !== 0 && profList !== undefined ? (
            profList
              .sort((a, b) => (a.courseAverage > b.courseAverage ? -1 : 1))
              .map((prof: { name: string; courseAverage: string }) => {
                return (
                  <Pressable
                    key={undefined}
                    style={{
                      width: '100%',
                      backgroundColor: 'black',
                      borderRadius: 15,
                      flexDirection: 'row',
                      padding: 8,
                      marginVertical: 5,
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      navigation.navigate('Course', {
                        course: Props.route.params.courseName,
                        prof: prof.name,
                        courseAverage: prof.courseAverage,
                      })
                    }}
                  >
                    <Text
                      key={undefined}
                      style={{
                        color: 'white',
                        textAlign: 'left',
                        fontSize: 25,
                        fontWeight: '500',
                        width: '80%',
                      }}
                    >
                      {prof.name}
                    </Text>
                    <Text
                      key={undefined}
                      style={{
                        textAlign: 'right',
                        color:
                          parseFloat(prof.courseAverage).toFixed(2) >= 3.5
                            ? colors.BLUE
                            : parseFloat(prof.courseAverage).toFixed(2) >= 3.0
                            ? colors.GREEN
                            : parseFloat(prof.courseAverage).toFixed(2) >= 2.5
                            ? colors.ORANGE
                            : colors.RED,
                        fontSize: 25,
                        fontWeight: '800',
                        width: '20%',
                      }}
                    >
                      {parseFloat(prof.courseAverage).toFixed(2)}
                    </Text>
                  </Pressable>
                )
              })
          ) : (
            <View
              style={{
                width: '100%',
                height: '20%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 25, marginTop: 5 }}>
                Loading...
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

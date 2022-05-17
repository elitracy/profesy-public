//IMPORTS
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '../assets/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { React, useEffect, useState } from 'react'

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
  const newFilter: [{ name: string; gpa: string }] = profList.filter(
    (value: { name: string; gpa: string }) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase())
    }
  )
  if (searchWord === undefined) {
    setProfList(originalProfList)
  } else {
    setProfList(newFilter)
  }
}

async function getProfsByCourse(
  course: string,
  setProfList: any,
  setOriginalProfList: any
): Promise<any> {
  // return await fetch(`https://profesy.herokuapp.com/?name=${name}`)
  return await fetch(
    `https://profesy.herokuapp.com/profsByCourse?course=${course}`
  )
    .then((result) => result.json())
    .then((result) => {
      console.log(result.courses)
      setProfList(result.courses)
      setOriginalProfList(result.courses) //save prof list for if search is empty
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

export const Courses = (Props: Props) => {
  const [profList, setProfList] = useState([])
  const [originalProfList, setOriginalProfList] = useState([])
  const [searchBG, setSearchBG] = useState('black')
  const [wordEntered, setWordEntered] = useState('')
  const navigation = useNavigation<coursesScreenProp>()

  useEffect(
    (): Promise<any> =>
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
            style={{
              borderWidth: 2,
              borderRightWidth: 0,
              borderLeftWidth: 0,
              padding: 10,
              paddingLeft: 30,
              fontSize: 15,
              borderColor: searchBG,
              width: '100%',
              marginLeft: -30,
            }}
          />
        </View>
        <ScrollView style={{ width: '100%', height: '90%' }}>
          {profList.length !== 0 ? (
            profList
              .sort()
              .map((prof: { _id: { name: string; gpa: string } }) => {
                return (
                  <Pressable
                    key={undefined}
                    style={{
                      width: '100%',
                      backgroundColor: 'black',
                      borderRadius: 15,
                      flexDirection: 'row',
                      padding: 5,
                      marginVertical: 5,
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      navigation.navigate('Course', {
                        course: Props.route.params.courseName,
                        prof: prof._id.name,
                      })
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'left',
                        padding: 5,
                        fontSize: 25,
                        fontWeight: '500',
                        width: '80%',
                      }}
                    >
                      {prof._id.name}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'right',
                        padding: 5,
                        color:
                          parseFloat(prof._id.gpa).toFixed(2) >= 3.5
                            ? colors.BLUE
                            : parseFloat(prof._id.gpa).toFixed(2) >= 3.0
                            ? colors.GREEN
                            : parseFloat(prof._id.gpa).toFixed(2) >= 2.5
                            ? colors.ORANGE
                            : colors.RED,
                        fontSize: 25,
                        fontWeight: '800',
                        width: '20%',
                      }}
                    >
                      {parseFloat(prof._id.gpa).toFixed(2)}
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
                Loading ...
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

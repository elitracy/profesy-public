import {
  SafeAreaView,
  View,
  Text,
  //ActivityIndicator,
  ScrollView,
  Pressable
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import GlobalContext from '../../utils/NavContext'
import { getFavorites } from '../../api/getFavorites'
import { gpaColorizer, colors } from '../../utils/colors'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { getItem } from '../../utils/localStorage'

type favoritesScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favorites'
>

export const Favorites = () => {
  const [favorites, setFavorites] = useState<
    { professor: string; course: string; gpa: string }[]
  >([])
  const [refreshFavorites, setRefreshFavorites] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [nameTitle, setNameTitle] = useState('')
  const [loggedIn, setLoggedIn] = useState('false')
  const [filter, setFilter] = useState<
    { professor: string; course: string; gpa: string }[]
  >([])

  const navigation = useNavigation<favoritesScreenProp>()
  const { setCurrentNav } = useContext(GlobalContext)

  const isFocused = useIsFocused()
  useEffect(()=>{
    getItem('loggedIn', setLoggedIn)
    getItem('username', setUsername)
    getItem('name', setNameTitle)
  },[isFocused])

  useEffect(() => {
    if (username !== '') {
      setLoading(true)
      getFavorites('GET', { username: username })
        .then(result => {
          result ? setFavorites(result.favorites) : setFavorites([])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

  }, [loggedIn, username, refreshFavorites])

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 10
      }}
    >
      <View
        style={{
          width: '100%',
          marginBottom: 8,
          paddingHorizontal: 5,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 40 }}>Favorites</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('Account')
            setCurrentNav('account')
          }}
        >
          {loggedIn === 'true' ? (
            <Text style={{ color: 'white', fontSize: 28, paddingTop: 3 }}>
              {nameTitle}
            </Text>
          ) : (
            <MaterialCommunityIcons name="account" color="white" size={40} />
          )}
        </Pressable>
      </View>
      <View style={{ width: '100%', height: '100%' }}>
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          showsVerticalScrollIndicator={false}
        >
          {loggedIn === 'true' ? (
            <View>
              {!loading &&
                (filter.length > 0 ? filter : favorites).map((c, idx) => {
                  return (
                    <Pressable
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,.1)',
                        borderRadius: 8,
                        padding: 9,
                        marginVertical: 5,
                        flex: 1
                      }}
                      onPress={() => {
                        navigation.navigate('Course', {
                          prof: c.professor,
                          course: c.course,
                          courseAverage: c.gpa,
                          setRefreshFavorites: setRefreshFavorites
                        })
                        setCurrentNav('home')
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '60%',
                          height: '100%'
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 28,
                              fontWeight: '700'
                            }}
                          >
                            {c.course}
                          </Text>
                          <Pressable
                            onPress={() => {
                              if (filter.length > 0) {
                                setFilter([])
                              } else {
                                setFilter(
                                  favorites.filter(course => {
                                    return course.course === c.course
                                  })
                                )
                              }
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 15
                            }}
                          >
                            <Ionicons
                              name="filter"
                              color={
                                filter.length > 0 &&
                                filter[0].course === c.course
                                  ? colors.GREEN
                                  : 'rgba(255,255,255,.4)'
                              }
                              size={24}
                            />
                          </Pressable>
                        </View>
                        <Text
                          style={{
                            opacity: 0.8,
                            fontSize: 24,
                            fontWeight: '400',
                            color: 'white'
                          }}
                        >
                          {c.professor}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          height: '95%',
                          width: '40%'
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            getFavorites('DELETE', {
                              username: username,
                              professor: c.professor,
                              course: c.course
                            })
                            setFavorites(
                              favorites.filter(course => {
                                return (
                                  c.course !== course.course &&
                                  c.professor !== course.professor
                                )
                              })
                            )
                          }}
                        >
                          <Feather
                            name="x"
                            color="rgba(255,255,255,.8)"
                            size={24}
                          />
                        </Pressable>
                        <Text
                          style={{
                            color: gpaColorizer(c.gpa),
                            textAlign: 'right',
                            fontSize: 24,
                            fontWeight: '700'
                          }}
                        >
                          {c.gpa.slice(0, 4)}
                        </Text>
                      </View>
                    </Pressable>
                  )
                })}
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Pressable
                style={{
                  width: '40%',
                  marginTop: 80,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,.4)',
                  padding: 10,
                  borderRadius: 10
                }}
                onPress={() => {
                  navigation.navigate('Account')
                  setCurrentNav('account')
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 32
                  }}
                >
                  Log In
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

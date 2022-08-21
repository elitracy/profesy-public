import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { getFavorites } from '../../api/getFavorites'
import { gpaColorizer, colors } from '../../utils/colors'
import { Feather, Ionicons } from '@expo/vector-icons'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../RootStackParams'
import { useNavigation } from '@react-navigation/native'

type favoritesScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favorites'
>

export const Favorites = () => {
  const [favoriteCourses, setFavoriteCourses] = useState<
    { prof: string; course: string; gpa: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<
    { prof: string; course: string; gpa: string }[]
  >([])

  const navigation = useNavigation<favoritesScreenProp>()
   
  useEffect(() => {
    setLoading(true)

    getFavorites().then(results => {
      setTimeout(async () => {
        setFavoriteCourses(results)
        setLoading(false)
      }, 500)
    })
  }, [])
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
      <View style={{ width: '100%', marginBottom: 8 }}>
        <Text style={{ color: 'white', fontSize: 40 }}>Favorites</Text>
      </View>
      <View style={{ width: '100%', height: '100%' }}>
        {loading && (
          <View>
            <ActivityIndicator />
          </View>
        )}
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          showsVerticalScrollIndicator={false}
        >
          {!loading &&
            (filter.length > 0 ? filter : favoriteCourses).map((c, idx) => {
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
                  onPress={() => navigation.navigate("Course",{...c})}
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
                        justifyContent: 'space-between',
                        width: '75%'
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 32,
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
                              favoriteCourses.filter(
                                course => course.course === c.course
                              )
                            )
                          }
                        }}
                      >
                        <Ionicons
                          name="filter"
                          color={
                            filter.length > 0 && filter[0].course === c.course
                              ? colors.BLUE
                              : 'rgba(255,255,255,.6)'
                          }
                          size={28}
                        />
                      </Pressable>
                    </View>
                    <Text
                      style={{
                        opacity: 0.8,
                        fontSize: 32,
                        fontWeight: '400',
                        color: 'white'
                      }}
                    >
                      {c.prof}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      height: '100%',
                      width: '40%'
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        console.log('API HIT: remove from list')
                        setFavoriteCourses(
                          favoriteCourses.filter(course => c !== course)
                        )
                      }}
                    >
                      <Feather
                        name="x"
                        color="rgba(255,255,255,.8)"
                        size={28}
                      />
                    </Pressable>
                    <Text
                      style={{
                        color: gpaColorizer(c.gpa),
                        textAlign: 'right',
                        fontSize: 32,
                        fontWeight: '700'
                      }}
                    >
                      {c.gpa}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

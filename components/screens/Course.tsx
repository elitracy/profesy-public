//IMPORTS
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Pressable
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import SemesterDistribution from '../SemesterDistribution'
import Reviews from '../Reviews'
import { colors } from '../../utils/colors'
import { getFavorites } from '../../api/getFavorites'
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons
} from '@expo/vector-icons'

interface props {
  route: {
    params: {
      course: string
      prof: string
      courseAverage?: string
    }
  }
}

export function Course(Props: props) {
  // NOTE: will need to update this to check for course average when new db is deployed
  const { course, prof, courseAverage } = Props.route.params

  const scrollViewRef = useRef(null)
  const windowHeight = Dimensions.get('window').height
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    getFavorites().then(results => {
      setTimeout(() => {
        setIsFavorite(
          results.filter(f => f.course === course && f.prof === prof).length > 0
        )

        setLoading(false)
      }, 500)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/*HEADER*/}
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start'
        }}
      >
        <View style={styles.courseTitle}>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
              fontWeight: '500'
            }}
          >
            {course.substring(0, 4)}
            <Text style={{ fontWeight: '300' }}>{course.substring(4, 7)}</Text>
          </Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: '300',
              color: 'white',
              paddingLeft: 5
            }}
          >
            {prof}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (isFavorite) {
              console.log('API HIT: REMOVE FROM FAVORITES')
              setIsFavorite(false)
            } else {
              console.log('API HIT: ADD TO FAVORITES')
              setIsFavorite(true)
            }
          }}
          style={{
            height: '50%',
            margin: 8,
            padding: 5,
            paddingVertical: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: isFavorite ? colors.GREEN : 'rgba(255,255,255,.4)',
            borderWidth: 2,
            borderRadius: 10
          }}
        >
          <Text
            style={{
              color: isFavorite ? colors.GREEN : 'rgba(255,255,255,.4)',
              fontSize: 18,
              fontWeight: "500"
            }}
          >
            {isFavorite ? 'Favorite' : 'Add to Favorites'}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        snapToAlignment="start"
        decelerationRate={'fast'}
        scrollEventThrottle={1}
        snapToInterval={windowHeight}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        style={{ height: '65%' }}
      >
        <SemesterDistribution {...Props} />
        <Reviews {...Props} />
        <Reviews {...Props} />
      </ScrollView>
    </SafeAreaView>
  )
}

// STLYES - NOTE: Convert to inline
const styles: any = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    height: '95%'
  },
  courseTitle: {
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'left'
  }
})

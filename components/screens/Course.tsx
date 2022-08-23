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

interface props {
  route: {
    params: {
      course: string
      prof: string
      courseAverage: string
    }
  }
}

export function Course(Props: props) {
  // NOTE: will need to update this to check for course average when new db is deployed
  const { course, prof } = Props.route.params

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
          width: '95%',
          paddingLeft: '3%',
          paddingBottom: 3,
          marginBottom: 5,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,.2)'
        }}
      >
        <View style={styles.courseTitle}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: 'white',
                fontWeight: '500'
              }}
            >
              {course.substring(0, 4)}
              <Text style={{ fontWeight: '300' }}>
                {course.substring(4, 7)}
              </Text>
            </Text>
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
                height: '60%',
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
                  fontWeight: '500'
                }}
              >
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Text>
            </Pressable>
          </View>
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
      </View>
      <ScrollView
        snapToAlignment="start"
        decelerationRate={0.0001}
        scrollEventThrottle={2}
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

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
import React, { useState, useRef } from 'react'
import SemesterDistribution from '../SemesterDistribution'
import Reviews from '../Reviews'
import { colors } from '../../utils/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SimpleLineIcons } from '@expo/vector-icons'

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
  const { course, prof } = Props.route.params
  const scrollViewRef = useRef(null)
  const windowWidth = Dimensions.get('window').width
  const [currentScrollDist, setCurrentScrollDist] = useState(0)

  return (
    <SafeAreaView style={styles.container}>
      {/*HEADER*/}
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View style={styles.courseTitle}>
          <Text
            style={{
              fontSize: 40,
              paddingLeft: 5,
              paddingVertical: 10,
              color: 'white',
              fontWeight: '500'
            }}
          >
            {course.substring(0, 4)}
            <Text style={{ fontWeight: '300' }}>{course.substring(4, 7)}</Text>
            <Text style={{ fontSize: 20, fontWeight: '300', paddingBottom: 2 }}>
              {' \n'}
              {prof}
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: '30%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 5,
            paddingBottom: 20
          }}
        >
          <Pressable
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: 0,
                animated: true
              })
            }}
          >
            <SimpleLineIcons
              name="graph"
              size={40}
              color={
                currentScrollDist / windowWidth < 0.5
                  ? colors.BLUE
                  : colors.GREY
              }
            />
          </Pressable>
          <Pressable
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: windowWidth,
                animated: true
              })
            }}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={35}
              color={
                currentScrollDist / windowWidth >= 0.5
                  ? colors.BLUE
                  : colors.GREY
              }
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        snapToAlignment="start"
        decelerationRate={'fast'}
        scrollEventThrottle={1}
        snapToInterval={windowWidth}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={event =>
          setCurrentScrollDist(event.nativeEvent.contentOffset.x)
        }
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
    height: '85%'
  },
  courseTitle: {
    borderRadius: 5,
    marginTop: 5,
    width: '70%',
    textAlign: 'left'
  }
})

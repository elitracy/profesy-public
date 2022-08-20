//IMPORTS
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { useState, useEffect } from 'react'

interface props {
  route: {
    params: {
      course: string
      prof: string
    }
  }
}

const Reviews = (Props: props) => {
  const { course, prof } = Props.route.params
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // To be done after review get request is finished
    setLoading(false)
  }, [])

  return (
    <View style={styles.container}>
      {/*DISTRIBUTIONS*/}
      {!loading ? (
        <View style={styles.container}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>Difficulty</Text>
            <Text style={styles.category}>GPA Earned</Text>
            <Text style={styles.category}>Recommend</Text>
            <Text style={styles.category}>Availability</Text>
            <Text style={styles.category}>Accessability</Text>
            <Text style={styles.category}>Extra Credit</Text>
            <Text style={styles.category}>Hours per Week</Text>
            <Text style={styles.category}>Attendance Required</Text>
            <Text style={styles.category}>Textbook Required</Text>
            <Text style={styles.category}>Test based on hw/quizzes</Text>
            <Text style={styles.category}>Response Time</Text>
            <Text style={styles.category}>Office Hour Quality</Text>
            <Text style={styles.category}>Lecture Style</Text>
          </View>


          <Text style={{ color: 'white' }}>Want to Rate this Professor?</Text>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  )
}

// STLYES - NOTE: Convert to inline
const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    paddingHorizontal: Dimensions.get('window').width * 0.05
  },
  category: {
    color: 'white',
    width: '100%',
    fontSize: 25
  },
  categoryContainer: {
    width: '100%',
    height: '80%'
  }
})

export default Reviews

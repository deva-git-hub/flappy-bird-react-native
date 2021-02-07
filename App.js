import React, { useEffect, useState } from 'react';
import { StyleSheet,ImageBackground ,SafeAreaView,Text, View, Dimensions, TouchableWithoutFeedback, Button } from 'react-native';
import Bird from './components/Bird'
import Obstacles from './components/Obstacles'

const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height
export default function App() {
  
  const birdLeft = screenWidth / 2
  const [birdBottom, setBirdBottom]= useState(screenHeight / 2)
  const [obstaclesLeft, setObstaclesLeft]= useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo]= useState(screenWidth + screenWidth/2 + 30)
  const [obstaclesNegHeight, setObstaclesNegHeight]= useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo]= useState(0)
  const [canContinue,setCanContinue] = useState(true)
  const [isGameOver, setIsGameOver]= useState(false)
  const [startGame,setStartGame] = useState(false)
  const [score, setScore]= useState(0)
  const [HighestScore, setHighestScore] = useState(0)
  const gravity = 3
  let obstacleWidth = 60
  let obstacleHeight = 300
  let gap = 200
  let gameTimerId
  let obstaclesTimerId
  let obstaclesTimerIdTwo
  
//start bird falling
  useEffect(() => {
    if (birdBottom > 0 && canContinue && startGame) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity)
      },30)
  
      return () => {
        clearInterval(gameTimerId)
      }
    }
    //if i dont have birdBottom as a dependecy, it wont stop
  }, [birdBottom,startGame])
  //console.log(birdBottom)

  const jump = () => {
   // console.log("jump pressed")
    if ((birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50)
    }
  }

  //start first obstacle
  useEffect(() => {
    if(startGame && !isGameOver){
      if(obstaclesLeft === screenWidth/2 ){
        console.log("score increasd")
        setScore(score +1)
      } 
      if (obstaclesLeft > -60) {
      obstaclesTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesTimerId)
      }
    } else {
     
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight( - Math.random() * 100)
    }
    }
    
  }, [obstaclesLeft,startGame])

  //start second obstacle
  useEffect(() => {
    if(startGame && !isGameOver)
    {
      if(obstaclesLeftTwo === screenWidth/2 ){
        console.log("score increasd")
        setScore(score +1)
      }
      if (obstaclesLeftTwo > -60 && !isGameOver) {
        obstaclesTimerIdTwo = setInterval(() => {
          setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
        }, 30)
          return () => {
            clearInterval(obstaclesTimerIdTwo)
          }
        } else {
          
            setObstaclesLeftTwo(screenWidth)
            setObstaclesNegHeightTwo( - Math.random() * 100)
          }

    }
    
  }, [obstaclesLeftTwo,startGame])

    //check for collisions
    useEffect(() => {
   
      if (
        ((birdBottom < (obstaclesNegHeight + obstacleHeight + 30) ||
        birdBottom > (obstaclesNegHeight + obstacleHeight + gap -30)) &&
        (obstaclesLeft > screenWidth/2 -30 && obstaclesLeft < screenWidth/2 + 30 )
        )
        || 
        ((birdBottom < (obstaclesNegHeightTwo + obstacleHeight + 30) ||
        birdBottom > (obstaclesNegHeightTwo + obstacleHeight + gap -30)) &&
        (obstaclesLeftTwo > screenWidth/2 -30 && obstaclesLeftTwo < screenWidth/2 + 30 )
        )
        ) 
        {
        console.log('game over')
        gameOver()
      }
    },[birdBottom])

    const BeginGame = ()=>{
      console.log("game Begined")
      setObstaclesLeft(screenWidth)
      setObstaclesLeftTwo(screenWidth + screenWidth/2 + 30)
      setBirdBottom(screenHeight/2)
      setIsGameOver(false)
      setCanContinue(true)
      setStartGame(true)
      setScore(0)
    }

    const gameOver = () => {
      clearInterval(gameTimerId)
      clearInterval(obstaclesTimerId)
      clearInterval(obstaclesTimerIdTwo)
      setCanContinue(false)
      setStartGame(false)
      setIsGameOver(true)

      if(score > HighestScore) setHighestScore(score)
      //setIsGameOver(true)
    }

    const StartButton = <View style={styles.ButtonSection}>
    <Button  
            onPress={BeginGame}
            style={styles.Button}
            title="Start Game"
    />

</View>

     const Game = <TouchableWithoutFeedback onPress={jump}>
     <View style={styles.container}>

     <ImageBackground source={require("./pictures/background_flappybird.png")} style={{
    flex: 1,
    resizeMode: "cover",
    
    justifyContent: "center"
  }}>
      
    </ImageBackground>
       
       <Bird 
         birdBottom = {birdBottom} 
         birdLeft = {birdLeft}
       />
       <Obstacles 
         color={'green'}
         obstacleWidth = {obstacleWidth}
         obstacleHeight = {obstacleHeight}
         randomBottom = {obstaclesNegHeight}
         gap = {gap}
         obstaclesLeft = {obstaclesLeft}
       />
       <Obstacles 
         color={'yellow'}
         obstacleWidth = {obstacleWidth}
         obstacleHeight = {obstacleHeight}
         randomBottom = {obstaclesNegHeightTwo}
         gap = {gap}
         obstaclesLeft = {obstaclesLeftTwo}
       />
     </View>
   </TouchableWithoutFeedback>
  

  return (

    <SafeAreaView style={styles.container}>

      

    <Text style={styles.Score}>{`Score ${score}\nHighest ${HighestScore}`}</Text>

       {
         !startGame? StartButton: Game
       }
       
    </SafeAreaView>

    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f2f2f',
    
  },
 

  ButtonSection: {
    width: '100%',
    height: '40%',
    marginTop:'70%',
    justifyContent: 'center',
    alignItems: 'center',

 }
,
 Button: {
 
   backgroundColor: 'blue',
   color: 'white'
 }
 ,
 Score:{
   color:'white',
   fontSize:25,
   position:'absolute',
   left:screenWidth/2 - 30,
   top:'10%',
   width:'100%',
   alignItems:'center'
 }
})

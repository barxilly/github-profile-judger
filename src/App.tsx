import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Progress } from 'rsuite';
import './App.css'

let loaded = false
let percent = 40
let status = 'success'
let color = '#888888'

function Space(props: { num?: number }) {
  if (!props.num) return <span style={{ height: '1em' }} />
  return <span style={{ height: `${props.num}em` }} />
}

function App() {
  return (
    <>
      <div className='App'>
        <div className='preSend'>
          <h1>The Profile Judge</h1>
          <p>Give her your github profile and she will tell you if you are a good developer or not.</p>
          <sup>Made with somewhat care by <a href="https://github.com/Barxilly">@barxilly</a></sup>
          <Space num={2} />
          <input type="text" placeholder="Github Username or Profile URL" id="username" />
          <input type="text" placeholder="Github API token" id="token" />

          <Space />
          <button onClick={handleClick}>Check</button>
        </div>
        <div id="loady" style={{ display: 'none' }}>
          <h1 id="loading">Loading...</h1>
          <div style={{ width: '4em', height: '4em', margin: '0 auto', paddingTop: '2em' }}>
            <Progress.Circle percent={percent} strokeColor={color} status={status} showInfo={false} /></div>
        </div>
      </div>
    </>
  )
}

async function loadingTextsHandler(texts: string[]) {
  const appdiv = document.getElementsByClassName('App')[0]
  while (loaded === false) {
    for (let i = 0; i < texts.length; i++) {
      const loading = document.getElementById('loading')!
      loading.innerHTML = texts[i]
      await new Promise(resolve => setTimeout(resolve, 2300))
    }
  }
}

function shuffle(array: any[]) {
  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

function handleClick() {
  const username = document.getElementById('username')!.value
  const token = document.getElementById('token')!.value
  const presend = document.getElementsByClassName('preSend')[0]
  presend.style.display = 'none'
  document.getElementById('loady')!.style.display = 'block'
  const loadingTexts = [
    "Preparing expert judgement...",
    "Analysing your life's work...",
    "Comparing your skills with actual experts...",
    "Checking your profile...",
    "Githubbin'",
    "Taking a sandwich break...",
    "Reading commit names...",
    "Wondering why some pull requests are not merged...",
  ]
  loadingTextsHandler(shuffle(loadingTexts))
}


export default App 

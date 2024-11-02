import { useState } from 'react'
import { Progress } from 'rsuite';
import './App.css'
import { set } from 'rsuite/esm/internals/utils/date';

let loaded = false

function Space(props: { num?: number }) {
  if (!props.num) return <span style={{ height: '1em' }} />
  return <span style={{ height: `${props.num}em` }} />
}

function App() {
  const [percent, setPercent] = useState(40)
  const [color, setColor] = useState('#888888')

  async function loadingTextsHandler(texts: string[]) {
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

  async function handleClick() {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const tokenInput = document.getElementById('token') as HTMLInputElement;
    let username = usernameInput.value;
    const token = tokenInput.value;


    if (!username || username === '' || !token || token === '') {
      if (!username || username === '') {
        usernameInput.classList.add('shake');
        usernameInput.classList.add('aftershake');

        setTimeout(() => {
          usernameInput.classList.remove('shake');
        }, 500);
      } else {
        usernameInput.classList.remove('aftershake');
      }

      if (!token || token === '') {
        tokenInput.classList.add('shake');
        tokenInput.classList.add('aftershake');

        setTimeout(() => {
          tokenInput.classList.remove('shake');
        }, 500);
      } else {
        tokenInput.classList.remove('aftershake');
      }

      return;
    } else {
      loadingScreen();
      await setPercent(2);
      if (username.includes('http') || username.includes('github.com')) {
        const url = username;
        const regex = /\/([^\/]+)\/?$/;
        const matches = regex.exec(url);
        if (matches && matches.length > 1) {
          username = matches[1];
        }
      }
      const url = `https://api.github.com/users/${username}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      await setPercent(10);
      if (data.message === 'Not Found') {
        setPercent(100);
        setColor('#ff0000');
        const presend = document.getElementsByClassName('preSend')[0] as HTMLElement;
        if (presend) {
          presend.classList.add('fade-in');
          presend.classList.remove('fade-out');
          presend.addEventListener('animationend', () => {
            presend.style.display = 'flex';
          });
        }
        const loady = document.getElementById('loady') as HTMLElement;
        if (loady) {
          loady.classList.add('fade-out');
          loady.classList.remove('fade-in');
          loady.addEventListener('animationend', () => {
            loady.style.display = 'none';
          });
        }
        alert('Username not found!');
        return;
      }
      // Get a list of all the repositories, their names, and their descriptions
      const repores = await fetch(`https://api.github.com/users/${username}/repos`);
      await setPercent(20);
      const repos = await repores.json();
      console.log(repos);
    }
  }

  async function loadingScreen() {
    const presend = document.getElementsByClassName('preSend')[0] as HTMLElement;
    if (presend) {
      presend.classList.add('fade-out');
      presend.addEventListener('animationend', () => {
        presend.style.display = 'none';
      });
    }
    const loady = document.getElementById('loady') as HTMLElement;
    if (loady) {
      loady.style.display = 'block';
      loady.classList.add('fade-in');
    }
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

  return (
    <>
      <div className='App'>
        <div className='preSend'>
          <h1>The Profile Judge</h1>
          <p>Give her your github profile and she will tell you if you are a good developer or not.</p>
          <sup>Made with slight love somewhat care by <a href="https://github.com/Barxilly">@barxilly</a></sup>
          <Space num={2} />
          <input type="text" placeholder="Github Username or Profile URL" id="username" />
          <input type="text" placeholder="Github API token" id="token" />

          <Space />
          <button onClick={handleClick}>Check</button>
        </div>
        <div id="loady" style={{ display: 'none' }}>
          <h1 id="loading">Loading...</h1>
          <div style={{ width: '4em', height: '4em', margin: '0 auto', paddingTop: '2em', display: 'inline-block' }}>
            <Progress.Circle percent={percent} strokeColor={color} status={percent === 100 ? 'success' : 'active'} showInfo={percent === 100} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
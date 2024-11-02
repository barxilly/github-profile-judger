import { useState } from 'react'
import { Progress } from 'rsuite';
import './App.css'
import axios from 'axios';
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
        await new Promise(resolve => setTimeout(resolve, 4000))
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
    let token = tokenInput.value || atob('Z2l0aHViX3BhdF8xMUFQSTRLUFkwQUowa2FFZ2RNU0VDX3BoRFJBTnV3Rk9XcmR6WVlvVHV3OHJmRGVJV0w2THdqUnJUMzEyWEgxTUdQTE1XUkNVSWxqcVpNeDF0');
    if (token.length < 1) {
      token = atob('Z2l0aHViX3BhdF8xMUFQSTRLUFkwQUowa2FFZ2RNU0VDX3BoRFJBTnV3Rk9XcmR6WVlvVHV3OHJmRGVJV0w2THdqUnJUMzEyWEgxTUdQTE1XUkNVSWxqcVpNeDF0');
    }

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

      // Run Loading Screen

      loadingScreen();
      await setPercent(2);

      // Parse Username

      if (username.includes('http') || username.includes('github.com')) {
        const url = username;
        const regex = /\/([^\/]+)\/?$/;
        const matches = regex.exec(url);
        if (matches && matches.length > 1) {
          username = matches[1];
        }
      }

      // Get User Data

      const url = `https://api.github.com/users/${username}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      await setPercent(20);

      // Check if Username is Valid

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

      // Get Repos

      const repores = await fetch(`https://api.github.com/users/${username}/repos`);
      await setPercent(40);
      let repos = await repores.json();
      repos = repos.filter((repo: any) => !repo.fork);
      console.log(repos);
      const reposNames = repos.map((repo: any) => repo.name);
      const reposDescriptions = repos.map((repo: any) => repo.description);
      console.log(reposNames);
      console.log(reposDescriptions);
      await setPercent(60);

      // Find most common language

      const languageUse: any = [];
      for (let i = 0; i < repos.length; i++) {
        if (repos[i].language) {
          languageUse.push(repos[i].language);
        }
      }
      const languageCount: { [key: string]: number } = {};
      languageUse.forEach((language: string) => {
        if (languageCount[language]) {
          languageCount[language]++;
        } else {
          languageCount[language] = 1;
        }
      });
      let mostCommonLanguage = "";
      let maxCount = 0;
      for (const language in languageCount) {
        if (languageCount[language] > maxCount) {
          mostCommonLanguage = language;
          maxCount = languageCount[language];
        }
      }
      console.log(mostCommonLanguage);
      await setPercent(70);

      // Get user's readme from their profile repo

      let readme = "NO README FOUND FOR USER";
      try {
        const readmeres = await fetch(`https://api.github.com/repos/${username}/${username}/readme`);
        await setPercent(75);
        const readmeenc = await readmeres.json();
        readme = atob(readmeenc.content);
      } catch (error) { }
      console.log(readme);

      // Build Prompt

      const sys = 'You are here to judge this person\'s coding skills, be slightly mean and rude. Also, you\'re a woman, and willing to show your superiority over others.';
      let prompt = `This person\'s github username is ${username}.\nThey usually write in ${mostCommonLanguage}.\nTheir readme reads:\n\`${readme}\`\nHere are some of their repos:`
      for (let i = 0; i < reposNames.length; i++) {
        if (!reposDescriptions[i] && reposNames[i].length > 0 && !repos[i].language) {
          prompt += `\n\"${reposNames[i]}\"`;
        } else if (!reposDescriptions[i] && reposNames[i].length > 0 && repos[i].language) {
          prompt += `\n\"${reposNames[i]}\" which is written in ${repos[i].language}`;
        } else if (reposDescriptions[i] && reposNames[i].length > 0 && repos[i].language) {
          prompt += `\n\"${reposNames[i]}\" which is written in ${repos[i].language} and is described as \"${reposDescriptions[i]}\"`;
        } else if (reposDescriptions[i] && reposNames[i].length > 0 && !repos[i].language) {
          prompt += `\n\"${reposNames[i]}\" which is described as \"${reposDescriptions[i]}\"`;
        }
      }
      console.log(prompt);
      await setPercent(80);

      // Call AI

      const urlai = "https://models.inference.ai.azure.com/chat/completions";
      const modelName = "gpt-4o-mini";
      const responseai = await axios.post(
        urlai,
        {
          messages: [
            {
              role: 'system',
              content: sys,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 1024,
          top_p: 1,
          model: modelName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      let dataai = await responseai.data.choices[0].message.content;
      console.log(dataai);
      await setPercent(100);

      // Display Result

      const result = document.getElementById('result') as HTMLElement;
      const loady = document.getElementById('loady') as HTMLElement;
      loady.classList.add('fade-out');
      setTimeout(() => {
        loady.style.display = 'none';
      }, 500);
      result.classList.add('fade-in');
      setTimeout(() => {
        result.style.display = 'block';
      }, 500);

      // Clean Up

      dataai = dataai.replace(/\n/g, '¬');
      console.log(dataai);
      typeTextSlowly('resultText', dataai);
    }
  }

  function typeTextSlowly(elementId: string, text: string) {
    const element = document.getElementById(elementId) as HTMLElement;
    element.innerHTML = '';
    let i = 0;

    function typeNextChar() {
      if (i < text.length) {
        if (text.charAt(i) === '¬') {
          element.innerHTML += '<br>';
          i++;
          typeNextChar();
        } else {
          element.innerHTML += text.charAt(i);
          scrollTo(0, element.scrollHeight);
          i++;
          setTimeout(typeNextChar, Math.random() * 80);
        }
      }
    }

    typeNextChar();
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
      "Analyzing your life's work... and finding it lacking",
      "Comparing your skills with actual experts... good luck",
      "Checking your profile... it's not looking great",
      "Githubbin'... because what else is there?",
      "Taking a sandwich break... because this code won't fix itself",
      "Reading commit names... and questioning your choices",
      "Wondering why some pull requests are not merged... probably because they're terrible",
      "Refactoring your mistakes...",
      "Debugging your overconfidence...",
      "Optimizing your imposter syndrome...",
      "Rebasing your regrets...",
      "Synchronizing with reality...",
      "Running on shattered dreams...",
      "Compiling your failures...",
      "Resolving merge conflicts in your life...",
      "Linting your bad decisions...",
      "Deploying to nowhere...",
      "Checking for infinite sadness...",
      "Rendering your disillusionment...",
      "Fetching more disappointment...",
      "Minifying your hopes...",
      "Executing a sigh...",
      "Parsing your excuses...",
      "Loading more procrastination...",
      "Encrypting your insecurities...",
      "Decoding your despair...",
      "Simulating productivity... barely",
      "Upgrading your anxiety...",
      "Initializing existential dread...",
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
          <sup style={{ fontSize: "0.6rem" }}>You <i>can</i> leave this blank, but it's recommended to use a token to avoid rate limiting.</sup>
          <sup style={{ fontSize: "0.6rem" }}>You can get a token <a href="https://github.com/settings/tokens/new?scopes=read:user&description=The%20Profile%20Judge" target='_blank'>here</a>. But you must have access to <a href="https://github.blog/news-insights/product-news/introducing-github-models/" target='_blank'>Github Models</a> to use this feature.</sup>
          <Space num={2} />
          <button onClick={handleClick}>Check</button>
        </div>
        <div id="loady" style={{ display: 'none' }}>
          <h1 id="loading">Loading...</h1>
          <div style={{ width: '4em', height: '4em', margin: '0 auto', paddingTop: '2em', display: 'inline-block' }}>
            <Progress.Circle percent={percent} strokeColor={color} status={percent === 100 ? 'success' : 'active'} showInfo={percent === 100} />
          </div>
        </div>
        <div id="result" style={{ display: 'none' }}>
          <h1>The Oracle Says:</h1>
          <p id="resultText" style={{ padding: '1em' }}></p>
        </div>
      </div>
    </>
  )
}

export default App
# The Github Profile Judge

This is a simple web app that uses AI to judge your Github profile. It's a bit of a joke, but I feel like I've learned something from it.

## How to Use
  1. Go to [The Build](https://barxilly.github.io/profile-judge-build/)
  2. Enter your Github username and Github API token
  3. Click "Check"
  4. Wait for the results
  5. You can copy the results to your clipboard or download a screenshot of the results if you wanna share!

## How I made it

I used [Github Models](https://github.blog/news-insights/product-news/introducing-github-models/) to make the AI call. I also used [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) to build the app's frontend and the [TypeScript](https://www.typescriptlang.org/) language to build the app's backend.

The app get's the user's profile data from Github's API, then it gets the most common language used in the repos, and then it gets the readme from the user's profile repo. This is all fed to the AI, which then gives the results.
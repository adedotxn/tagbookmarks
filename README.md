# [TagBookmarks](https://tagbookmarks.vercel.app)
TagBookmarks is a web app built for adding/pinning tags to your twitter bookmarks so as to be able to easily filter through your twitter bookmarks and sort of categorize them to your likeness. Fun project built by me to solve my congested twitter bookmarks issue because i can't afford twitter blue haha


## Features
- Fetching Bookmarks (this action is stable for bookmarks between 0 - 50 but unstable going further)
- Creating tags : you can create the tags you'd like to pin to a tweet
- Adding Tags : you can add single/multiple tags to specific tweets.
- Show Embed - you can decide to view the original tweet in-app twitter style
- Go to twitter : takes you directly to the tweet on twitter
- View Tagged Bookmarks : shows you only bookmarks you've tagged, doesn't need to fetch from your twitter bookmarks
- Searching : you can search through and filter through your bookmarks by username, tags, tweets or names.

## Technologies Used
- [Next.js](https://nextjs.org/) (version 12).
- [Mantine UI](https://mantine.dev/) : Fully Featured React Component Library.
- [Next Auth](https://next-auth.js.org/) : User Authentication Library, specifically used for Twitter in this project.
- Mongodb & Mongoose : to store tweet id's and tags associated with current user.
- [node-twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) : Open Source Library used to comfortably work with twitter v2 apis - helps abstract and understand a lot of complexities. 
- [React-Twitter-Embed](https://github.com/saurabhnemade/react-twitter-embed) : Open Source Library to embed tweets in a react web app.

### Problems Faced/Facing
- Persisting app authroristaion state for a user over a long period of time so that they do not have to reauthorize the app. My code to get a new access tokn with refresh token seems to be wrong as i keep getting a "token passed in was invalid error" while trying to refresh the access token.


### Want to contribute? Getting Started

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.



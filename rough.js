const data = [
  {
    _id: "632f39ada8f4a1282c8a70b8",
    tweepId: "1248913910557822976",
    userTags: [
      null,
      "important",
      "funny",
      "relatable",
      "Test",
      "H",
      "A",
      "Create Tag Works",
      "ina",
      "dump",
      "Beauty",
      "To download",
      "Women",
      "Funny",
      "Skincare?",
      "Peng tings",
      "Insightful",
      "FE Tweets",
      "Toast",
      "Code",
    ],
    __v: 0,
    accessToken:
      "UHlrLVJXYTVYbTZIdDR5Q2tnSHQ3V2RPazh4b2E4RlRYNFd0MkxzLTFFTUM2OjE2NjY5NjYyNjM2OTY6MTowOmF0OjE",
    refreshToken:
      "b1h2Z0JaZVZGdk5sQmV4UlZWVkxDcS1oUUpNclgtQzVqcHZiMHdacDViYXNJOjE2NjY5NjYyNjM2OTY6MToxOnJ0OjE",
  },
  {
    _id: "6349950a6c708271e282e689",
    tweepId: "1234827677523234816",
    userTags: [
      "Tech Scholarships ",
      "Life hack",
      "German",
      "Programming ",
      "Linux ",
      "Books",
      "Youtube ",
      "Data science ",
    ],
    refreshToken:
      "Ym5MUDNfRXcwVnJfZVdKRHZ4MnhfT0JJajExclFmdXAzdElfbnp1T0JQYmNzOjE2NjYwMzYzNDEzNDA6MToxOnJ0OjE",
    accessToken:
      "blU2U29ldEhJN0E1amlOMEVTcUhRZTJTNDM0Vm5McHkxS2ZyUVNkeF9GMUpROjE2NjYwMzYzNDEzNDA6MTowOmF0OjE",
    __v: 0,
  },
  {
    _id: "634daf9adf00700536945c83",
    tweepId: "1581425819825700866",
    userTags: [],
    refreshToken:
      "MGphSGlnNUtnaUF0bEppVWp1R2tVVjdheXpLR3JkRnNCaHNNdFljRURraENiOjE2NjYwMzYzMTY0MjQ6MToxOnJ0OjE",
    accessToken:
      "LUY1SlVVMWFscEpRYTZkZW1yaG5tVDRaY1FidHBLN0psVHdBckhCRkIyT1paOjE2NjYwMzYzMTY0MjQ6MTowOmF0OjE",
    __v: 0,
  },
  {
    _id: "6350fc3e91c13181c242531b",
    tweepId: "1160318246337355777",
    userTags: [],
    refreshToken:
      "Q2FtdUlncVU3MVJLOUYxUENtNmdST3U3YUg1cU9XLW45dFBKNUEzdGtQN0hWOjE2NjYyNTE4MzY1NTA6MTowOnJ0OjE",
    accessToken:
      "SlRuUVBrdjN6QmE1S0h3TjlwZXB1d2prMDZHNlZaM3ZhaFkzd0tIYnJuMV9COjE2NjYyNTE4MzY1NTA6MTowOmF0OjE",
    __v: 0,
  },
];

const aT = [];

const filt = data.forEach((e) => aT.push(e.accessToken));

console.log(aT);

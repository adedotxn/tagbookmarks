let token = {};
const account = {
  provider: "prov",
};

token["provider"] = {};

console.log(token);

token["provider"].accessToken = "acesss";
token["provider"].refreshToken = "refresh";
token["paul"] = 98;
console.log(token);
console.log(token);

console.log(typeof token["provider"]);
console.log(token.paul);

const bkdm = [
  {
    age: 1,
    year: 11,
  },
  {
    age: 2,
    year: 12,
  },
  {
    age: 3,
    year: 13,
  },
];

const sk = [
  {
    name: "shgsdhg",
    username: "sdjskdj",
  },
  {
    name: "bbbbb",
    username: "sdjskdj",
  },
  {
    name: "ccccccccc",
    username: "sdjskdj",
  },
];

const join = [...bkdm, ...sk];
const join2 = bkdm.concat(sk);
const join3 = Object.assign({}, ...join);
const join4 = bkdm.map((e, idx) => {
  return {
    age: e.age,
    year: e.year,
    name: sk[idx].name,
    username: sk[idx].username,
  };
});

// console.log(join);
// console.log(join2)
console.log(join4);

const session2 = {
  expires: "dfdkjfdk",

  user: {
    imqge: "dfkjfk",
    name: "sdsdjhsd",
  },
};

session2["user"].id = "askaskj";

console.log(session2);

const data = (labely = ["funny", "guyyy"]);

console.log(labely);
console.log(data);

const dl = data.map((e, idx) => {
  return {
    value: e,
    label: e,
  };
});

console.log(dl);

const adaa = [
  {
    _id: "6331c19b9db913d2bef079a0",
    tweepId: "1248913910557822976",
    tweetId: "1573747382747029504",
    tags: ["important", "funny", "relatable"],
    time: "1664204985369",
    __v: 0,
  },
];

const tagsArray = [];
adaa.map((e) => {
  e.tags.map((tags) => {
    tagsArray.push(tags);
  });
});

console.log(tagsArray);

const rettt = {
  tags: ["important", "funny", "relatable"],
};

console.log(
  rettt.tags.map((e) => {
    return e;
  })
);

let tagsss = ["important", "funny", "relatable"];
console.log(tagsss[0]);

tagsss.map((e) => {
  console.log(e);
});

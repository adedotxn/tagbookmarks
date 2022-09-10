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

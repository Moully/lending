const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const fs = require("fs").promises;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/");

// app.post("/", async(req, res)=>{
//     const {email, password} = req.body
//     const token = jwt.sign({email}, "secret-key")

//     if(email==='admin' && password === "admin"){
//         return res.json({
//             token
//         })
//     }
//     res.status(500).send({
//         message: "WRONG EMAIL OR PASSWORD B!@#$"
//     })
// })
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ email }, "secret-key");

  const filePath = "src/data/users.json";
  const usersRaw = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(usersRaw);
  const user = users.find((users) => users.email === email);

  if (password === user.password) {
    return res.json({
      token,
    });
  }
  res.status(500).send({
    message: "WRONG EMAIL OR PASSWORD B!@#$",
  });
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const filePath = "src/data/users.json";
  const usersRaw = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(usersRaw);

  const user = users.filter((user) => user.email === email);
  if (user.length) {
    return res.status(404).json({
      message: "User already exists",
    });
  }
  users.push({
    email,
    password,
  });

  await fs.writeFile(filePath, JSON.stringify(users));

  return res.json({
    message: "Users created",
  });
});

app.post("/categories", async (req, res) => {
  //frontoos token, zurag, ongo, category avah heseg
  const { categoryName, icon, color, email } = req.body;
  // const { authorization } = req.headers;

  //token-oos secret key ashiglaj email avah
  // const payload = jwt.verify(authorization, "secret-key");
  // const { email } = payload;

  //BackEnd file-s BUH CATAGORIES-g aguulj baigaa array songoj tuuniigee json bolgoh
  const filePath = "src/data/category.json";
  const categoriesRaw = await fs.readFile(filePath, "utf-8");
  const categories = JSON.parse(categoriesRaw);

  //BUH CATAGORIES-uudaas tuhain hereglegchiin email-tei taarah categories-uudiig filterdeh
  const userCategories = categories.filter((item) => item.email === email);

  //Useriin categories-uudiig frontoos orj irj baigaa category-goor filterdeh
  const categoryChecker = userCategories.filter(
    (item) => item.categoryName === categoryName
  );

  //CategoryChecker-s array ireh ba array urt ni 0 baival false utga, 1-s deesh baival truth utga
  if (categoryChecker.length) {
    return res.status(409).json({
      message: "Category already exists",
    });
  }
  categories.push({
    categoryName,
    icon,
    color,
    email,
  });

  await fs.writeFile(filePath, JSON.stringify(categories));

  return res.json({
    message: "Category created",
  });
});

const port = 3001;

app.listen(port, () => {
  console.log(`example ${port}`);
});

app.get("/", async (req, res) => {
  res.json({
    message: "hi",
  });
});

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// --- Auth & JWT server setup----
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const db = require("./models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Database will accept requests from the main server
const corsOptions = {
  origin: ["https://localhost:5500"],
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Custom console logger
app.use((req, res, next) => {
  const url = req.url;
  const method = req.method;
  const requestedAt = new Date().toLocaleTimeString();
  const result = `${method} ${url} ${requestedAt}`;
  console.log(result);

  next();
});

// ---------- VIEWS ----------

app.get('/', (req, res) => {
  res.sendFile('Radio_Homepage.html', {
    root: __dirname
  });
});

app.get('/host_login', (req, res) => {
  res.sendFile('Radio_HostLogin.html', {
    root: __dirname
  });
});

app.get('/on_now', (req, res) => {
  res.sendFile('Radio_EventPage.html', {
    root: __dirname
  });
})

app.get('/script.js', (req, res) => {
  res.sendFile('script.js', {
    root: __dirname
  });
})

// app.get('/', (req, res) => {
//     res.render('index.ejs', {host: 'BK'})
// })

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.get('/users', (req, res) => {
  db.User.find({}).populate('country', '_id name emergency police firefighters').exec((err, foundUsers) => {
    if (err) return res.status(404).json({ status: 404, error: "Cannot find all users" });
    res.json(foundUsers);
  });
})

// ---------- POST ----------

app.post('/register', (req, res) => {
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(404).json({ status: 404, error: "Cannot register user." });
    if (foundUser) return res.status(404).json({ status: 404, error: "Account already registered." });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(404).json({ status: 404, error: "Cannot register user." });

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.status(404).json({ status: 404, error: "Cannot register user." });
        const userInfo = {
          accountName: req.body.accountName,
          email: req.body.email,
          password: hash
        };

        db.User.create(userInfo, (err, savedUser) => {
          if (err) return res.status(500).json(err);

          const token = jwt.sign(
            {
              email: savedUser.email,
              _id: savedUser._id
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30 days"
            },
          );

          return res.status(200).json({
            message: 'User Created',
            token
          })
        });
      });
    });
  });
})

app.post('/login', (req, res) => {
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(404).json({ status: 404, error: "Cannot login a user" });
    if (!foundUser) return res.status(404).json({ status: 404, error: "Invalid credentials." });

    bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
      if (err) return res.status(404).json({ status: 404, error: "Cannot login a user" });
      if (isMatch) {
        const token = jwt.sign(
          {
            email: foundUser.email,
            _id: foundUser._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30 days"
          },
        );
        return res.render('index.ejs', { host: foundUser.accountName });
      } else {
        res.status(404).json({ status: 404, error: "Cannot login. Please, try again." });
      };
    });
  });
});

// -----Socket io Server Setup-----
const io = require('socket.io')(3000)

const users = {}

io.on('connect', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name:users[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
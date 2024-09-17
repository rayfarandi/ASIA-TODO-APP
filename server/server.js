const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const moment = require('moment');

const JWT_SECRET = process.env.JWT_SECRET
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// get all todoapp
app.get('/todoapp/:userEmail', async (req, res) => {
  const { userEmail } = req.params
  if(!userEmail) {
    return res.status(400).json({ error: 'Invalid User' })
  }
  try {
    

    const todoapp = await pool.query('SELECT * FROM todoapp WHERE user_email = $1', [userEmail])
    res.status(200).json(todoapp.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


// create a new todo
app.post('/todoapp', async(req, res) => {
  const { user_email, title, progress, description, date } = req.body
  const id = uuidv4()

  if (!user_email || !title || !progress || !description ) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const formattedDate = moment(date).format('YYYY-MM-DD, h:mm:ss a')
    const newToDo = await pool.query(
      `INSERT INTO todoapp(id, user_email, title, progress, description, date) 
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, user_email, title, progress, description, formattedDate]
    )
    res.status(200).json(newToDo.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


// edit a new todo
app.put('/todoapp/:id', async (req, res) => {
  const { id } = req.params
  const { user_email, title, progress,  description } = req.body
  try {
    const updatedToDo = await pool.query(
      'UPDATE todoapp SET user_email = $1, title = $2, progress = $3, description = $4 WHERE id = $5 RETURNING *;',
      [user_email, title, progress, description, id]
    )
    if (updatedToDo.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.status(200).json(updatedToDo.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// delete a todo
app.delete('/todoapp/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleteToDo = await pool.query('DELETE FROM todoapp WHERE id = $1 RETURNING *;', [id])
    if (deleteToDo.rows.length === 0) {
      return res.status(404).json({ error: 'Id not found' })
    }
    res.status(200).json({ message: 'Todo deleted successfully' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// signup

app.post('/signup', async (req, res) => {
  const { email, password } = req.body

  //is email password empaty
  if(!email || !password){
    return res.status(400).json({ detail: 'Email and password is required!' });
  }  
  //validate email formate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(String(email).toLowerCase())){
    return res.status(400).json({ detail: 'Email is not valid!' });
  }
  

  //check if email already exist
  const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  if (users.rows.length > 0) {
    return res.status(409).json({ detail: 'Email already exist!' })
  }

  
  try{
    //hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    //insert new user
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email,hashedPassword]
    )
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1hr' })
    res.json({ email, token })
  }catch(err){
    console.error(err)
    if(err){
      res.json({ detail: err.detail})
    }
  }
})


// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  try {
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (!email) return res.status(400).json({ detail: 'Email cannot be empty' })
    if (!password) return res.status(400).json({ detail: 'Password cannot be empty' })
    if (!users.rows.length) return res.status(401).json({ detail: 'User does not exist!' })
        
    
    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1hr' })

    if (success) {
      res.status(200).json({ 'email' : users.rows[0].email, token})
    } else {
      res.status(401).json({ detail: "Login failed"})
    }
  } catch (err) {
    console.error(err)
  }
})

//testing api
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, ( )=> console.log(`Server running on PORT ${PORT}`))

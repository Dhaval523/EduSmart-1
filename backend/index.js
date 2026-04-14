import express from 'express'
import { connectDB } from './src/config/db.js'
import { ENV } from './src/config/env.js'
import cookieParser from 'cookie-parser'
import userRoute from './src/routes/user.route.js'
import courseRoute from './src/routes/course.route.js'
import moduleRoute from './src/routes/module.routes.js'
import quizRoute from './src/routes/quiz.route.js'
import commentRoute from './src/routes/comment.route.js'
import paymentRoute from './src/routes/payment.route.js'
import analyticRoute from './src/routes/analytic.route.js'
import progressRoute from './src/routes/progress.route.js'
import aiRoute from './src/routes/ai.routes.js'
import roadmapRoute from './src/routes/roadmap.route.js'
import reportRoute from './src/routes/report.route.js'
import orderRoute from './src/routes/order.route.js'
import cors from 'cors'

const app = express()

const allowedOrigins = [
    ENV.CLIENT_URL,
    "http://localhost:5173",
     "http://localhost:5174",
    "https://edusmart-1-1.onrender.com"
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser clients (no Origin) and known dev origins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api', userRoute)
app.use('/api/course', courseRoute)
app.use('/api/module', moduleRoute)
app.use('/api/quiz', quizRoute)
app.use('/api/comment', commentRoute)

app.use('/api/payment', paymentRoute)
app.use('/api/analytic', analyticRoute)
app.use('/api/progress', progressRoute)
app.use('/api/reports', reportRoute)
app.use('/api/orders', orderRoute)
app.use('/api', aiRoute)
app.use('/api/roadmap', roadmapRoute)




app.listen(ENV.PORT, async ()=>{
    await connectDB()
    console.log("server started", ENV.PORT)

})

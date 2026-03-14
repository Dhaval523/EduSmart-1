import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/User/Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoute'
import SingleCourse from '@/Pages/User/SingleCourse'
import YourCourse from '@/Pages/User/YourCourse'
import SinglePurchasedCourse from '@/Pages/User/SinglePurchasedCourse'
import Dashboard from '@/Pages/Admin/Dashboard'
import DashboardAnalytics from '@/Pages/Admin/DashboardAnalytics'
import DasbhoardProducts from '@/Pages/Admin/DasbhoardProducts'
import CreateModule from '@/Pages/Admin/CreateModule'
import Quiz from '@/Pages/User/Quiz'
import AiLearningPath from '@/Pages/User/AiLearningPath'
import Cancel from '@/Pages/Admin/Cancel'
import PaymenSuccess from '@/Pages/Admin/PaymenSuccess'

const MainRoutes = () => {
  return (
   <Routes>
    <Route element={<ProtectedRoutes />}>
      <Route path='/' element={<Home/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
      <Route path='/purchase' element={<PaymenSuccess/>}/>
      <Route path='/singleCourse/:id' element={<SingleCourse/>}/>
      <Route path='/YourCourse' element={<YourCourse/>}/>
      <Route path='/YourCourse/:id' element={<SinglePurchasedCourse/>}/>
      <Route path='/quiz/:id' element={<Quiz/>}/>
      <Route path='/ai-learning-path' element={<AiLearningPath/>}/>

      <Route path='/dashboard' element={<Dashboard/>}>
        <Route index element={<DashboardAnalytics/>}/>
        <Route path='dashboardProduct' element={<DasbhoardProducts/>}/>
        <Route path='CourseModule/:id' element={<CreateModule/>}/>
      </Route>
    </Route>

    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
   </Routes>
  )
}

export default MainRoutes

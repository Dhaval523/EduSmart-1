import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/User/Home'
import React from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoute'
import { AdminRoutes } from './AdminRoute'
import CourseDetailsPage from '@/Pages/User/CourseDetailsPage'
import YourCourse from '@/Pages/User/YourCourse'
import CourseLearningPage from '@/Pages/User/CourseLearningPage'
import Dashboard from '@/Pages/Admin/Dashboard'
import DashboardAnalytics from '@/Pages/Admin/DashboardAnalytics'
import DasbhoardProducts from '@/Pages/Admin/DasbhoardProducts'
import CourseWorkspace from '@/Pages/Admin/CourseWorkspace'
import Orders from '@/Pages/Admin/Orders'
import Users from '@/Pages/Admin/Users'
import Quiz from '@/Pages/User/Quiz'
import AiLearningPath from '@/Pages/User/AiLearningPath'
import Profile from '@/Pages/User/Profile'
import Cancel from '@/Pages/Admin/Cancel'
import PaymenSuccess from '@/Pages/Admin/PaymenSuccess'
import Reports from '@/Pages/Admin/Reports/Reports'

const MainRoutes = () => {
  const LegacyCourseRedirect = () => {
    const { id } = useParams()
    return <Navigate to={`/courses/${id}/learn`} replace />
  }

  return (
   <Routes>
    <Route element={<ProtectedRoutes />}>
      <Route path='/' element={<Home/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
      <Route path='/purchase' element={<PaymenSuccess/>}/>
      <Route path='/courses/:courseId' element={<CourseDetailsPage/>}/>
      <Route path='/courses/:courseId/learn' element={<CourseLearningPage/>}/>
      <Route path='/YourCourse' element={<YourCourse/>}/>
      <Route path='/YourCourse/:id' element={<LegacyCourseRedirect />} />
      <Route path='/quiz/:id' element={<Quiz/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/ai-learning-path' element={<AiLearningPath/>}/>
      <Route path='/roadmap' element={<AiLearningPath/>}/>

      <Route element={<AdminRoutes />}>
        <Route path='/admin' element={<Dashboard/>}>
          <Route index element={<DashboardAnalytics/>}/>
          <Route path='courses' element={<DasbhoardProducts/>}/>
          <Route path='courses/:id' element={<CourseWorkspace/>}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='users' element={<Users/>}/>
        </Route>
        <Route path='/reports' element={<Dashboard/>}>
          <Route index element={<Reports/>} />
        </Route>
      </Route>
    </Route>

    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/dashboard' element={<Navigate to='/admin' replace />} />
   </Routes>
  )
}

export default MainRoutes



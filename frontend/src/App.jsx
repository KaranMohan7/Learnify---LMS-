import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './components/pages/studentpages/Home'
import Courselist from './components/pages/studentpages/Courselist'
import Coursedetails from './components/pages/studentpages/Coursedetails'
import Myenrollments from './components/pages/studentpages/Myenrollments'
import Player from './components/pages/studentpages/Player'
import Educator from './components/pages/educatorpages/Educator'
import Dashboard from './components/pages/educatorpages/Dashboard'
import Addcourse from './components/pages/educatorpages/Addcourse'
import Enrolledstudents from './components/pages/educatorpages/Enrolledstudents'
import Mycourses from './components/pages/educatorpages/Mycourses'
import Navbar from './components/student/Navbar'
import Navbareducator from './components/educator/Navbar'
import Footer from './components/student/Footer'
import "quill/dist/quill.snow.css";
import Loading from './components/student/Loading'
import { ToastContainer } from 'react-toastify'
import Routeprotector from './components/Protection/Routeprotector'
import FalsyPage from './components/FalsyPage'


const App = () => {

 const shownavbar = useMatch("/educator/*")

  return (
    <div className='w-full min-h-screen'>
      <ToastContainer />
      { shownavbar ? <Navbareducator /> : <Navbar />  }
      <Routes>
                 {/*  All the student routes */}
        <Route path='/' element={<Home />} ></Route>
        <Route path='/course-list' element={<Courselist />}></Route>
        <Route path='/course-list/:input' element={<Courselist />}></Route>
        <Route path='/course-details/:id' element={<Coursedetails />} ></Route>
        <Route path='/my-enrollments' element={ <Routeprotector><Myenrollments /></Routeprotector>}></Route>
        <Route path='/player/:courseId' element={<Routeprotector><Player /></Routeprotector>}></Route>
        <Route path='/loading/:path' element={<Loading />}></Route>
                 {/* all the educator routes  */}
        <Route path='/educator' element={<Routeprotector><Educator /></Routeprotector>} >
        <Route index element={<Dashboard />} />
        <Route path='add-courses' element={<Addcourse />} />
        <Route path='enrolled-students' element={<Enrolledstudents />} />
        <Route path='my-courses' element={<Mycourses />} />
        </Route>
        <Route path='*' element={<FalsyPage />} />
       </Routes>
      { shownavbar ? null : <Footer />  }
    </div>
  )
}

export default App
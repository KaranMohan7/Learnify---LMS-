import React, { lazy, Suspense } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify'
import Routeprotector from './components/Protection/Routeprotector'
import Loading from './components/student/Loading'
import Footer from './components/student/Footer'
import Navbareducator from './components/educator/Navbar'
import Navbar from './components/student/Navbar'
import Fallbackloading from './Fallbackloading';

const Home = lazy(() => import('./components/pages/studentpages/Home'));
const Courselist = lazy(() => import('./components/pages/studentpages/Courselist'));
const Coursedetails = lazy(() => import('./components/pages/studentpages/Coursedetails'));
const Myenrollments = lazy(() => import('./components/pages/studentpages/Myenrollments'));
const Player = lazy(() => import('./components/pages/studentpages/Player'));
const Educator = lazy(() => import('./components/pages/educatorpages/Educator'));
const Dashboard = lazy(() => import('./components/pages/educatorpages/Dashboard'));
const Addcourse = lazy(() => import('./components/pages/educatorpages/Addcourse'));
const Enrolledstudents = lazy(() => import('./components/pages/educatorpages/Enrolledstudents'));
const Mycourses = lazy(() => import('./components/pages/educatorpages/Mycourses'))
const FalsyPage = lazy(() => import('./components/FalsyPage'));

const App = () => {

 const shownavbar = useMatch("/educator/*")

  return (
    <div className='w-full min-h-screen'>
      <ToastContainer />
      { shownavbar ? <Navbareducator /> : <Navbar />  }
      <Suspense fallback={ <div className='w-full h-screen flex justify-center items-center'><Fallbackloading /></div>}>
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
       </Suspense>
      { shownavbar ? null : <Footer />  }
    </div>
  )
}

export default App
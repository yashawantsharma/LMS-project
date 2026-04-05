import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Both from './Component/Both'
import Hearder from './Component/Hearder'
import Allemploye from './Component/Allemploye'
import Allskill from './Component/Allskill'
import Allcoures from './Component/Allcoures'
import Allmapping from './Component/Allmapping'
import Allbatch from './Component/Allbatch'
import Sidebar from './Component/Sidebar'
import Allstudent from './Component/Allstudent'
import Alltutors from './Component/Alltutors'
import Dashboard from './Component/Dashboard'
import Visitors from './Component/Visitors'
import Fees from './Component/Fees'
import Timetable from './Component/Timetable'
import ProtectedRoute from "./Component/ProtectedRoute";
import StudentSidebar from './Component/StudentSidebar'
import StudentDashboard from './Component/StudentDashboard'
import StudentTimeTable from './Component/StudentTimeTable'
import HRSidebar from '../HR/HrSidebar'
import HRDashboard from '../HR/HrDashboard'
import Profile from './Component/Profile'
import Reset from './Component/Reset'
import HRTimeTable from '../HR/HrTimeTable'
import Tutors from '../HR/Tutors'
import FeesPayment from '../HR/FeesPayment'
import Batch from '../HR/Batch'
import Attendance from './Component/Attendance'
import CouresBatch from './Component/CouresBatch'

function App() {

  const role = (localStorage.getItem("role") || "")
  console.log(role);
  

  return (
    <BrowserRouter>

      <Hearder />

     
      {role === "admin" && <Sidebar />}
      {role === "student" && <StudentSidebar />}
      {role === "HR" && <HRSidebar />}

      <Routes>

      
        <Route path="/login" element={<Both />} />

       
     <Route
  path="/"
  element={
    <ProtectedRoute allowedRoles={["admin", "student", "HR"]}>
      {role === "student"
        ? <StudentDashboard />
        : role === "admin"
        ? <Dashboard />
        : <HRDashboard />}
    </ProtectedRoute>
  }
/>
      <Route
  path="/HRtimetable"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <HRTimeTable />
    </ProtectedRoute>
  }
/>
 <Route
  path="/batch"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <Batch />
    </ProtectedRoute>
  }
/>
 <Route
  path="/feespayment"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <FeesPayment />
    </ProtectedRoute>
  }
/>
    <Route
  path="/tutors"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <Tutors />
    </ProtectedRoute>
  }
/>
<Route
  path="/HR"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <HRDashboard />
    </ProtectedRoute>
  }
/>

       
        <Route
          path="/studentdashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/studenttimetable"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentTimeTable />
            </ProtectedRoute>
          }
        />

       
        <Route path="/allemploye" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Allemploye /></ProtectedRoute>} />
        <Route path="/allskill" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Allskill /></ProtectedRoute>} />
        <Route path="/allcoures" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Allcoures /></ProtectedRoute>} />
        <Route path="/allmapping" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Allmapping /></ProtectedRoute>} />
        <Route path="/allbatch" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Allbatch /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/allstudent" element={<ProtectedRoute allowedRoles={["admin"]}><Allstudent /></ProtectedRoute>} />
        <Route path="/alltutors" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Alltutors /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute allowedRoles={["admin"]}><Attendance /></ProtectedRoute>} />
        <Route path="/visitor" element={<ProtectedRoute allowedRoles={["admin"]}><Visitors /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Fees /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><Timetable /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin", "student", "HR"]}><Profile /></ProtectedRoute>} />
        <Route path="/reset" element={<ProtectedRoute allowedRoles={["admin", "student", "HR"]}><Reset /></ProtectedRoute>} />
        <Route path="/couresbatch" element={<ProtectedRoute allowedRoles={["admin", "HR"]}><CouresBatch /></ProtectedRoute>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App

import Dashboard from "../src/Pages/Dashboard"
import LandingPage from "./Pages/LandingPage"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProjectView from "../src/Pages/ProjectView"
import UserView from "../src/Pages/UserView"
import KanbanBoard from "../src/Pages/KanbanBoard"
import Board from "../src/Pages/Board"
import ErrorComponent from "./Components/Layout/ErrorComponent"
import AnalyticsDashboard from "./Pages/AnalyticsDashboard"
import RegisterPage from "./Pages/RegisterationPage"
import AuditLogView from "./Pages/AuditLogView"
import LoginPage from "./Pages/LoginPage"
import ForgetPasswordPage from "./Pages/ForgetPasswordPage"


const App : React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/registration" element={<RegisterPage/>}/>
          <Route path="/dashboard/:id" element={<Dashboard/>}/>
          <Route path="/projects/:id" element={<ProjectView/>}/>
          <Route path="/users/:id" element={<UserView/>}/>
          <Route path="/board/:id" element={<KanbanBoard/>}/>
          <Route path="/boards/:id" element={<Board/>}/>
          <Route path="/analytics/:id" element={<AnalyticsDashboard/>}/>
          <Route path="/audit-logs/:id" element={<AuditLogView/>}/>
          <Route path="/forgetpassword" element={<ForgetPasswordPage/>}/>
          <Route path="*" element={<ErrorComponent title="Page Not Found"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

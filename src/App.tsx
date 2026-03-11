import Dashboard from "../src/Pages/Dashboard"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProjectView from "../src/Pages/ProjectView"
import UserView from "../src/Pages/UserView"
import KanbanBoard from "../src/Pages/KanbanBoard"
import Board from "../src/Pages/Board"
import ErrorComponent from "./Components/Layout/ErrorComponent"
import AnalyticsDashboard from "./Pages/AnalyticsDashboard"


const App : React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/projects" element={<ProjectView/>}/>
          <Route path="/users" element={<UserView/>}/>
          <Route path="/board/:id" element={<KanbanBoard/>}/>
          <Route path="/boards" element={<Board/>}/>
          <Route path="/analytics" element={<AnalyticsDashboard/>}/>
          <Route path="*" element={<ErrorComponent title="Page Not Found"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

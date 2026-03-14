import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '../components/Header'
import { HomePage } from '../views/HomePage'

export const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

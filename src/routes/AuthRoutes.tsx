import { Navigate, Route, Routes } from 'react-router-dom'
const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<h1>Login</h1>} />
            <Route path='/*' element={<Navigate to="/login" />} />
        </Routes>
    )
}
export default AuthRoutes
import { Route, Routes } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { Layout } from '../components/Layout/Layout'
// import AuthRoutes from './AuthRoutes'

const AppRouter = () => {

    return (
        <Routes>
            {/* {
                (status === 'authenticated')
                    ? <Route path="/*" element={<AppRoutes />} />
                    : <Route path="/auth/*" element={<AuthRoutes />} />
            } */}
            <Route path="/*" element={
                <Layout>
                    <AppRoutes />
                </Layout>} 
                />
        </Routes>
    )
}
export default AppRouter
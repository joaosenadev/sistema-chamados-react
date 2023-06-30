import { Routes, Route } from "react-router-dom"

//Pages
import Private from "./Private"

import Login from "../pages/Login"
import Register from "../pages/Register"

import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"
import Customers from "../pages/Customers"
import New from "../pages/New"

export default function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
            <Route path="/profile" element={<Private><Profile /></Private>} />
            <Route path="/customers" element={<Private><Customers /></Private>} />

            <Route path="/new" element={<Private><New /></Private>} />
            <Route path="/new/:id" element={<Private><New /></Private>} />
        </Routes>
    )
}

import React from "react";

import { Navigate, Route, Routes } from "react-router";

import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import AddUser from "../pages/AddUser";
import Users from "../pages/Users";
import EditUser from "../pages/EditUser";
import { useAuth } from "../hooks/auth";

import ProtectedRoute from "./ProtectedRoute";
import Clients from "../pages/Clients";
import Contracts from "../pages/Contracts";
import PlacesToEat from "../pages/PlacesToEat";
import AddPlaceToEat from "../pages/AddPlaceToEat";
import EditPlaceToEat from "../pages/EditPlaceToEat";

const RoutesApp: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute user={user}>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contratos"
        element={
          <ProtectedRoute user={user}>
            <Contracts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lugares-para-comer"
        element={
          <ProtectedRoute user={user}>
            <PlacesToEat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lugares-para-comer/add"
        element={
          <ProtectedRoute user={user}>
            <AddPlaceToEat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lugares-para-comer/:id"
        element={
          <ProtectedRoute user={user}>
            <EditPlaceToEat />
          </ProtectedRoute>
        }
      />

      {user?.role === "admin" && (
        <>
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute user={user}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/add"
            element={
              <ProtectedRoute user={user}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/:id"
            element={
              <ProtectedRoute user={user}>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </>
      )}

      <Route
        path="*"
        element={<Navigate to={user ? "/contratos" : "/signin"} replace />}
      />
    </Routes>
  );
};

export default RoutesApp;

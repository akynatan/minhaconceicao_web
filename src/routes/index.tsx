import React from "react";

import { Navigate, Route, Routes } from "react-router";

import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import AddUser from "../pages/AddUser";
import Users from "../pages/Users";
import EditUser from "../pages/EditUser";
import { useAuth } from "../hooks/auth";

import ProtectedRoute from "./ProtectedRoute";
import PlacesToEat from "../pages/PlacesToEat";
import AddPlaceToEat from "../pages/AddPlaceToEat";
import EditPlaceToEat from "../pages/EditPlaceToEat";
import PlacesToSleep from "../pages/PlacesToSleep";
import AddPlaceToSleep from "../pages/AddPlaceToSleep";
import EditPlaceToSleep from "../pages/EditPlaceToSleep";
import Attractions from "../pages/Attractions";
import AddAttraction from "../pages/AddAttraction";
import EditAttraction from "../pages/EditAttraction";
import Guides from "../pages/Guides";
import AddGuide from "../pages/AddGuide";
import EditGuide from "../pages/EditGuide";
import Producers from "../pages/Producers";
import AddProducer from "../pages/AddProducer";
import EditProducer from "../pages/EditProducer";
import Companies from "../pages/Companies";
import AddCompany from "../pages/AddCompany";
import EditCompany from "../pages/EditCompany";
import Jobs from "../pages/Jobs";
import AddJob from "../pages/AddJob";
import EditJob from "../pages/EditJob";
import NewsPage from "../pages/News";
import AddNews from "../pages/AddNews";
import EditNews from "../pages/EditNews";
import Events from "../pages/Events";
import AddEvent from "../pages/AddEvent";
import EditEvent from "../pages/EditEvent";
import Artisans from "../pages/Artisans";
import AddArtisan from "../pages/AddArtisan";
import EditArtisan from "../pages/EditArtisan";
import TermsOfUse from "../pages/TermsOfUse";
import PrivacyPolicy from "../pages/PrivacyPolicy";

const RoutesApp: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/termos-de-uso" element={<TermsOfUse />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <Profile />
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
      <Route
        path="/lugares-para-dormir"
        element={
          <ProtectedRoute user={user}>
            <PlacesToSleep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lugares-para-dormir/add"
        element={
          <ProtectedRoute user={user}>
            <AddPlaceToSleep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lugares-para-dormir/:id"
        element={
          <ProtectedRoute user={user}>
            <EditPlaceToSleep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atracoes"
        element={
          <ProtectedRoute user={user}>
            <Attractions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atracoes/nova"
        element={
          <ProtectedRoute user={user}>
            <AddAttraction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atracoes/:id"
        element={
          <ProtectedRoute user={user}>
            <EditAttraction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guias"
        element={
          <ProtectedRoute user={user}>
            <Guides />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guias/novo"
        element={
          <ProtectedRoute user={user}>
            <AddGuide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guias/:id"
        element={
          <ProtectedRoute user={user}>
            <EditGuide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtores"
        element={
          <ProtectedRoute user={user}>
            <Producers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtores/novo"
        element={
          <ProtectedRoute user={user}>
            <AddProducer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtores/:id"
        element={
          <ProtectedRoute user={user}>
            <EditProducer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empresas"
        element={
          <ProtectedRoute user={user}>
            <Companies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empresas/nova"
        element={
          <ProtectedRoute user={user}>
            <AddCompany />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empresas/:id"
        element={
          <ProtectedRoute user={user}>
            <EditCompany />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vagas"
        element={
          <ProtectedRoute user={user}>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vagas/nova"
        element={
          <ProtectedRoute user={user}>
            <AddJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vagas/:id"
        element={
          <ProtectedRoute user={user}>
            <EditJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/noticias"
        element={
          <ProtectedRoute user={user}>
            <NewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/noticias/nova"
        element={
          <ProtectedRoute user={user}>
            <AddNews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/noticias/:id"
        element={
          <ProtectedRoute user={user}>
            <EditNews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <ProtectedRoute user={user}>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos/novo"
        element={
          <ProtectedRoute user={user}>
            <AddEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos/:id"
        element={
          <ProtectedRoute user={user}>
            <EditEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artesaos"
        element={
          <ProtectedRoute user={user}>
            <Artisans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artesaos/novo"
        element={
          <ProtectedRoute user={user}>
            <AddArtisan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artesaos/:id"
        element={
          <ProtectedRoute user={user}>
            <EditArtisan />
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
        element={<Navigate to={user ? "/atracoes" : "/signin"} replace />}
      />
    </Routes>
  );
};

export default RoutesApp;

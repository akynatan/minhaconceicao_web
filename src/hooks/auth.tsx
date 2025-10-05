import React, { createContext, useCallback, useState, useContext } from "react";
import apipublic from "../services/apipublic";

export interface User {
  role: string;
  id: string;
  name: string;
  email: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

interface AuthState {
  token: string;
  user: User | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@MinhaConceicaoWeb:token");
    const user = localStorage.getItem("@MinhaConceicaoWeb:user");

    if (user && token) {
      apipublic.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await apipublic.post("/sessions/admin", {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("@MinhaConceicaoWeb:token", token);
    localStorage.setItem("@MinhaConceicaoWeb:user", JSON.stringify(user));

    apipublic.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@MinhaConceicaoWeb:token");
    localStorage.removeItem("@MinhaConceicaoWeb:user");

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });

      localStorage.setItem("@MinhaConceicaoWeb:user", JSON.stringify(user));
    },
    [data.token, setData]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthContext, AuthProvider, useAuth };

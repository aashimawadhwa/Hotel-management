"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, doc, setDoc } from "../../../config/firebase";
import { getDoc } from "firebase/firestore";
import { InterfaceUser } from "@/utils/types/types";

interface AuthContextProps {
  user: InterfaceUser | null;
  token: string;
  login: (email: string, password: string) => Promise<InterfaceUser | null>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<InterfaceUser | null>;
  googleSignIn: () => Promise<InterfaceUser | null>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<InterfaceUser | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      setUser(savedUser);
    }

    const unsubscribe = onAuthStateChanged(auth as Auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        const userData = userDoc.data();
        const user = {
          ...userData,
          uid: authUser.uid as string,
        } as InterfaceUser;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        const token = await authUser.getIdToken();
        localStorage.setItem("token", token);
        setToken(token);
        setLoading(false);
      } else {
        localStorage.removeItem("user");
        setUser(null);
        localStorage.removeItem("token");
        setToken("");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const token = await user.getIdToken();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userData, uid: user.uid })
        );
        localStorage.setItem("token", token);
        setLoading(false);
        return { ...userData, uid: user.uid as string };
      }
    }
    setLoading(false);
    return null;
  };

  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<any> => {
    setLoading(true);
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    let userData;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userData = userDoc.data();
        const token = await user.getIdToken();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userData, uid: user.uid })
        );
        localStorage.setItem("token", token);
        try {
          await setDoc(doc(db, "users", user.uid), {
            username,
            email,
            userType: "admin",
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    setLoading(false);
    return {};
  };

  const googleSignIn = async (): Promise<any> => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    let userData;
    let token;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userData = userDoc.data();
        token = await user.getIdToken();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userData, uid: user.uid })
        );
        localStorage.setItem("token", token);
      } else {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          userType: "user",
        });
        userData = { username: user.displayName, email: user.email };
        token = await user.getIdToken();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userData, uid: user.uid })
        );
        localStorage.setItem("token", token);
      }
    }
    setLoading(true);
    return { ...userData, uid: user?.uid as string };
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const value: AuthContextProps = {
    user,
    token,
    login,
    signup,
    googleSignIn,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

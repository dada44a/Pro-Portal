import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Card, CardBody, CardDescription, CardTitle } from '../components/Card';

import { toast } from "react-toastify";
import { useLocalMutation } from '#/hooks/UseLocalQuery';
import { useState } from 'react';
import { useAuth } from '#/context/AuthContext';



export const Route = createFileRoute('/')({ component: App })


function App() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const mutation = useLocalMutation({
    onSuccess: async (data: any) => {
      console.log("Login successful:", data);
      toast.success("Login successful!");
      await refreshUser();
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    },
  })
  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({
      url: "/auth/login",
      method: "POST",
      data: {
        email: formData.email,
        password: formData.password,
      },
    });

  }
  return (
    <main className="page-wrap">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card>
          <CardBody>
            <CardTitle title="Login" className="text-2xl font-bold mb-3" />
            <CardDescription>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" className="input input-bordered" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input type="password" placeholder="Password" className="input input-bordered" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button className="btn btn-primary w-full" type="submit">Login</button>
              </form>

              <Link to="/register" className="text-black">
                Don't have an account? Register here
              </Link>
            </CardDescription>
          </CardBody>
        </Card>

      </div>
    </main>
  )
}



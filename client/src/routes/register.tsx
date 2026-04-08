import { Card, CardBody, CardDescription, CardTitle } from '#/components/Card';
import { useLocalMutation } from '#/hooks/UseLocalQuery';
import { SignupSchema } from '#/utils/ZodSSchema';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})
import { useState } from "react";
import { toast } from 'react-toastify';

interface SignupFormState {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
}

function RouteComponent() {
  const navigate = useNavigate();
  const paramFunction = {
    onSuccess: (data: any) => {
      console.log("Signup successful:", data);
      toast.success("Signup successful!");
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    },
  }

  const mutation = useLocalMutation(paramFunction);

  const [formState, setFormState] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const result = SignupSchema.safeParse(formState);
    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }

    mutation.mutate({
      url: "/auth/register",
      method: "POST",
      data: {
        firstName: formState.firstName,
        lastName: formState.lastName,
        username: formState.username,
        email: formState.email,
        password: formState.password,
        confirmPassword: formState.confirmPassword
      }
    });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card>
        <CardBody>
          <CardTitle title="Signup" className="text-2xl font-bold mb-3" />
          <CardDescription>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="First Name" className="input input-bordered" required value={formState.firstName} onChange={(e) => setFormState({ ...formState, firstName: e.target.value })} />
              <input type="text" placeholder="Last Name" className="input input-bordered" required value={formState.lastName} onChange={(e) => setFormState({ ...formState, lastName: e.target.value })} />
              <input type="text" placeholder="Username" className="input input-bordered" required value={formState.username} onChange={(e) => setFormState({ ...formState, username: e.target.value })} />
              <input type="email" placeholder="Email" className="input input-bordered" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
              <input type="password" placeholder="Password" className="input input-bordered" required value={formState.password} onChange={(e) => setFormState({ ...formState, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" className="input input-bordered" required value={formState.confirmPassword} onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })} />
              <button className="btn btn-primary w-full" type="submit">Sign Up</button>
            </form>
            <Link to="/" className="text-black">
              Already have an account? Login here
            </Link>
          </CardDescription>
        </CardBody>
      </Card>

    </div>
  )
}



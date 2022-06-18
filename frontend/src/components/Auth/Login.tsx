import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { onError } from "lib/errors";
import useStore from 'store'
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {LoadingButton} from "@mui/lab";
import Stack from "@mui/material/Stack";

const LoginForm = z.object({
  email: z.string().email(),
  password: z.string().min(3)
})
type LoginForm = z.infer<typeof LoginForm>

export default function Login() {
  const setAuthenticated = useStore(store => store.setAuthenticated)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginForm)
  });
  const onSubmit = async ({email, password}: LoginForm) => {
    setIsLoading(true);
    try {
      await Auth.signIn(email, password);
      setAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <Stack
      component="form"
      spacing={3}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("email")}
        label="Email"
        variant="outlined"
      />
      <TextField
        {...register("password")}
        type="password"
        label="Password"
        variant="outlined"
      />
      <LoadingButton
        loading={isLoading}
        variant="outlined"
        type="submit"
      >Login</LoadingButton>
    </Stack>
  );
}

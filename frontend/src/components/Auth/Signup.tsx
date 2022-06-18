import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "lib/errors";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useStore from "../../store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

const SignupForm = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  confirmPassword: z.string().min(3),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
})
type SignupForm = z.infer<typeof SignupForm>

const ConfirmForm = z.object({
  confirmationCode: z.string().min(1)
})
type ConfirmForm = z.infer<typeof ConfirmForm>

interface NewUser {
  newUser: unknown
  email: string
  password: string
}
export default function Signup() {
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [newUser, setNewUser] = useState<NewUser | null>(null)
  const setAuthenticated = useStore(store => store.setAuthenticated)

  const confirmForm = useForm<ConfirmForm>({
    resolver: zodResolver(ConfirmForm)
  });
  // const { register, handleSubmit, formState: { errors } } = confirmForm
  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(SignupForm)
  });

  async function submitConfirm({confirmationCode}: ConfirmForm) {
    if (!newUser) {return}
    const {email, password} = newUser
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      setAuthenticated(true);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function submitSignup(form: SignupForm) {
    const {email, password} = form
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
      })
      setIsLoading(false)
      setNewUser({newUser, email, password});
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirm() {
    const {register, handleSubmit} = confirmForm
    return <Stack
      component="form"
      spacing={3}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitConfirm)}
    >
      <TextField
        {...register("confirmationCode")}
        label="Confirmation Code"
        variant="outlined"
        type="tel"
        autoFocus
        helperText="Please check your email for the code."
      />
      <LoadingButton
        type="submit"
        variant="outlined"
        loading={isLoading}
      >
        Verify
      </LoadingButton>
    </Stack>
  }

  function renderForm() {
    const {register, handleSubmit} = signupForm
    return <Stack
      component="form"
      spacing={3}
      noValidate
      onSubmit={handleSubmit(submitSignup)}
    >
      <TextField
        {...register("email")}
        label="Email"
        variant="outlined"
        autoFocus
      />
      <TextField
        {...register("password")}
        label="Password"
        variant="outlined"
        type="password"
      />
      <TextField
        {...register("confirmPassword")}
        label="Confirm Password"
        variant="outlined"
        type="password"
      />
      <LoadingButton
        type="submit"
        variant="outlined"
        loading={isLoading}
      >
        Signup
      </LoadingButton>
    </Stack>
  }

  return newUser === null ? renderForm() : renderConfirm()
}

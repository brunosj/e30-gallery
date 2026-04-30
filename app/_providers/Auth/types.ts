import type { User } from '../../payload-types'

 
export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<User>

export type ForgotPassword = (args: { email: string }) => Promise<User>  

export type Create = (args: {
  email: string
  password: string
  firstName: string
  lastName: string
}) => Promise<User>  

export type Login = (args: { email: string; password: string }) => Promise<User>  

export type Logout = () => Promise<void>

export interface AuthContext {
  user?: User | null
  setUser: (user: User | null) => void  
  logout: Logout
  login: Login
  create: Create
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
}

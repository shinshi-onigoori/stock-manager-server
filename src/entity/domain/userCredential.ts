export type SigninCredential = {
    password: string
    email: string
}

export type SignupCredential = SigninCredential & {
    displayName: string
}
import { ApiError, type SignInMethod } from "@halfnote/data";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { INK, SUB } from "../../components";
import { googleIdToken } from "../../lib/google";
import { Field, FieldError, Frame, Heading, OFFLINE, PrimaryButton } from "../../features/onboarding/bits";
import { signIn } from "../../lib/session";
import { F } from "../../features/story/kit";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const COPY = {
  create: {
    title: "Create your account",
    action: "Create account",
    swap: "Already have an account? Sign in",
    other: "login",
    loginLabel: "Email",
    loginContent: "emailAddress",
    passwordContent: "newPassword",
    passwordRules: "minlength: 8; required: lower; required: upper; required: digit; required: [-!@#$%^&*()_+=[{}|;:,.<>?];",
    rules: "At least 8 characters, with an uppercase letter, a lowercase letter, a number and a symbol.",
  },
  login: {
    title: "Welcome back",
    action: "Sign in",
    swap: "New here? Create an account",
    other: "create",
    loginLabel: "Email or username",
    loginContent: "username",
    passwordContent: "password",
    passwordRules: undefined,
    rules: undefined,
  },
} as const;

function canSubmit(creating: boolean, login: string, password: string) {
  if (creating) return EMAIL.test(login.trim()) && password.length >= 8;
  return !!login.trim() && !!password;
}

interface Errors {
  login?: string;
  password?: string;
  google?: string;
  form?: string;
}

function errorsFrom(e: unknown, kind: SignInMethod["kind"]): Errors {
  if (kind === "google") return { google: e instanceof ApiError ? e.message : "Couldn't sign in with Google. Try again." };
  if (!(e instanceof ApiError)) return { form: OFFLINE };
  if (e.status === 401) return { password: "That login and password don't match." };
  const { email, password } = e.fields;
  if (!email && !password) return { form: e.message };
  return { login: email === "taken" ? "That email already has an account." : email, password };
}

export default function SignIn() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<keyof typeof COPY>(params.mode === "create" ? "create" : "login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState<SignInMethod["kind"] | null>(null);
  const creating = mode === "create";
  const ready = canSubmit(creating, login, password);
  const copy = COPY[mode];

  // The root layout's protected routes move on once the session exists.
  async function run(kind: SignInMethod["kind"], method: () => Promise<SignInMethod | null>) {
    if (pending) return;
    setPending(kind);
    setErrors({});
    try {
      const m = await method();
      if (m) await signIn(m);
    } catch (e) {
      setErrors(errorsFrom(e, kind));
    } finally {
      setPending(null);
    }
  }

  const submit = () => {
    if (!ready) return;
    const name = login.trim();
    if (creating) void run("register", async () => ({ kind: "register", email: name, password }));
    else void run("login", async () => ({ kind: "login", login: name, password }));
  };

  const google = () =>
    run("google", async () => {
      const idToken = await googleIdToken();
      return idToken ? { kind: "google", idToken } : null;
    });

  return (
    <Frame footer={<PrimaryButton label={copy.action} onPress={submit} disabled={!ready} pending={pending === "login" || pending === "register"} />}>
      <View style={s.heading}>
        <Heading>{copy.title}</Heading>
      </View>
      <Field
        label={copy.loginLabel}
        placeholder="you@example.com"
        value={login}
        onChangeText={setLogin}
        error={errors.login}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType={copy.loginContent}
        testID="login"
      />
      <Field
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        textContentType={copy.passwordContent}
        passwordRules={copy.passwordRules}
        returnKeyType="go"
        onSubmitEditing={submit}
        testID="password"
      />
      {copy.rules && <Text style={s.rules}>{copy.rules}</Text>}
      <FieldError text={errors.form} />
      <Pressable
        role="button"
        hitSlop={8}
        style={s.swap}
        onPress={() => {
          setMode(copy.other);
          setErrors({});
        }}
      >
        <Text style={s.swapText}>{copy.swap}</Text>
      </Pressable>
      <View aria-hidden style={s.or}>
        <View style={s.line} />
        <Text style={s.orText}>or</Text>
        <View style={s.line} />
      </View>
      <Pressable role="button" aria-disabled={!!pending} disabled={!!pending} onPress={google} style={({ pressed }) => [s.provider, pressed && s.pressed]}>
        <Svg width={17} height={17} viewBox="0 0 18 18">
          <Path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2.1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" />
          <Path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.9.9-3.1.9-2.3 0-4.3-1.6-5-3.7H1v2.3C2.5 16 5.5 18 9 18z" />
          <Path fill="#FBBC05" d="M4 10.8c-.2-.5-.3-1.1-.3-1.8s.1-1.2.3-1.8V4.9H1C.4 6.1 0 7.5 0 9s.4 2.9 1 4.1l3-2.3z" />
          <Path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.5 2 1 4.9l3 2.3c.7-2.1 2.7-3.6 5-3.6z" />
        </Svg>
        <Text style={s.providerText}>Continue with Google</Text>
      </Pressable>
      <FieldError text={errors.google} />
    </Frame>
  );
}

const s = StyleSheet.create({
  heading: { marginBottom: 8 },
  rules: { paddingHorizontal: 14, fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: SUB },
  swap: { alignSelf: "flex-start", minHeight: 36, justifyContent: "center" },
  swapText: { fontFamily: F.sans, fontSize: 14, color: INK, textDecorationLine: "underline" },
  or: { marginTop: 14, marginBottom: 4, flexDirection: "row", alignItems: "center", gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#D6D6D6" },
  orText: { fontFamily: F.sans, fontSize: 12, color: "#8A8A8A" },
  provider: { minHeight: 50, borderRadius: 12, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  providerText: { fontFamily: F.sans600, fontSize: 15, color: INK },
  pressed: { transform: [{ scale: 0.97 }] },
});

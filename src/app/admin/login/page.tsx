"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button/Button";
import { loginAction, LoginState } from "./actions";
import styles from "./login.module.scss";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Riam Ensiling</h1>
          <p className={styles.subtitle}>Panel Kontrol Admin Operasional</p>
        </div>

        {state?.error && (
          <div className={styles.alertError} role="alert">
            {state.error}
          </div>
        )}

        <form action={formAction} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@riamensiling.id"
              className={[
                styles.input,
                state?.fieldErrors?.email ? styles["input--error"] : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            {state?.fieldErrors?.email && (
              <span className={styles.errorText}>
                {state.fieldErrors.email[0]}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={[
                styles.input,
                state?.fieldErrors?.password ? styles["input--error"] : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            {state?.fieldErrors?.password && (
              <span className={styles.errorText}>
                {state.fieldErrors.password[0]}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isPending}
          >
            Masuk ke Dashboard
          </Button>
        </form>
      </div>
    </main>
  );
}

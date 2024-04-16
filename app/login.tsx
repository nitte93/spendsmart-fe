// app/page/login.tsx
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      ) : (
        <div>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}

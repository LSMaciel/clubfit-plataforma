
import { signIn } from '@/app/auth/actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            ClubFit
          </h1>
          <h2 className="mt-2 text-sm text-slate-600">
            Acesso Corporativo
          </h2>
        </div>

        <form className="mt-8 space-y-6" action={signIn}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Endereço de Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Endereço de Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {searchParams?.message && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 text-center">
              {searchParams.message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        &copy; 2024 ClubFit. Todos os direitos reservados.
      </p>
    </div>
  )
}

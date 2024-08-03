import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="bg-base-200 w-full relative isolate px-6 lg:px-8">
        <div className="max-w-screen-sm mx-auto py-24">
          {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Integrate with a Custom LangServe Instance 🦜{' '}
              <Link href="/docs/ab-test-cusom-langserve" className="font-semibold">
                <span className="absolute inset-0" />
                Read now <span>&rarr;</span>
              </Link>
            </div>
          </div> */}
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              <p className="mb-2">
                Don't build prompts on vibes 🏖️🦀
              </p>
              <b className="text-primary">Use Science 🦛✅</b>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Side-by-side LLM prompt testing suite to ensure robustness, reliability, and safety of your prompts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/app"
                className="btn btn-primary text-white"
              >
                Get started
              </Link>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                View Demo <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-100 w-full relative isolate px-6 lg:px-8">
        <div className="px-4 lg:px-24 w-full mx-auto py-24">
          <div className="text-left">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Good prompts are <span className="text-amber-600 text-bold">worth GOLD</span>
            </h1>
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 m-16 lg:px-16">
              <div className="card bg-white border w-full shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    🕒 Time is Money
                  </h2>
                  <p>
                    Testing LLM prompts is time consuming. Prompt Hippo saves you time with a set of tools
                    designed to streamline the process.
                  </p>
                </div>
              </div>

              <div className="card bg-white border w-full shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    🦜 Test Custom Agents or LLMs
                  </h2>
                  <p>
                    We've <Link href={"/docs/ab-test-custom-langserve"} className="font-bold underline">integrated with LangServe 🦜</Link>
                    to allow you to test custom agents and optimize them to be reliable, foolproof, and ready for production.
                  </p>
                </div>
              </div>

              <div className="card bg-white border w-full shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    🗑️❌ Don't Throw Away Good Prompts
                  </h2>
                  <p>
                    See the side-by-side output of your prompt versus other prompts you are testing, so that you know
                    which prompt is <i><b>ACTUALLY</b></i> the best.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-200 w-full relative isolate px-6 lg:px-8">
        <div className="px-4 lg:px-24 w-full mx-auto pb-24 pt-24">
          <div className="text-left">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Side-by-side Prompt Testing
            </h1>
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 m-16 lg:px-16">
              <div className="grid grid-cols-1 gap-2">
                <div className="card bg-white border w-full shadow-xl">
                  <div className="card-body">
                    <p className="text-sm text-slate-600">
                      System
                    </p>
                    <p className="text-slate-900">
                      You are acting like a Hippo. Respond in JSON format.
                    </p>
                  </div>
                </div>

                <div className="card bg-white border w-full shadow-xl">
                  <div className="card-body">
                    <p className="text-sm text-slate-600">
                      Human
                    </p>
                    <p className="text-slate-900">
                      Hello!
                    </p>
                  </div>
                </div>

                <div className="card bg-white border w-full shadow-xl border-red-700">
                  <div className="card-body">
                    <p className="text-sm text-red-700">
                      Error! Invalid JSON.
                    </p>
                    <p className="text-sm text-slate-600">
                      AI
                    </p>
                    <pre className="whitespace-pre-wrap">```json{"{"}"response": "Hello! I'm a hippo, ready to chat! What would you like to know?"{"}"}```</pre>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="card bg-white border w-full shadow-xl">
                  <div className="card-body">
                    <p className="text-sm text-slate-600">
                      System
                    </p>
                    <p className="text-slate-900">
                      You are acting like a Hippo. Respond in JSON format, without markdown.
                    </p>
                  </div>
                </div>

                <div className="card bg-white border w-full shadow-xl">
                  <div className="card-body">
                    <p className="text-sm text-slate-600">
                      Human
                    </p>
                    <p className="text-slate-900">
                      Hello!
                    </p>
                  </div>
                </div>

                <div className="card bg-white border w-full shadow-xl border-green-700">
                  <div className="card-body">
                    <p className="text-sm text-green-700">
                      Valid JSON.
                    </p>
                    <p className="text-sm text-slate-600">
                      AI
                    </p>
                    <pre className="whitespace-pre-wrap">{"{"}"response": "Hello! I'm a hippo, ready to chat! What would you like to know?"{"}"}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-100 w-full relative isolate px-6 lg:px-8">
        <div className="px-4 lg:px-24 w-full mx-auto py-24">
          <div className="text-left">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Get Started
            </h1>
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 m-16 lg:px-16">
              <div className="card bg-white border w-full shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    Use Prompt Hippo
                  </h2>
                  <p>
                    Get Started for Free Today.
                  </p>
                  <Link href={"/app"}>
                    <button className="btn btn-primary text-white w-full">
                      Use Prompt Hippo 🦛
                    </button>
                  </Link>
                </div>
              </div>

              <div className="card bg-white border w-full shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    See Our Blog
                  </h2>
                  <p>
                    Learn More About Prompt Hippo
                  </p>
                  <Link href={"/docs"}>
                    <button className="btn btn-secondary text-white w-full">
                      Read the Blog 📚
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer bg-base-200 text-base-content p-10">
        <aside>
          <span className="text-6xl">
            🦛
          </span>
          <p>
            Prompt Hippo
            <br />
            A project by <Link href={"https://jonyork.net"} className="font-bold underline">Jon York</Link>
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link href={"/app"} className="link link-hover">App</Link>
          <Link href={"/docs"} className="link link-hover">Documentation</Link>
          <Link href={"/auth/login"} className="link link-hover">Login / Sign up</Link>
          <Link href={"/pricing"} className="link link-hover">Pricing</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Contact</h6>
          <Link href={"mailto:york.jon.2005@gmail.com"} className="link link-hover">york.jon.2005@gmail.com</Link>
          <Link href={"https://twitter.com/jonyorked"} className="link link-hover">Twitter</Link>
        </nav>
      </footer>
    </>
  );
}

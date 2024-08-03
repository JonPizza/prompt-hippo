# Create a Custom LangServe 🦜 Instance + Use Chat Playground

Jon York

The [LangChain](https://www.langchain.com/) ecosystem
offers many powerful tools for developers to build and deploy
LLM agents, one of which is [LangServe](https://github.com/langchain-ai/langserve). With a custom LangServe instancem
you can add in custom tools, better monitor your agent's performance, quickly deploy to production, and fine tune all parameters.

## Create a LangServe Instance

### Installing LangServe

To install LangServe, use pip:

```
pip install "langserve[all]"
```

After installation, you can create a new app by running `langchain app new my-app`, which 
will create a LangServe project inside of the directory `my-app`. The default project
structure will look like this:

```
.
├── app
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-311.pyc
│   │   └── server.cpython-311.pyc
│   └── server.py
├── Dockerfile
├── packages
│   └── README.md
├── pyproject.toml
└── README.md
```

LangServe uses [Poetry](https://python-poetry.org/) for dependency management, so to 
install the dependencies, run `poetry install` in the root directory of the project.

We will also be using OpenAI's LLMs for this tutorial, so install the relevant LangChain module as well:

```
poetry add langchain-openai
```

After, we can try running the server!

```
jon@pizza:~/my-app$ poetry run python3 app/server.py
Traceback (most recent call last):
  File "/home/jon/my-app/app/server.py", line 14, in <module>
    add_routes(app, NotImplemented)
  File "/home/jon/.cache/pypoetry/virtualenvs/my-app-8Bosof5w-py3.11/lib/python3.11/site-packages/langserve/server.py", line 396, in add_routes
    raise TypeError(
TypeError: Expected a Runnable, got <class 'NotImplementedType'>. The second argument to add_routes should be a Runnable instance.add_route(app, runnable, ...) is the correct usage.Please make sure that you are using a runnable which is an instance of langchain_core.runnables.Runnable.
```

Ahhh... rats.

### Creating a Runnable

In `app/server.py`, the default call to `add_routes` is done with `NotImplemented`:

```
add_routes(app, NotImplemented)
```

It expects a [LangChain runnable](https://python.langchain.com/v0.1/docs/expression_language/interface/).

The most basic runnable to build is a Prompt + LLM combo. It's best to place
runnables you build in a seperate directory and import them into `server.py`.

Create a new directory inside `app/` and call it `agents/`, and don't forget to add an `__init__.py` file inside `agents/`
so that we can import from it! Inside the `agents/` directory, create a `basic_agent.py` file, which is where we will create
our first runnable. (Exciting, I know!) 

```
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model='gpt-4o-mini')
template = ChatPromptTemplate(
    [
        ('placeholder', '{messages}')
    ]
)
runnable = template | model | StrOutputParser()
```

> Make sure you have set `OPENAI_API_KEY` in your environment!

We need the `StrOutputParser()` in order to make this work with the latest version of the playground, which we will use later in this tutorial!

You can read more about creating advanced runnables [here](https://python.langchain.com/v0.1/docs/get_started/quickstart/).

### Importing to Server

Import your runnable to the server by adding an import statement at the top:

```
from app.agents.basic_agent import runnable
```

Then, put the runnable in the `add_routes` function:

```
add_routes(app, runnable)
```

Finally, we get to run the server! 🥳🥳

```
jon@pizza:~/my-app$ poetry run python3 app/server.py
INFO:     Started server process [45386]
INFO:     Waiting for application startup.

 __          ___      .__   __.   _______      _______. _______ .______     ____    ____  _______
|  |        /   \     |  \ |  |  /  _____|    /       ||   ____||   _  \    \   \  /   / |   ____|
|  |       /  ^  \    |   \|  | |  |  __     |   (----`|  |__   |  |_)  |    \   \/   /  |  |__
|  |      /  /_\  \   |  . `  | |  | |_ |     \   \    |   __|  |      /      \      /   |   __|
|  `----./  _____  \  |  |\   | |  |__| | .----)   |   |  |____ |  |\  \----.  \    /    |  |____
|_______/__/     \__\ |__| \__|  \______| |_______/    |_______|| _| `._____|   \__/     |_______|

LANGSERVE: Playground for chain "/" is live at:
LANGSERVE:  │
LANGSERVE:  └──> /playground/
LANGSERVE:
LANGSERVE: See all available routes at /docs/

INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## LangServe Playground

Check out the default playground

![langserve default playground](/images/langserve-default.png)

🤮🤮🤮

Yucky!!!

Luckily, LangServe just released a new playground which has a interface much more
similar to the chatbots that we are already familiar with.

It's easy to use, just change the call to `add_routes` from:

```
add_routes(app, runnable)
```

To

```
add_routes(app, runnable, playground_type='chat')
```

Just like that, we've got a playground that's 10x nicer:

![langserve chat playground](/images/langserve-chat.png)

Also, if you want a playground that's **100x** nicer, check out
[Prompt Hippo](/). It allows you to interface with custom langserve 
instances and test prompts side-by-side-by-side-by-side-by... well,
you get the point. It's free to use with `gpt-4o-mini`. Stop creating prompts
on vibes 🏖️... use science 🧪!

![Prompt Hippo user interface](/images/jp-ui.png)

[Try it now!](/app)
# AB Test Prompts on a Custom LangServe 🦜 Instance

Jon York

The [LangChain](https://www.langchain.com/) ecosystem
offers many powerful tools for developers to build and deploy
LLM agents, one of which is [LangServe](https://github.com/langchain-ai/langserve). In this tutorial, you will learn
how to A/B/C/D/E... test your custom LangServe instance with different prompts using [Prompt Hippo](/), a tool that lets you
quickly compare, test, and validate prompts and models side-by-side.

A custom LangServe instance will allow you to add in custom tools, better monitor your agent's performance, quickly deploy to production, and fine tune all parameters.

## Create a LangServe Instance

Follow [this tutorial](/docs/create-a-langserve-project) in order to create a 
LangServe project that interfaces with the LangServe built-in chat playground. 
It's crucial that your LangServe instances takes in a list of messages and returns a string.
That's the only way that the playground will render properly, and you will see some
strange Pydantic errors if it doesn't. Also, Prompt Hippo uses the 
same format as this playground, so make sure it's working properly for seamless integration!

## Add CORS Headers

When using Prompt Hippo, you will need to open up your allowed origins for requests from 
`https://prompthippo.net.com`, otherwise the browser will block your requests for security
reasons. You can learn more about CORS [on the Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Inside of `app/server.py`, add this import:

```
from fastapi.middleware.cors import CORSMiddleware
```

And these lines:

```
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Using a wildcard is okay here because this is just intended for development and nothing sensitive should ever be 
stored on the server. If you'd like to lock it down a bit more, you can replace the wildcard in `allow_origins` 
with `https://prompthippo.net.com`.

## Run the Server

After you've set everything up, run the server and take note of the `/invoke` URL of the 
runnable that you are interested in testing. For me, it's `http://0.0.0.0:8000/invoke`.

## Use NGROK for an SSL URL

Due to the [mixed content policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content), browsers do not
allow HTTP requests to be served 

## Conntect to Prompt Hippo

Inside the [Prompt Hippo app](/app), click on "Model: ... ⚙️"

![horizontal button menu](/images/horiz-btns.png)

Next, select "Custom LangServe URL 🦜"

![image](/images/model-modal.png)

Finally, input your entire LangServe URL into the prompt box and click "OK".

If all goes well, you should see the model as "Custom LangServe 🦜":

![image](/images/horiz-btns-langserve.png)

Congrats! Click on "Run All" and like magic you will have all the results available side-by-side
for AB testing and comparison, and you can try out validators to ensure your agents
are running properly. 
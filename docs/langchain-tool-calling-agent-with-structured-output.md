# Tool Calling Agent with Structured Output using LangChain 🦜 + MCP Integration

by [Jon York](https://x.com/jonyorked) on 6/28/25

![hippo programming](/images/programmer-hippo.png)

[LangChain](https://www.langchain.com/) does not natively support structured output 
for tool calling agents (boooo!). But, it supports both structured output and tool calling
for LLMs seperately. This guide will show how to first build tools and tool calling agents,
next how to build agents with structured outputs, and finally how to combine the two into one
mega-agent that can do both. 

## Table Of Contents

1. [Installing LangChain](#installing-langchain)
2. [Tool Calling Agent](#tool-calling-agent)
3. [Agent with Structured Output](#agent-with-structured-output)
4. [Agent with Tool Calling and Structured Output](#agent-with-tool-calling-and-structured-output)
5. [Conclusion](#conclusion)

<div style="display: flex; align-items: center; gap: 12px;">
    <img src="https://github.com/favicon.ico" style="height: 24px; width: 24px;" alt="GitHub logo"/>
    <a href="https://github.com/JonPizza/sample-code/tree/main/prompthippo/tool-calling-w-structured-out" style="vertical-align: middle;">
        View code on GitHub
    </a>
</div>

# Installing LangChain 🦜

For this guide, we will use the core LangChain module, and also the `openai` add-on.

**Important!** Everything done in this tutorial is also possible to do with Anthropic models, which 
tend to perform much better on certain tasks like coding. To use them, 
first pip install `langchain-anthropic`, and then use `ChatAnthropic` in place of `ChatOpenAI`. 

```sh
$ pip install langchain langchain-openai
```

You should also load your API key (which you can find [here](https://platform.openai.com/api-keys)) into your environment variables like this, so it can automatically get picked up by LangChain:

```sh
$ export OPENAI_API_KEY='sk-xxx'
```

Alternately (not recommended), you can load your key directly by passing `api_key='sk-...'` to `ChatOpenAI`.

# Tool Calling Agent

A tool calling agent is an LLM that is equipped with extra functionality. The structure of these 
agents is that in the request to the LLM provider both the messages and tool options are sent. 
The LLM is then able to invoke these tools by responding with a `ToolMessage` instead of an `AIMessage`,
which then passes execution back to your computer to run the tool, collect the output, and sent it back
to the LLM.

In LangChain, the behind-the-scenes of tool calling is taken care of when we use an `AgentExecutor`, 
meaning that you don't need to worry about executing the tool calls yourself. Instead, 
you create a tool calling agent which will automatically handle the back-and-forth from the LLM.

## LangChain Tool Guide

### Creating A Tool

The easiest way to create a LangChain tool is by using the `@tool` decorator, like so:

```python
from langchain_core.tools import tool

@tool
def add(a: float, b: float) -> float:
    """
    Add two numbers together.

    Args:
        a (float): First number
        b (float): Second number

    Returns:
        float: Sum of a and b
    """
    return a + b

print(type(add)) 
# Output: <class 'langchain_core.tools.structured.StructuredTool'>
```

Since LLMs are notriously bad at math, we can provide this tool to give it a solid way of performing addition. 
Note that one awesome thing about this approach is that the function name, argument names + types, AND **the docstring** will all be
provided to the LLM! So writing a good docstring is important so that the LLM understands what to expect from the tool call.
Anyways, sorry, I know, just an `add` tool is pretty (really) lame. You can build out your own more powerful tool set, or, alternatively, integrate with MCP!

### Integrating with MCP Servers

[Model Context Protocol](https://modelcontextprotocol.io/introduction) is one of the latest developments in the 
LLM ecosystem. MCP allows LLMs to easily integrate with a wide range of tools, remote or local, instead of 
requiring you build your own. Imagine letting your LLM agent take a trip to the hardware store rather than
giving it a few screwdrivers you have lying around your basement.

Luckily for us, LangChain offers an MCP integration. For
an example, we will use [CoinGecko MCP](https://mcp.api.coingecko.com/) as it is currently an MCP server that
does not require any API key. MCP servers broadcast sets of tools that are available for use, and our code will
first poll the server for a list of available tools and then automatically add them into the LLM agent's toolkit.

You can check out other MCP servers on [Awesome MCP Servers](https://github.com/wong2/awesome-mcp-servers).

If you want to use the langchain MCP integration, first install it:

```sh
$ pip install langchain-mcp-adapters
```

Then, you can get the list of tools from our example MCP server just like this:

```py
import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
    {
        "coingecko": {
            "url": "https://mcp.api.coingecko.com/sse",
            "transport": "sse",  # <--- This will change depending on which server you use!
        }
    }
)

async def get_mcp_tools():
    tools = await client.get_tools()
    return tools

print(type(asyncio.run(get_mcp_tools())[0]))
# Output: <class 'langchain_core.tools.structured.StructuredTool'>
```

Various MCP servers have different transport types. In this case, the CoinGecko server uses
`sse` as their transport type, but `http` and `streamable_http` are also options, and you can
also define local MCP servers to work over `stdio`. Check out the [`langchain-mcp-adapters`](https://langchain-ai.github.io/langgraph/agents/mcp/)
docs for more.

## Creating the Agent

Now with our tools defined or imported from MCP, we can create our tool calling agent and ask it 
some questions. 

```python
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
from langchain_openai import ChatOpenAI

# Combine the tools into one list
tools = asyncio.run(get_mcp_tools())
tools.append(add)

# Reads the API key from environment variable `OPENAI_API_KEY` by default
# Use `gpt-4.1` since it is trained to do well with tool calls
llm = ChatOpenAI(model="gpt-4.1")

prompt = ChatPromptTemplate(
    [
        (
            "system",
            "You are a helpful assistant. Find the sum of the price of bitcoin and ethereum.",
        ),
        ("placeholder", "{messages}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
)

tool_calling_agent = create_tool_calling_agent(llm, tools, prompt=prompt)

# Remove the `verbose` argument for less output
agent_executor = AgentExecutor(agent=tool_calling_agent, tools=tools, verbose=True)


async def generate_response(msg: str) -> str:
    response = await agent_executor.ainvoke({"messages": [HumanMessage(msg)]})
    return response["output"]


print(asyncio.run(generate_response("Can you sum the price of bitcoin and ethereum?")))
```

Here, the key is that we used an `AgentExecutor`. This is LangChain's object that executes the tool calls automatically. In the `prompt` variable 
we include an `agent_scratchpad` which will get populated by tool calls and tool outputs as the agent does it's work, but all that we need to be 
concerned about is the final output. To extend this to a multi-message conversation thread, you can just pass multiple messages in the `.ainvoke(...)`
call. **Note**: `AgentExecutor` must be run asyncronously. 

This code ultimately runs the agent and asks it to calculate the sum of bitcoin and ethereum, so it has to:

1. Fetch the prices of both assets using CoinGecko MCP tools
2. Call the `add` tool we created to calculate the sum

And what we get is exactly that!

```sh
$ python3 tool_agent_mcp_integration.py 

> Entering new AgentExecutor chain...

Invoking: `get_simple_price` with `{'ids': 'bitcoin,ethereum', 'vs_currencies': 'usd'}`

{
  "bitcoin": {
    "usd": 107326
  },
  "ethereum": {
    "usd": 2434.37
  }
}
Invoking: `add` with `{'a': 107326, 'b': 2434.37}`

109760.37The sum of the current price of bitcoin and ethereum is $109,760.37.

> Finished chain.
The sum of the current price of bitcoin and ethereum is $109,760.37.
```

Pretty AWESOME!

[View full code on GitHub](https://github.com/JonPizza/sample-code/blob/main/prompthippo/tool-calling-w-structured-out/tool_agent_mcp_integration.py)

# Agent With Structured Output

Creating an agent that can respond with structured output is a bit easier than making a tool calling agent, but
it can still be a little bit tricky. 

We will create a [Pydantic](https://docs.pydantic.dev/latest/) object to pass to an LLM and have it fill out the model's fields.

## Example

In this example, let's pretend we want to classify books based on the first page of text.

Let's define our model like this:

```py
from typing import Literal
from pydantic import BaseModel, Field


class BookOutput(BaseModel):
    target_audience: Literal["kids", "teens", "young adult", "adult", "elderly"] = (
        Field(..., description="The target audience of the book")
    )
    reading_level: int = Field(
        ...,
        gt=0,
        lt=6,
        description="How difficult the book is to read for the target_audience. Higher means more difficult.",
    )
```

Pydantic is an incredibly helpful tool for dealing with LLMs since it gives us fine-grained control over the 
fields and easy validation to make sure that the LLM didn't hallucinate and provide incorrect responses. You
can even add [custom validators](https://docs.pydantic.dev/latest/concepts/validators/) to further refine and validate
the LLM responses.

Now, to pass this to an LLM and begin getting structured responses from LLMs, let's create an LLM and bind the structure
that we created to it.

```python
import textwrap
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1")

llm_with_structure = llm.with_structured_output(BookOutput)

response = llm_with_structure.invoke(
    [
        (
            "system",
            "You are determining the target audience and reading level of a book based on the first page of the book.",
        ),
        (
            "human",
            textwrap.dedent("""\
        Tomorrow, and Tomorrow, and Tomorrow: Chapter 1

        Before Mazer invented himself as Mazer, he was Samson Mazer, and before ... (truncated)
        """),
        ),
    ]
)

print(type(response))
print(response)
```

Just like that, we are getting structured output back from the LLM:

```sh
$ python3 structured_output.py 
<class '__main__.BookOutput'>
target_audience='adult' reading_level=5
```

[View full code on GitHub](https://github.com/JonPizza/sample-code/blob/main/prompthippo/tool-calling-w-structured-out/structured_output.py)

# Agent with Tool Calling and Structured Output

Now, the tricky thing is writing code that can do both tool calling and
structured output at the same exact time. The problem is that although LangChain
offers a simple solution for both tool calling and structured output, they are
unfortunately incompatible with one another, so we will have to do the work
of the `AgentExecutor` ourselves. Fortunately it gives us a bit more flexibility,
but the implementation can be a bit messy.

The trick here is that we pass in the structed output as a tool itself along with
other tools, and if the LLM chooses the structured output tool, then we take the args that
the tool was called with to construct a Pydantic object.

## Code Example

```python
from typing import List, Optional, Any

from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, ToolMessage


async def generate_structured_output(
    messages: List[BaseMessage],
    structure: BaseModel,
    tools: Optional[List[Any]] = None,
    model_name: Optional[str] = "gpt-4.1",
    temperature: float = 0.1,
    max_executions: int = 10,
) -> BaseModel:
    """
    Get a structured response from an LLM using LangChain's with_structured_output method
    with optional tool calling support.

    Args:
        messages: List of LangChain message objects
        structure: Pydantic BaseModel class defining the expected response structure
        tools: Optional list of LangChain tools that the model can use
        model_name: Specific model to use
        temperature: Model temperature for response generation
        max_executions:
            Maximum number of iterations for agent execution (if using tools).
            If `max_executions` = 1, then will simply run structured output.

    Returns:
        Instance of the provided Pydantic model with the LLM's response data
    """
    assert max_executions >= 1

    llm = ChatOpenAI(model=model_name, temperature=temperature)

    # If there are no tools, just simply run a LLM w/ structured output
    if not tools:
        model_with_structure = llm.with_structured_output(structure)
        result = await model_with_structure.ainvoke(messages)

        return result

    # Add the structure as a tool alongside other tools
    all_tools = tools + [structure]

    # Bind all tools including the structure as a tool
    # Use tool_choice="any" to force LLM to use any of the tools
    llm_with_tools = llm.bind_tools(all_tools, tool_choice="any")
    response = await llm_with_tools.ainvoke(messages)

    llm_forced_structure = llm.bind_tools([structure], tool_choice="any")

    for _ in range(max_executions - 1):
        structure_tool_call = None

        for tool_call in response.tool_calls:
            if tool_call["name"] == structure.__name__:
                structure_tool_call = tool_call
                break

        if structure_tool_call:
            if not structure_tool_call["args"]:
                raise Exception(
                    "Tool call result empty, likely ran out of tokens. Increase `max_tokens`."
                )

            # Create the structured response from the tool call arguments
            return structure(**structure_tool_call["args"])
        else:
            tool_messages = []

            for tool_call in response.tool_calls:
                # Find and execute the tool
                for tool in tools:
                    if hasattr(tool, "name") and tool.name == tool_call["name"]:
                        try:
                            tool_result = await tool.ainvoke(tool_call["args"])
                            tool_messages.append(
                                ToolMessage(
                                    content=str(tool_result),
                                    tool_call_id=tool_call["id"],
                                )
                            )
                            break
                        except Exception as e:
                            tool_messages.append(
                                ToolMessage(
                                    content=f"Error: {str(e)}",
                                    tool_call_id=tool_call["id"],
                                )
                            )
                            break

            # Add tool results to conversation and try again
            messages = messages + [response] + tool_messages
            response = await llm_with_tools.ainvoke(messages)

    # Reached max tool executions, generate structured response now.
    return await llm_forced_structure.ainvoke(messages)
```

Let's use this to further our book classification system by providing a tool that lets the LLM fetch book reviews by title.

```py
import textwrap
import asyncio
from typing import Literal
from pydantic import Field
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage


class BookOutput(BaseModel):
    target_audience: Literal["kids", "teens", "young adult", "adult", "elderly"] = (
        Field(..., description="The target audience of the book")
    )
    reading_level: int = Field(
        ...,
        gt=0,
        lt=6,
        description="How difficult the book is to read for the target_audience. Higher is harder.",
    )


@tool
def collect_book_reviews(book_title: str) -> list[str]:
    """
    Retrieves book reviews from various trustworthy sources.

    Args:
        book_title (str): The title of the book to lookup reviews for

    Returns:
        list[str]: A list of book reviews
    """

    # A proper implementation that hits some API calls, etc. ...
    print(f'Called `collect_book_reviews` tool with book title "{book_title}"')

    return [
        "This book knocked my socks off! It was a difficult but managable read for me as I went into college.",
        "Tomorrow and Tomorrow and Tomorrow is a fantastic book for young adults who are looking to improve their reading level.",
    ]


async def main():
    return await generate_structured_output(
        [
            SystemMessage(
                textwrap.dedent("""\
                You are classifying books based on their first page of text.
                
                Use your `collect_book_reviews` tool.
                """)
            ),
            HumanMessage(
                textwrap.dedent("""\
                Tomorrow, and Tomorrow, and Tomorrow: Chapter 1

                Before Mazer invented himself as Mazer, ... (truncated)
                """)
            ),
        ],
        BookOutput,
        [collect_book_reviews],
    )

print(asyncio.run(main()))
```

And look how awesome this is! The LLM now uses the `collect_book_reviews` tool before telling us the output, and uses the information from 
the tool to adjust the values in the final Pydantic object:

```sh
$ python3 structured_tool_agent.py 
Called `collect_book_reviews` tool with book title "Tomorrow, and Tomorrow, and Tomorrow"
target_audience='young adult' reading_level=4
```

[View full code on GitHub](https://github.com/JonPizza/sample-code/blob/main/prompthippo/tool-calling-w-structured-out/structured_tool_agent.py)

# Conclusion

<iframe src="https://giphy.com/embed/GeimqsH0TLDt4tScGw" width="480" height="322" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

Wrangling LLMs to run the way you want is no easy task. With a little engineering we
are able to combine two key enhancements of the abilities of LLMs and reliably get well-informed 
structured outputs from LLMs. 

Another essential item in ensuring that LLMs properly work is the prompt. For an easy prompt
building experience, you can try out [PromptHippo's 100% free online tool to build prompts](/).

![hippo at the pool](/images/hippo-sunshine.png)
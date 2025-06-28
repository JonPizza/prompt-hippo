# Getting Started with Prompt Testing using PromptHippo

<iframe class="w-full" height="315" src="https://www.youtube.com/embed/RD82APpvNTE?si=ebla17mbgC3dNZUp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)

## Quick Start Guide

Welcome to PromptHippo 👋! The completely free, side-by-side-by-side-by-side-by-... prompt testing suite. In this quick start guide you will
learn how to compare your first few prompts in just a few minutes. 

**No More:** 

- Manually tweaking prompts one-by-one
- Being unsure if the changes you made actually improved the prompt or not
- Building your prompts on vibes

### Step One: Creating a Project

First, [sign in](/app) and then click on "+ New Project" in your profile page.

![profile page](/images/profile-no-projects.png)

This will create a new project for you with some test prompts already filled in.

### Step Two: Add in your API keys

In your newly created project, click on either the key icon or the warning that
says "API Key Required". 

![api key required](/images/api-key-req.png)

Then, enter the API keys for all the providers that you'd like to test out. In this demo, we will
only use [OpenAI](https://openai.com/api/), but [Anthropic](https://www.anthropic.com/api) models are available 
and open-source models are available hosted by [Groq](https://groq.com/), a company that has developed fast inference chips for LLMs. 

![api key management](/images/api-key-management.png)

### Step Three: Begin Prompt Testing

Now that everything is set up, building prompts becomes an easy task. PromptHippo offers a rich
set of features to improve your prompt building workflow.

![prompt editor](/images/app-ui.png)

The "Run All" button will run all of the message sets through the selected model, and the output will pop
up underneath. 

If you'd like to include the generation for the next thread, then click the "Append" button
to the right of the generation. 

To manually add another row of messages to the prompt messages, then click on the 
"+ Message" button in the middle, and if you aren't feeling the row anymore, just hit the eraser button to the right
of the row. 

To add another prompt to test side-by-side, click on the "+ Column" button
on the right of the first row. 

That's the basic guide on prompt testing with PromptHippo! Happy prompting!
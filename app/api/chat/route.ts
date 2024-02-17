import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken, user } = json

  console.log('messages', messages)

  const lastMsg = messages[messages.length - 1]

  const responseFromAPI = await fetch('http://localhost:5001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: lastMsg.content })
  })

  const body = await responseFromAPI.json()

  // console.log(body)

  // const userId = (await auth())?.user.id

  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  // if (previewToken) {
  //   openai.apiKey = previewToken
  // }

  // const res = await openai.chat.completions.create({
  //   model: 'gpt-3.5-turbo',
  //   messages,
  //   temperature: 0.7,
  //   stream: true
  // })

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const id = json.id ?? nanoid()
  //     const createdAt = Date.now()
  //     const path = `/chat/${id}`
  //     const payload = {
  //       id,
  //       title,
  //       userId,
  //       createdAt,
  //       path,
  //       messages: [
  //         ...messages,
  //         {
  //           content: completion,
  //           role: 'assistant'
  //         }
  //       ]
  //     }
  //     await kv.hmset(`chat:${id}`, payload)
  //     await kv.zadd(`user:chat:${userId}`, {
  //       score: createdAt,
  //       member: `chat:${id}`
  //     })
  //   }
  // })

  // return { response: body }
  return NextResponse.json({ body })
}

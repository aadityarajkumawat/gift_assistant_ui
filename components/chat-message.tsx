// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'

export interface ChatMessageProps {
  message: Message
}

const PRODUCTS = [
  {
    id: 1,
    name: 'Nutty & Nourishing Shea Big Gift',
    price: 22,
    brand_name: 'The Body Shop Home',
    brand_url: 'thebodyshop.com',
    product_vertical: 'Miscellaneous',
    product_page_url:
      'https://www.thebodyshop.com/en-us/sale/view-all-sale/nutty-nourishing-shea-big-gift/p/p173017',
    currency: 'USD',
    currency_raw: '(#1039336)',
    sub_category: '(#1039336)',
    style_and_material: '(#1039336)',
    product_image:
      '{"url":"https://media.thebodyshop.com/i/thebodyshop/1039336_G4_MEDIUM_SHEA_XM23_A0X_BRONZE_NW_INAFVPS042?$product-zoom$&fmt=auto"}'
  },
  {
    id: 2,
    name: "Gift Set - Because You're Amazing",
    availability: 'InStock',
    price: 65,
    brand_name: 'Gift Sets',
    brand_url: 'thehandmadesoapcompany.com',
    product_vertical: 'Miscellaneous',
    product_page_url:
      'https://www.thehandmadesoapcompany.com/gift-set-because-youre-amazing-703g/13189923.html',
    currency: 'USD',
    currency_raw: 13189923,
    sub_category: 13189923,
    style_and_material: 13189923,
    product_image:
      '{"url":"https://static.thcdn.com/images/large/webp//productimg/1600/1600/13189923-1145084384609286.jpg"}'
  }
]

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  console.log('CONTENT', message.content)

  const products =
    message.role !== 'user' ? JSON.parse(message.content).body.products : null

  function fetchImage(meta: any) {
    if ('product_image' in meta) {
      if (meta.product_image.length && meta.product_image[0] === '{') {
        return JSON.parse(meta.product_image).url
      }
    }

    return ''
  }

  console.log(products)

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.role !== 'user'
            ? JSON.parse(message.content).body.response2
            : message.content}
        </MemoizedReactMarkdown>
        {/* Products go here */}

        <div className="flex justify-start items-start gap-2">
          {products &&
            products.map((prod: any, i: any) => (
              <div className="border rounded-md">
                <img
                  className="w-[100px] h-[100px] rounded-md bg-gray-100 dark:bg-gray-800"
                  src={fetchImage(prod.metadata)}
                  alt=""
                />
                <p>{prod.metadata.brand_name}</p>
                <p>
                  {prod.metadata.currency}:{prod.metadata.price}
                </p>
              </div>
            ))}
        </div>

        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}

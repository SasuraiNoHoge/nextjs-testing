import '@testing-library/jest-dom/extend-expect'
import { cleanup, render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import CommentPage from '../pages/comment-page'

const server = setupServer(
  rest.get(
    'https://jsonplaceholder.typicode.com/comments/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            postId: 1,
            id: 1,
            name: 'A',
            email: 'dummya@mail.com',
            body: 'test body a',
          },
          {
            postId: 2,
            id: 2,
            name: 'B',
            email: 'dummyb@mail.com',
            body: 'test body b',
          },
        ])
      )
    }
  )
)
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
  // キャッシュをクリアする
  // cache.clear()
})
afterAll(() => {
  server.close()
})

describe('Comment page with useSWR / Success+Error', () => {
  it('Should render the value fetched by useSWR', async () => {
    // dedupingIntervalの値を増やすことでサーバの負荷を低減，テスト時は0
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    expect(await screen.findByText('1: test body a')).toBeInTheDocument()
    expect(screen.getByText('2: test body b')).toBeInTheDocument()
  })
  // serverでmockした値をfailedさせるために上書き
  it('Should render Error text when fetch failed', async () => {
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/comments/?_limit=10',
        (req, res, ctx) => {
          // 400を返す
          return res(ctx.status(400))
        }
      )
    )
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    expect(await screen.findByText('Error!')).toBeInTheDocument()
  })
})

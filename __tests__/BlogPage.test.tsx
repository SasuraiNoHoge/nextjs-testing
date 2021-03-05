import '@testing-library/jest-dom/extend-expect'
import { cleanup, render, screen } from '@testing-library/react'
// apiのモックに使う
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getPage, initTestHelpers } from 'next-page-tester'

initTestHelpers()

// ダミーデータ
const handlers = [
  rest.get(
    'https://jsonplaceholder.typicode.com/posts/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'dummy title 1',
            body: 'dummy body 1',
          },
          {
            userId: 2,
            id: 2,
            title: 'dummy title 2',
            body: 'dummy body 2',
          },
        ])
      )
    }
  ),
]
// サーバの構築
const server = setupServer(...handlers)
// テストファイルの最初にサーバを起動
beforeAll(() => {
  server.listen()
})
// itが終わるたびにサーバーのリセット
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
// 全てのテストが終了したら閉じる
afterAll(() => {
  server.close()
})

describe(`Blog page`, () => {
  it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/blog-page',
    })
    render(page)
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    expect(screen.getByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy title 2')).toBeInTheDocument()
  })
})

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
// ユーザのクリックに使う
import userEvent from '@testing-library/user-event'
import { getPage, initTestHelpers } from 'next-page-tester'

initTestHelpers()

describe('Navigation by Link', () => {
  it('Should route to selected page in navbar', async () => {
    // index.tsxにアクセス
    const { page } = await getPage({
      route: '/index',
    })
    // htmlの構造を取得
    render(page)

    // blogNavをクリックする
    userEvent.click(screen.getByTestId('blog-nav'))
    // blog pageのテキストが表示されるか?
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    // screen.debug()
    // コメントページへの遷移
    userEvent.click(screen.getByTestId('comment-nav'))
    // blog pageのテキストが表示されるか?
    expect(await screen.findByText('comment page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('context-nav'))
    // blog pageのテキストが表示されるか?
    expect(await screen.findByText('context page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('task-nav'))
    // blog pageのテキストが表示されるか?
    expect(await screen.findByText('todos page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('home-nav'))
    // blog pageのテキストが表示されるか?
    expect(await screen.findByText('Welcome to Nextjs')).toBeInTheDocument()
  })
})

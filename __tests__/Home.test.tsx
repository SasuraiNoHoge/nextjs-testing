import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

// Homeコンポーネントを描画し，テキストにHello Nextjsが含まれるか確認

it('Should render hello text', () => {
  render(<Home />)
  // 実際のレンダリング内容を出力
  // screen.debug()
  expect(screen.getByText('Welcome to Nextjs')).toBeInTheDocument()
})

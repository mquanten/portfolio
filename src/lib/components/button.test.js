import '@testing-library/jest-dom'
import {fireEvent, render} from '@testing-library/svelte'
import Button from './button.svelte'

test('button displays correct text on render', () => {
  const {getByText} = render(Button, {text: 'Hello', clickText: 'Clicked'})
  expect(getByText('Hello')).toBeInTheDocument()
})

test('button changes to correct text on click', async () => {
  const {getByText} = render(Button, {text: 'Hello', clickText: 'Clicked'})
  const button = getByText('Hello')
  await fireEvent.click(button)
  expect(button).toHaveTextContent('Clicked')
})
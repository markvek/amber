import { Button } from '../components/ui/Button'

export function EmptyPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <Button onClick={() => console.log('clicked')}>Click me</Button>
    </div>
  )
}

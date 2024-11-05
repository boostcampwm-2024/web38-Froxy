import { Button } from './components/ui/button';

export function App() {
  return (
    <div>
      <h1 className="text-teal-400">Hello world</h1>
      <Button onClick={() => alert('Hello')}>click me</Button>
    </div>
  );
}

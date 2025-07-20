import Container from './Container';

export const Header = () => {
  return (
    <header className="mt-8 mb-2">
      <Container>
        <div className="flex justify-between items-center gap-4 h-16">
          <div>
            <h1 className="text-5xl font-bold">Todo App</h1>
          </div>
        </div>
      </Container>
    </header>
  );
};

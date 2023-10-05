type Props = {
  children: React.ReactNode;
};

export function MainShell({ children }: Props) {
  return (
    <main className="container flex justify-center px-4">
      <div>{children}</div>
    </main>
  );
}

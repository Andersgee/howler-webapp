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

export function MainShellFull({ children }: Props) {
  return (
    <main className="container flex justify-center px-4">
      <div className="w-full">{children}</div>
    </main>
  );
}
